part of 'weather_bloc.dart';

@freezed
class WeatherEvent with _$WeatherEvent {

   const factory WeatherEvent.fetchWeather()  = _FetchWeather;

  // store all to database 
  const factory WeatherEvent.storeWeather() = _StoreWeather;

  // send notification to user
  const factory WeatherEvent.sendNotification() = _SendNotification;

  // get all from database

  const factory WeatherEvent.getlocation() = _GetLocation;
}