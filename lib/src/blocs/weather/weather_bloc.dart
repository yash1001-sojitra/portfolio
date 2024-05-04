import 'dart:developer';

import 'package:bloc/bloc.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/main.dart';
import 'package:portfolio/src/comman/enum.dart';
import 'package:portfolio/src/datasource/firestore_upload.dart';
import 'package:portfolio/src/datasource/push_notification.dart';
import 'package:portfolio/src/datasource/weather_data.dart';
import 'package:portfolio/src/model/location_model.dart';
import 'package:weatherapi/weatherapi.dart';

part 'weather_event.dart';
part 'weather_state.dart';
part 'weather_bloc.freezed.dart';

class WeatherBloc extends Bloc<WeatherEvent, WeatherState> {
  WeatherBloc() : super(WeatherState.initial()) {
    on<WeatherEvent>((event, emit) async {
      await event.map(
        fetchWeather: (e) async {
          log("fetching blogs");
          log("state.locationModel?.lat ${state.locationModel?.lat}");
          log("state.locationModel?.lon ${state.locationModel?.lon}");
          await WeatherData()
              .getWeatherData(
            state.locationModel?.lat ?? 21.0,
            state.locationModel?.lon ?? 78.0,
          )
              .then((value) {
            emit(state.copyWith(
              requestState: RequestState.loaded,
              weatherlist: value,
            ));
            add(const WeatherEvent.storeWeather());
          });
        },
        storeWeather: (e) async {
          try {
            state.weatherlist.map((e) async {
              await FirestoreUpload().uploadData({
                "CountryCode": e.countryCode,
                "City": e.cityName,
                "Temperature": e.appTemp,
                "DateTime": e.datetime,
                "lat": e.lat,
                "lon": e.lon,
                "timezone": e.timezone,
                "weather": e.weather?.description ?? "",
                "icon": e.weather?.icon ?? "",
                "WindSpeed": e.windSpeed,
                "WindDir": e.windDir,
                "uv": e.uv,
                "Sunrise": e.sunrise,
                "Sunset": e.sunset,
              });
            });

            // send notification to user
            if (state.weatherlist.isNotEmpty) {
              add(const WeatherEvent.sendNotification());
            }
          } catch (e) {
            log("Error in storing data ${e.toString()}");
          }
        },
        sendNotification: (e) {
          if (token != null) {
            // send notification to user
            sendPushMessageToWeb(
              token!,
              "Weather of ${state.weatherlist.first.cityName} is ${state.weatherlist.first.appTemp}",
              "New Blog Added",
            );
          } else {
            FirebaseMessaging.instance.getToken().then((value) {
              token = value;
              sendPushMessageToWeb(
                token!,
                "Weather of ${state.weatherlist.first.cityName} is ${state.weatherlist.first.appTemp}",
                "New Blog Added",
              );
            });
          }
        },
        getlocation: (_GetLocation value) async {
          await LocationData().getLocation().then((value) {
            try {
              FirestoreUpload().uploadAnalytics(value.toJson());
            } catch (e) {
              log("Error in storing data ${e.toString()}");
            }
            emit(
              state.copyWith(locationModel: value),
            );
          });
        },
      );
    });
  }
}
