// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'navigate_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$NavigateState {
  NavTab get currentTab => throw _privateConstructorUsedError;
  bool get isDrawerOpen => throw _privateConstructorUsedError;

  @JsonKey(ignore: true)
  $NavigateStateCopyWith<NavigateState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $NavigateStateCopyWith<$Res> {
  factory $NavigateStateCopyWith(
          NavigateState value, $Res Function(NavigateState) then) =
      _$NavigateStateCopyWithImpl<$Res, NavigateState>;
  @useResult
  $Res call({NavTab currentTab, bool isDrawerOpen});
}

/// @nodoc
class _$NavigateStateCopyWithImpl<$Res, $Val extends NavigateState>
    implements $NavigateStateCopyWith<$Res> {
  _$NavigateStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? currentTab = null,
    Object? isDrawerOpen = null,
  }) {
    return _then(_value.copyWith(
      currentTab: null == currentTab
          ? _value.currentTab
          : currentTab // ignore: cast_nullable_to_non_nullable
              as NavTab,
      isDrawerOpen: null == isDrawerOpen
          ? _value.isDrawerOpen
          : isDrawerOpen // ignore: cast_nullable_to_non_nullable
              as bool,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$NavigateStateImplCopyWith<$Res>
    implements $NavigateStateCopyWith<$Res> {
  factory _$$NavigateStateImplCopyWith(
          _$NavigateStateImpl value, $Res Function(_$NavigateStateImpl) then) =
      __$$NavigateStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({NavTab currentTab, bool isDrawerOpen});
}

/// @nodoc
class __$$NavigateStateImplCopyWithImpl<$Res>
    extends _$NavigateStateCopyWithImpl<$Res, _$NavigateStateImpl>
    implements _$$NavigateStateImplCopyWith<$Res> {
  __$$NavigateStateImplCopyWithImpl(
      _$NavigateStateImpl _value, $Res Function(_$NavigateStateImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? currentTab = null,
    Object? isDrawerOpen = null,
  }) {
    return _then(_$NavigateStateImpl(
      currentTab: null == currentTab
          ? _value.currentTab
          : currentTab // ignore: cast_nullable_to_non_nullable
              as NavTab,
      isDrawerOpen: null == isDrawerOpen
          ? _value.isDrawerOpen
          : isDrawerOpen // ignore: cast_nullable_to_non_nullable
              as bool,
    ));
  }
}

/// @nodoc

class _$NavigateStateImpl implements _NavigateState {
  const _$NavigateStateImpl(
      {required this.currentTab, required this.isDrawerOpen});

  @override
  final NavTab currentTab;
  @override
  final bool isDrawerOpen;

  @override
  String toString() {
    return 'NavigateState(currentTab: $currentTab, isDrawerOpen: $isDrawerOpen)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$NavigateStateImpl &&
            (identical(other.currentTab, currentTab) ||
                other.currentTab == currentTab) &&
            (identical(other.isDrawerOpen, isDrawerOpen) ||
                other.isDrawerOpen == isDrawerOpen));
  }

  @override
  int get hashCode => Object.hash(runtimeType, currentTab, isDrawerOpen);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$NavigateStateImplCopyWith<_$NavigateStateImpl> get copyWith =>
      __$$NavigateStateImplCopyWithImpl<_$NavigateStateImpl>(this, _$identity);
}

abstract class _NavigateState implements NavigateState {
  const factory _NavigateState(
      {required final NavTab currentTab,
      required final bool isDrawerOpen}) = _$NavigateStateImpl;

  @override
  NavTab get currentTab;
  @override
  bool get isDrawerOpen;
  @override
  @JsonKey(ignore: true)
  _$$NavigateStateImplCopyWith<_$NavigateStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
mixin _$NavigateEvent {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(NavTab tab) changeTab,
    required TResult Function() toggleDrawer,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(NavTab tab)? changeTab,
    TResult? Function()? toggleDrawer,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(NavTab tab)? changeTab,
    TResult Function()? toggleDrawer,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_ChangeTab value) changeTab,
    required TResult Function(_ToggleDrawer value) toggleDrawer,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_ChangeTab value)? changeTab,
    TResult? Function(_ToggleDrawer value)? toggleDrawer,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_ChangeTab value)? changeTab,
    TResult Function(_ToggleDrawer value)? toggleDrawer,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $NavigateEventCopyWith<$Res> {
  factory $NavigateEventCopyWith(
          NavigateEvent value, $Res Function(NavigateEvent) then) =
      _$NavigateEventCopyWithImpl<$Res, NavigateEvent>;
}

/// @nodoc
class _$NavigateEventCopyWithImpl<$Res, $Val extends NavigateEvent>
    implements $NavigateEventCopyWith<$Res> {
  _$NavigateEventCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;
}

/// @nodoc
abstract class _$$ChangeTabImplCopyWith<$Res> {
  factory _$$ChangeTabImplCopyWith(
          _$ChangeTabImpl value, $Res Function(_$ChangeTabImpl) then) =
      __$$ChangeTabImplCopyWithImpl<$Res>;
  @useResult
  $Res call({NavTab tab});
}

/// @nodoc
class __$$ChangeTabImplCopyWithImpl<$Res>
    extends _$NavigateEventCopyWithImpl<$Res, _$ChangeTabImpl>
    implements _$$ChangeTabImplCopyWith<$Res> {
  __$$ChangeTabImplCopyWithImpl(
      _$ChangeTabImpl _value, $Res Function(_$ChangeTabImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? tab = null,
  }) {
    return _then(_$ChangeTabImpl(
      tab: null == tab
          ? _value.tab
          : tab // ignore: cast_nullable_to_non_nullable
              as NavTab,
    ));
  }
}

/// @nodoc

class _$ChangeTabImpl implements _ChangeTab {
  const _$ChangeTabImpl({required this.tab});

  @override
  final NavTab tab;

  @override
  String toString() {
    return 'NavigateEvent.changeTab(tab: $tab)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChangeTabImpl &&
            (identical(other.tab, tab) || other.tab == tab));
  }

  @override
  int get hashCode => Object.hash(runtimeType, tab);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$ChangeTabImplCopyWith<_$ChangeTabImpl> get copyWith =>
      __$$ChangeTabImplCopyWithImpl<_$ChangeTabImpl>(this, _$identity);

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(NavTab tab) changeTab,
    required TResult Function() toggleDrawer,
  }) {
    return changeTab(tab);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(NavTab tab)? changeTab,
    TResult? Function()? toggleDrawer,
  }) {
    return changeTab?.call(tab);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(NavTab tab)? changeTab,
    TResult Function()? toggleDrawer,
    required TResult orElse(),
  }) {
    if (changeTab != null) {
      return changeTab(tab);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_ChangeTab value) changeTab,
    required TResult Function(_ToggleDrawer value) toggleDrawer,
  }) {
    return changeTab(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_ChangeTab value)? changeTab,
    TResult? Function(_ToggleDrawer value)? toggleDrawer,
  }) {
    return changeTab?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_ChangeTab value)? changeTab,
    TResult Function(_ToggleDrawer value)? toggleDrawer,
    required TResult orElse(),
  }) {
    if (changeTab != null) {
      return changeTab(this);
    }
    return orElse();
  }
}

