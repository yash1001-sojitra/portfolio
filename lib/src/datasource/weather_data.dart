import 'dart:developer';

import 'package:petapi/petapi.dart';
import 'package:built_collection/built_collection.dart';
import 'package:portfolio/main.dart';
import 'package:portfolio/src/datasource/push_notification.dart';
import 'package:weatherapi/weatherapi.dart';

class PetData {
  final Petapi petapi = Petapi();
}

BuiltList<String> builtList = BuiltList<String>([]);

class WeatherData {
  final Weatherapi weatherapi = Weatherapi();

  Future getWeatherData() async {
    final response =
        await weatherapi.getCurrentWeatherDataApi().currentlatlatlonlonGet(
              lat: 35.0,
              lon: 139.0,
              key: "f815d19fe35f417dbe4231311775205c",
            );

    log(response.data.toString());

    return response.data!;
  }
}
