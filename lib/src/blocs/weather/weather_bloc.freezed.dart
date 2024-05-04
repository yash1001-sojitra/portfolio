// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'weather_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$WeatherEvent {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() fetchWeather,
    required TResult Function() storeWeather,
    required TResult Function() sendNotification,
    required TResult Function() getlocation,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchWeather,
    TResult? Function()? storeWeather,
    TResult? Function()? sendNotification,
    TResult? Function()? getlocation,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchWeather,
    TResult Function()? storeWeather,
    TResult Function()? sendNotification,
    TResult Function()? getlocation,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_FetchWeather value) fetchWeather,
    required TResult Function(_StoreWeather value) storeWeather,
    required TResult Function(_SendNotification value) sendNotification,
    required TResult Function(_GetLocation value) getlocation,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchWeather value)? fetchWeather,
    TResult? Function(_StoreWeather value)? storeWeather,
    TResult? Function(_SendNotification value)? sendNotification,
    TResult? Function(_GetLocation value)? getlocation,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchWeather value)? fetchWeather,
    TResult Function(_StoreWeather value)? storeWeather,
    TResult Function(_SendNotification value)? sendNotification,
    TResult Function(_GetLocation value)? getlocation,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $WeatherEventCopyWith<$Res> {
  factory $WeatherEventCopyWith(
          WeatherEvent value, $Res Function(WeatherEvent) then) =
      _$WeatherEventCopyWithImpl<$Res, WeatherEvent>;
}

/// @nodoc
class _$WeatherEventCopyWithImpl<$Res, $Val extends WeatherEvent>
    implements $WeatherEventCopyWith<$Res> {
  _$WeatherEventCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;
}

/// @nodoc
abstract class _$$FetchWeatherImplCopyWith<$Res> {
  factory _$$FetchWeatherImplCopyWith(
          _$FetchWeatherImpl value, $Res Function(_$FetchWeatherImpl) then) =
      __$$FetchWeatherImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$FetchWeatherImplCopyWithImpl<$Res>
    extends _$WeatherEventCopyWithImpl<$Res, _$FetchWeatherImpl>
    implements _$$FetchWeatherImplCopyWith<$Res> {
  __$$FetchWeatherImplCopyWithImpl(
      _$FetchWeatherImpl _value, $Res Function(_$FetchWeatherImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$FetchWeatherImpl implements _FetchWeather {
  const _$FetchWeatherImpl();

  @override
  String toString() {
    return 'WeatherEvent.fetchWeather()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$FetchWeatherImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() fetchWeather,
    required TResult Function() storeWeather,
    required TResult Function() sendNotification,
    required TResult Function() getlocation,
  }) {
    return fetchWeather();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchWeather,
    TResult? Function()? storeWeather,
    TResult? Function()? sendNotification,
    TResult? Function()? getlocation,
  }) {
    return fetchWeather?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchWeather,
    TResult Function()? storeWeather,
    TResult Function()? sendNotification,
    TResult Function()? getlocation,
    required TResult orElse(),
  }) {
    if (fetchWeather != null) {
      return fetchWeather();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_FetchWeather value) fetchWeather,
    required TResult Function(_StoreWeather value) storeWeather,
    required TResult Function(_SendNotification value) sendNotification,
    required TResult Function(_GetLocation value) getlocation,
  }) {
    return fetchWeather(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchWeather value)? fetchWeather,
    TResult? Function(_StoreWeather value)? storeWeather,
    TResult? Function(_SendNotification value)? sendNotification,
    TResult? Function(_GetLocation value)? getlocation,
  }) {
    return fetchWeather?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchWeather value)? fetchWeather,
    TResult Function(_StoreWeather value)? storeWeather,
    TResult Function(_SendNotification value)? sendNotification,
    TResult Function(_GetLocation value)? getlocation,
    required TResult orElse(),
  }) {
    if (fetchWeather != null) {
      return fetchWeather(this);
    }
    return orElse();
  }
}

