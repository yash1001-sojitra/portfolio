part of 'navigate_bloc.dart';

@freezed
class NavigateState with _$NavigateState {
  const factory NavigateState({
    required NavTab currentTab,
    required bool isDrawerOpen,
  }) = _NavigateState;

  factory NavigateState.initial() =>
      const NavigateState(currentTab: NavTab.Home, isDrawerOpen: false);
}
