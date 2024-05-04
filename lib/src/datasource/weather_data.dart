import 'dart:developer';

import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:portfolio/src/datasource/firestore_upload.dart';
import 'package:portfolio/src/model/location_model.dart';
import 'package:weatherapi/weatherapi.dart';

class WeatherData {
  final Weatherapi weatherapi = Weatherapi();

  Future<List<CurrentObs>> getWeatherData(double lat, double long) async {
    String apiKey = dotenv.get(
      'API_KEY',
    );

    log('API KEY: $apiKey');
    log('lat: $lat');
    log('long: $long');

    final response =
        await weatherapi.getCurrentWeatherDataApi().currentlatlatlonlonGet(
              lat: lat,
              lon: long,
              key: apiKey,
            );

    log(response.data.toString());

    return response.data?.data?.map((p0) => p0).toList() ?? [];
  }
}

class LocationData {
  Future<LocationModel> getLocation() async {
    final response = await Dio().get('http://ip-api.com/json');

    log(response.data.toString());

    return LocationModel.fromJson(response.data ?? {});
  }
}
