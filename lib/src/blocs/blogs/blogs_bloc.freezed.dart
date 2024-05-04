// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'blogs_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$BlogsEvent {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() fetchBlogs,
    required TResult Function() storeBlogs,
    required TResult Function() sendNotification,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchBlogs,
    TResult? Function()? storeBlogs,
    TResult? Function()? sendNotification,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchBlogs,
    TResult Function()? storeBlogs,
    TResult Function()? sendNotification,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_FetchBlogs value) fetchBlogs,
    required TResult Function(_StoreBlogs value) storeBlogs,
    required TResult Function(_SendNotification value) sendNotification,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchBlogs value)? fetchBlogs,
    TResult? Function(_StoreBlogs value)? storeBlogs,
    TResult? Function(_SendNotification value)? sendNotification,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchBlogs value)? fetchBlogs,
    TResult Function(_StoreBlogs value)? storeBlogs,
    TResult Function(_SendNotification value)? sendNotification,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BlogsEventCopyWith<$Res> {
  factory $BlogsEventCopyWith(
          BlogsEvent value, $Res Function(BlogsEvent) then) =
      _$BlogsEventCopyWithImpl<$Res, BlogsEvent>;
}

/// @nodoc
class _$BlogsEventCopyWithImpl<$Res, $Val extends BlogsEvent>
    implements $BlogsEventCopyWith<$Res> {
  _$BlogsEventCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;
}

/// @nodoc
abstract class _$$FetchBlogsImplCopyWith<$Res> {
  factory _$$FetchBlogsImplCopyWith(
          _$FetchBlogsImpl value, $Res Function(_$FetchBlogsImpl) then) =
      __$$FetchBlogsImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$FetchBlogsImplCopyWithImpl<$Res>
    extends _$BlogsEventCopyWithImpl<$Res, _$FetchBlogsImpl>
    implements _$$FetchBlogsImplCopyWith<$Res> {
  __$$FetchBlogsImplCopyWithImpl(
      _$FetchBlogsImpl _value, $Res Function(_$FetchBlogsImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$FetchBlogsImpl implements _FetchBlogs {
  const _$FetchBlogsImpl();

  @override
  String toString() {
    return 'BlogsEvent.fetchBlogs()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$FetchBlogsImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() fetchBlogs,
    required TResult Function() storeBlogs,
    required TResult Function() sendNotification,
  }) {
    return fetchBlogs();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchBlogs,
    TResult? Function()? storeBlogs,
    TResult? Function()? sendNotification,
  }) {
    return fetchBlogs?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchBlogs,
    TResult Function()? storeBlogs,
    TResult Function()? sendNotification,
    required TResult orElse(),
  }) {
    if (fetchBlogs != null) {
      return fetchBlogs();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_FetchBlogs value) fetchBlogs,
    required TResult Function(_StoreBlogs value) storeBlogs,
    required TResult Function(_SendNotification value) sendNotification,
  }) {
    return fetchBlogs(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchBlogs value)? fetchBlogs,
    TResult? Function(_StoreBlogs value)? storeBlogs,
    TResult? Function(_SendNotification value)? sendNotification,
  }) {
    return fetchBlogs?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchBlogs value)? fetchBlogs,
    TResult Function(_StoreBlogs value)? storeBlogs,
    TResult Function(_SendNotification value)? sendNotification,
    required TResult orElse(),
  }) {
    if (fetchBlogs != null) {
      return fetchBlogs(this);
    }
    return orElse();
  }
}

abstract class _FetchBlogs implements BlogsEvent {
  const factory _FetchBlogs() = _$FetchBlogsImpl;
}

/// @nodoc
abstract class _$$StoreBlogsImplCopyWith<$Res> {
  factory _$$StoreBlogsImplCopyWith(
          _$StoreBlogsImpl value, $Res Function(_$StoreBlogsImpl) then) =
      __$$StoreBlogsImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$StoreBlogsImplCopyWithImpl<$Res>
    extends _$BlogsEventCopyWithImpl<$Res, _$StoreBlogsImpl>
    implements _$$StoreBlogsImplCopyWith<$Res> {
  __$$StoreBlogsImplCopyWithImpl(
      _$StoreBlogsImpl _value, $Res Function(_$StoreBlogsImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$StoreBlogsImpl implements _StoreBlogs {
  const _$StoreBlogsImpl();

  @override
  String toString() {
    return 'BlogsEvent.storeBlogs()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$StoreBlogsImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() fetchBlogs,
    required TResult Function() storeBlogs,
    required TResult Function() sendNotification,
  }) {
    return storeBlogs();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchBlogs,
    TResult? Function()? storeBlogs,
    TResult? Function()? sendNotification,
  }) {
    return storeBlogs?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchBlogs,
    TResult Function()? storeBlogs,
    TResult Function()? sendNotification,
    required TResult orElse(),
  }) {
    if (storeBlogs != null) {
      return storeBlogs();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_FetchBlogs value) fetchBlogs,
    required TResult Function(_StoreBlogs value) storeBlogs,
    required TResult Function(_SendNotification value) sendNotification,
  }) {
    return storeBlogs(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchBlogs value)? fetchBlogs,
    TResult? Function(_StoreBlogs value)? storeBlogs,
    TResult? Function(_SendNotification value)? sendNotification,
  }) {
    return storeBlogs?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchBlogs value)? fetchBlogs,
    TResult Function(_StoreBlogs value)? storeBlogs,
    TResult Function(_SendNotification value)? sendNotification,
    required TResult orElse(),
  }) {
    if (storeBlogs != null) {
      return storeBlogs(this);
    }
    return orElse();
  }
}

