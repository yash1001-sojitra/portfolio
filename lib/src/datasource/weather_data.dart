import 'dart:developer';

import 'package:museumapi/museumapi.dart';

// class PetData {
//   final Petapi petapi = Petapi();
// }

// BuiltList<String> builtList = BuiltList<String>([]);

// class WeatherData {
//   final Weatherapi weatherapi = Weatherapi();

//   Future getWeatherData() async {
//     final response =
//         await weatherapi.getCurrentWeatherDataApi().currentlatlatlonlonGet(
//               lat: 35.0,
//               lon: 139.0,
//               key: "f815d19fe35f417dbe4231311775205c",
//             );

//     log(response.data.toString());

//     return response.data!;
//   }
// }

class MuseumData {
  final Museumapi museumapi = Museumapi();

  Future<List<String>> getMuseumData() async {
    museumapi.setOAuthToken("Authorization", "MuseumPlaceholderAuth");
    final response = await museumapi.getEventsApi().listSpecialEvents(
          startDate: startdate,
          endDate: enddate,
        );

    log(response.data.toString());

    return response.data!.map((p0) => p0.location).toList();
  }
}

Date startdate = Date(2023, 02, 23);
Date enddate = Date(2023, 04, 18);