abstract class _ChangeTab implements NavigateEvent {
  const factory _ChangeTab({required final NavTab tab}) = _$ChangeTabImpl;

  NavTab get tab;
  @JsonKey(ignore: true)
  _$$ChangeTabImplCopyWith<_$ChangeTabImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class _$$ToggleDrawerImplCopyWith<$Res> {
  factory _$$ToggleDrawerImplCopyWith(
          _$ToggleDrawerImpl value, $Res Function(_$ToggleDrawerImpl) then) =
      __$$ToggleDrawerImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$ToggleDrawerImplCopyWithImpl<$Res>
    extends _$NavigateEventCopyWithImpl<$Res, _$ToggleDrawerImpl>
    implements _$$ToggleDrawerImplCopyWith<$Res> {
  __$$ToggleDrawerImplCopyWithImpl(
      _$ToggleDrawerImpl _value, $Res Function(_$ToggleDrawerImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$ToggleDrawerImpl implements _ToggleDrawer {
  const _$ToggleDrawerImpl();

  @override
  String toString() {
    return 'NavigateEvent.toggleDrawer()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$ToggleDrawerImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(NavTab tab) changeTab,
    required TResult Function() toggleDrawer,
  }) {
    return toggleDrawer();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(NavTab tab)? changeTab,
    TResult? Function()? toggleDrawer,
  }) {
    return toggleDrawer?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(NavTab tab)? changeTab,
    TResult Function()? toggleDrawer,
    required TResult orElse(),
  }) {
    if (toggleDrawer != null) {
      return toggleDrawer();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(_ChangeTab value) changeTab,
    required TResult Function(_ToggleDrawer value) toggleDrawer,
  }) {
    return toggleDrawer(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(_ChangeTab value)? changeTab,
    TResult? Function(_ToggleDrawer value)? toggleDrawer,
  }) {
    return toggleDrawer?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(_ChangeTab value)? changeTab,
    TResult Function(_ToggleDrawer value)? toggleDrawer,
    required TResult orElse(),
  }) {
    if (toggleDrawer != null) {
      return toggleDrawer(this);
    }
    return orElse();
  }
}

abstract class _ToggleDrawer implements NavigateEvent {
  const factory _ToggleDrawer() = _$ToggleDrawerImpl;
}