abstract class _StoreBlogs implements BlogsEvent {
  const factory _StoreBlogs() = _$StoreBlogsImpl;
}

/// @nodoc
abstract class _$$SendNotificationImplCopyWith<$Res> {
  factory _$$SendNotificationImplCopyWith(_$SendNotificationImpl value,
          $Res Function(_$SendNotificationImpl) then) =
      __$$SendNotificationImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$SendNotificationImplCopyWithImpl<$Res>
    extends _$BlogsEventCopyWithImpl<$Res, _$SendNotificationImpl>
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
    return 'BlogsEvent.sendNotification()';
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
    required TResult Function() fetchBlogs,
    required TResult Function() storeBlogs,
    required TResult Function() sendNotification,
  }) {
    return sendNotification();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? fetchBlogs,
    TResult? Function()? storeBlogs,
    TResult? Function()? sendNotification,
  }) {
    return sendNotification?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? fetchBlogs,
    TResult Function()? storeBlogs,
    TResult Function()? sendNotification,
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
    required TResult Function(_FetchBlogs value) fetchBlogs,
    required TResult Function(_StoreBlogs value) storeBlogs,
    required TResult Function(_SendNotification value) sendNotification,
  }) {
    return sendNotification(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_FetchBlogs value)? fetchBlogs,
    TResult? Function(_StoreBlogs value)? storeBlogs,
    TResult? Function(_SendNotification value)? sendNotification,
  }) {
    return sendNotification?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_FetchBlogs value)? fetchBlogs,
    TResult Function(_StoreBlogs value)? storeBlogs,
    TResult Function(_SendNotification value)? sendNotification,
    required TResult orElse(),
  }) {
    if (sendNotification != null) {
      return sendNotification(this);
    }
    return orElse();
  }
}

abstract class _SendNotification implements BlogsEvent {
  const factory _SendNotification() = _$SendNotificationImpl;
}

/// @nodoc
mixin _$BlogsState {
  RequestState get requestState => throw _privateConstructorUsedError;
  List<String> get blogs => throw _privateConstructorUsedError;

  @JsonKey(ignore: true)
  $BlogsStateCopyWith<BlogsState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BlogsStateCopyWith<$Res> {
  factory $BlogsStateCopyWith(
          BlogsState value, $Res Function(BlogsState) then) =
      _$BlogsStateCopyWithImpl<$Res, BlogsState>;
  @useResult
  $Res call({RequestState requestState, List<String> blogs});
}

/// @nodoc
class _$BlogsStateCopyWithImpl<$Res, $Val extends BlogsState>
    implements $BlogsStateCopyWith<$Res> {
  _$BlogsStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? requestState = null,
    Object? blogs = null,
  }) {
    return _then(_value.copyWith(
      requestState: null == requestState
          ? _value.requestState
          : requestState // ignore: cast_nullable_to_non_nullable
              as RequestState,
      blogs: null == blogs
          ? _value.blogs
          : blogs // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$BlogsStateImplCopyWith<$Res>
    implements $BlogsStateCopyWith<$Res> {
  factory _$$BlogsStateImplCopyWith(
          _$BlogsStateImpl value, $Res Function(_$BlogsStateImpl) then) =
      __$$BlogsStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({RequestState requestState, List<String> blogs});
}

/// @nodoc
class __$$BlogsStateImplCopyWithImpl<$Res>
    extends _$BlogsStateCopyWithImpl<$Res, _$BlogsStateImpl>
    implements _$$BlogsStateImplCopyWith<$Res> {
  __$$BlogsStateImplCopyWithImpl(
      _$BlogsStateImpl _value, $Res Function(_$BlogsStateImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? requestState = null,
    Object? blogs = null,
  }) {
    return _then(_$BlogsStateImpl(
      requestState: null == requestState
          ? _value.requestState
          : requestState // ignore: cast_nullable_to_non_nullable
              as RequestState,
      blogs: null == blogs
          ? _value._blogs
          : blogs // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ));
  }
}

/// @nodoc

class _$BlogsStateImpl implements _BlogsState {
  const _$BlogsStateImpl(
      {required this.requestState, required final List<String> blogs})
      : _blogs = blogs;

  @override
  final RequestState requestState;
  final List<String> _blogs;
  @override
  List<String> get blogs {
    if (_blogs is EqualUnmodifiableListView) return _blogs;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_blogs);
  }

  @override
  String toString() {
    return 'BlogsState(requestState: $requestState, blogs: $blogs)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BlogsStateImpl &&
            (identical(other.requestState, requestState) ||
                other.requestState == requestState) &&
            const DeepCollectionEquality().equals(other._blogs, _blogs));
  }

  @override
  int get hashCode => Object.hash(
      runtimeType, requestState, const DeepCollectionEquality().hash(_blogs));

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$BlogsStateImplCopyWith<_$BlogsStateImpl> get copyWith =>
      __$$BlogsStateImplCopyWithImpl<_$BlogsStateImpl>(this, _$identity);
}

abstract class _BlogsState implements BlogsState {
  const factory _BlogsState(
      {required final RequestState requestState,
      required final List<String> blogs}) = _$BlogsStateImpl;

  @override
  RequestState get requestState;
  @override
  List<String> get blogs;
  @override
  @JsonKey(ignore: true)
  _$$BlogsStateImplCopyWith<_$BlogsStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