abstract class _FetchWeather implements WeatherEvent {
  const factory _FetchWeather() = _$FetchWeatherImpl;
}

/// @nodoc
abstract class _$$StoreWeatherImplCopyWith<$Res> {
  factory _$$StoreWeatherImplCopyWith(
          _$StoreWeatherImpl value, $Res Function(_$StoreWeatherImpl) then) =
      __$$StoreWeatherImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$StoreWeatherImplCopyWithImpl<$Res>
    extends _$WeatherEventCopyWithImpl<$Res, _$StoreWeatherImpl>
    implements _$$StoreWeatherImplCopyWith<$Res> {
  __$$StoreWeatherImplCopyWithImpl(
      _$StoreWeatherImpl _value, $Res Function(_$StoreWeatherImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$StoreWeatherImpl implements _StoreWeather {
  const _$StoreWeatherImpl();

  @override
  String toString() {
    return 'WeatherEvent.storeWeather()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$StoreWeatherImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() fetchWeather,
    required TResult Function() storeWeather,
    required TResult Function() sendNotification,
    required TResult Function() getlocation,
  }) {
    return storeWeather();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchWeather,
    TResult? Function()? storeWeather,
    TResult? Function()? sendNotification,
    TResult? Function()? getlocation,
  }) {
    return storeWeather?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchWeather,
    TResult Function()? storeWeather,
    TResult Function()? sendNotification,
    TResult Function()? getlocation,
    required TResult orElse(),
  }) {
    if (storeWeather != null) {
      return storeWeather();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_FetchWeather value) fetchWeather,
    required TResult Function(_StoreWeather value) storeWeather,
    required TResult Function(_SendNotification value) sendNotification,
    required TResult Function(_GetLocation value) getlocation,
  }) {
    return storeWeather(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchWeather value)? fetchWeather,
    TResult? Function(_StoreWeather value)? storeWeather,
    TResult? Function(_SendNotification value)? sendNotification,
    TResult? Function(_GetLocation value)? getlocation,
  }) {
    return storeWeather?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchWeather value)? fetchWeather,
    TResult Function(_StoreWeather value)? storeWeather,
    TResult Function(_SendNotification value)? sendNotification,
    TResult Function(_GetLocation value)? getlocation,
    required TResult orElse(),
  }) {
    if (storeWeather != null) {
      return storeWeather(this);
    }
    return orElse();
  }
}

abstract class _StoreWeather implements WeatherEvent {
  const factory _StoreWeather() = _$StoreWeatherImpl;
}

/// @nodoc
abstract class _$$SendNotificationImplCopyWith<$Res> {
  factory _$$SendNotificationImplCopyWith(_$SendNotificationImpl value,
          $Res Function(_$SendNotificationImpl) then) =
      __$$SendNotificationImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$SendNotificationImplCopyWithImpl<$Res>
    extends _$WeatherEventCopyWithImpl<$Res, _$SendNotificationImpl>
    implements _$$SendNotificationImplCopyWith<$Res> {
  __$$SendNotificationImplCopyWithImpl(_$SendNotificationImpl _value,
      $Res Function(_$SendNotificationImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$SendNotificationImpl implements _SendNotification {
  const _$SendNotificationImpl();

  @override
  String toString() {
    return 'WeatherEvent.sendNotification()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$SendNotificationImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() fetchWeather,
    required TResult Function() storeWeather,
    required TResult Function() sendNotification,
    required TResult Function() getlocation,
  }) {
    return sendNotification();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchWeather,
    TResult? Function()? storeWeather,
    TResult? Function()? sendNotification,
    TResult? Function()? getlocation,
  }) {
    return sendNotification?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchWeather,
    TResult Function()? storeWeather,
    TResult Function()? sendNotification,
    TResult Function()? getlocation,
    required TResult orElse(),
  }) {
    if (sendNotification != null) {
      return sendNotification();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_FetchWeather value) fetchWeather,
    required TResult Function(_StoreWeather value) storeWeather,
    required TResult Function(_SendNotification value) sendNotification,
    required TResult Function(_GetLocation value) getlocation,
  }) {
    return sendNotification(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchWeather value)? fetchWeather,
    TResult? Function(_StoreWeather value)? storeWeather,
    TResult? Function(_SendNotification value)? sendNotification,
    TResult? Function(_GetLocation value)? getlocation,
  }) {
    return sendNotification?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchWeather value)? fetchWeather,
    TResult Function(_StoreWeather value)? storeWeather,
    TResult Function(_SendNotification value)? sendNotification,
    TResult Function(_GetLocation value)? getlocation,
    required TResult orElse(),
  }) {
    if (sendNotification != null) {
      return sendNotification(this);
    }
    return orElse();
  }
}

