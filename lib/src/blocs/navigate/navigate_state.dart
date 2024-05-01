part of 'navigate_bloc.dart';

@freezed
class NavigateState with _$NavigateState {
  const factory NavigateState({
    required NavTab currentTab,
  }) = _NavigateState;

  factory NavigateState.initial() =>
      const NavigateState(currentTab: NavTab.Home);
}
