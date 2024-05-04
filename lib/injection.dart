import 'package:get_it/get_it.dart';
import 'package:portfolio/src/blocs/navigate/navigate_bloc.dart';
import 'package:portfolio/src/blocs/weather/weather_bloc.dart';

final locator = GetIt.instance;

void init() {
  final navigatebloc = NavigateBloc();
  locator.registerFactory(
    () => navigatebloc,
  );
  final weatherbloc = WeatherBloc();
  locator.registerFactory(
    () => weatherbloc,
  );
}