abstract class _SendNotification implements WeatherEvent {
  const factory _SendNotification() = _$SendNotificationImpl;
}

/// @nodoc
abstract class _$$GetLocationImplCopyWith<$Res> {
  factory _$$GetLocationImplCopyWith(
          _$GetLocationImpl value, $Res Function(_$GetLocationImpl) then) =
      __$$GetLocationImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$GetLocationImplCopyWithImpl<$Res>
    extends _$WeatherEventCopyWithImpl<$Res, _$GetLocationImpl>
    implements _$$GetLocationImplCopyWith<$Res> {
  __$$GetLocationImplCopyWithImpl(
      _$GetLocationImpl _value, $Res Function(_$GetLocationImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$GetLocationImpl implements _GetLocation {
  const _$GetLocationImpl();

  @override
  String toString() {
    return 'WeatherEvent.getlocation()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$GetLocationImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() fetchWeather,
    required TResult Function() storeWeather,
    required TResult Function() sendNotification,
    required TResult Function() getlocation,
  }) {
    return getlocation();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchWeather,
    TResult? Function()? storeWeather,
    TResult? Function()? sendNotification,
    TResult? Function()? getlocation,
  }) {
    return getlocation?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchWeather,
    TResult Function()? storeWeather,
    TResult Function()? sendNotification,
    TResult Function()? getlocation,
    required TResult orElse(),
  }) {
    if (getlocation != null) {
      return getlocation();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_FetchWeather value) fetchWeather,
    required TResult Function(_StoreWeather value) storeWeather,
    required TResult Function(_SendNotification value) sendNotification,
    required TResult Function(_GetLocation value) getlocation,
  }) {
    return getlocation(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchWeather value)? fetchWeather,
    TResult? Function(_StoreWeather value)? storeWeather,
    TResult? Function(_SendNotification value)? sendNotification,
    TResult? Function(_GetLocation value)? getlocation,
  }) {
    return getlocation?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchWeather value)? fetchWeather,
    TResult Function(_StoreWeather value)? storeWeather,
    TResult Function(_SendNotification value)? sendNotification,
    TResult Function(_GetLocation value)? getlocation,
    required TResult orElse(),
  }) {
    if (getlocation != null) {
      return getlocation(this);
    }
    return orElse();
  }
}

abstract class _GetLocation implements WeatherEvent {
  const factory _GetLocation() = _$GetLocationImpl;
}

