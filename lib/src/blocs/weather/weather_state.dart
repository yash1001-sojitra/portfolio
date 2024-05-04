part of 'weather_bloc.dart';

@freezed
class WeatherState with _$WeatherState {


   const factory WeatherState({
    required RequestState requestState,
    required List<CurrentObs> weatherlist,
    required LocationModel? locationModel,
  }) = _WeatherState;

  factory WeatherState.initial() => const WeatherState(
        requestState: RequestState.empty,
        weatherlist: [],
        locationModel: null,
      );
}