/// @nodoc
mixin _$WeatherState {
  RequestState get requestState => throw _privateConstructorUsedError;
  List<CurrentObs> get weatherlist => throw _privateConstructorUsedError;
  LocationModel? get locationModel => throw _privateConstructorUsedError;

  @JsonKey(ignore: true)
  $WeatherStateCopyWith<WeatherState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $WeatherStateCopyWith<$Res> {
  factory $WeatherStateCopyWith(
          WeatherState value, $Res Function(WeatherState) then) =
      _$WeatherStateCopyWithImpl<$Res, WeatherState>;
  @useResult
  $Res call(
      {RequestState requestState,
      List<CurrentObs> weatherlist,
      LocationModel? locationModel});
}

/// @nodoc
class _$WeatherStateCopyWithImpl<$Res, $Val extends WeatherState>
    implements $WeatherStateCopyWith<$Res> {
  _$WeatherStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? requestState = null,
    Object? weatherlist = null,
    Object? locationModel = freezed,
  }) {
    return _then(_value.copyWith(
      requestState: null == requestState
          ? _value.requestState
          : requestState // ignore: cast_nullable_to_non_nullable
              as RequestState,
      weatherlist: null == weatherlist
          ? _value.weatherlist
          : weatherlist // ignore: cast_nullable_to_non_nullable
              as List<CurrentObs>,
      locationModel: freezed == locationModel
          ? _value.locationModel
          : locationModel // ignore: cast_nullable_to_non_nullable
              as LocationModel?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$WeatherStateImplCopyWith<$Res>
    implements $WeatherStateCopyWith<$Res> {
  factory _$$WeatherStateImplCopyWith(
          _$WeatherStateImpl value, $Res Function(_$WeatherStateImpl) then) =
      __$$WeatherStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {RequestState requestState,
      List<CurrentObs> weatherlist,
      LocationModel? locationModel});
}

/// @nodoc
class __$$WeatherStateImplCopyWithImpl<$Res>
    extends _$WeatherStateCopyWithImpl<$Res, _$WeatherStateImpl>
    implements _$$WeatherStateImplCopyWith<$Res> {
  __$$WeatherStateImplCopyWithImpl(
      _$WeatherStateImpl _value, $Res Function(_$WeatherStateImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? requestState = null,
    Object? weatherlist = null,
    Object? locationModel = freezed,
  }) {
    return _then(_$WeatherStateImpl(
      requestState: null == requestState
          ? _value.requestState
          : requestState // ignore: cast_nullable_to_non_nullable
              as RequestState,
      weatherlist: null == weatherlist
          ? _value._weatherlist
          : weatherlist // ignore: cast_nullable_to_non_nullable
              as List<CurrentObs>,
      locationModel: freezed == locationModel
          ? _value.locationModel
          : locationModel // ignore: cast_nullable_to_non_nullable
              as LocationModel?,
    ));
  }
}

/// @nodoc

class _$WeatherStateImpl implements _WeatherState {
  const _$WeatherStateImpl(
      {required this.requestState,
      required final List<CurrentObs> weatherlist,
      required this.locationModel})
      : _weatherlist = weatherlist;

  @override
  final RequestState requestState;
  final List<CurrentObs> _weatherlist;
  @override
  List<CurrentObs> get weatherlist {
    if (_weatherlist is EqualUnmodifiableListView) return _weatherlist;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_weatherlist);
  }

  @override
  final LocationModel? locationModel;

  @override
  String toString() {
    return 'WeatherState(requestState: $requestState, weatherlist: $weatherlist, locationModel: $locationModel)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$WeatherStateImpl &&
            (identical(other.requestState, requestState) ||
                other.requestState == requestState) &&
            const DeepCollectionEquality()
                .equals(other._weatherlist, _weatherlist) &&
            (identical(other.locationModel, locationModel) ||
                other.locationModel == locationModel));
  }

  @override
  int get hashCode => Object.hash(runtimeType, requestState,
      const DeepCollectionEquality().hash(_weatherlist), locationModel);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$WeatherStateImplCopyWith<_$WeatherStateImpl> get copyWith =>
      __$$WeatherStateImplCopyWithImpl<_$WeatherStateImpl>(this, _$identity);
}

abstract class _WeatherState implements WeatherState {
  const factory _WeatherState(
      {required final RequestState requestState,
      required final List<CurrentObs> weatherlist,
      required final LocationModel? locationModel}) = _$WeatherStateImpl;

  @override
  RequestState get requestState;
  @override
  List<CurrentObs> get weatherlist;
  @override
  LocationModel? get locationModel;
  @override
  @JsonKey(ignore: true)
  _$$WeatherStateImplCopyWith<_$WeatherStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
