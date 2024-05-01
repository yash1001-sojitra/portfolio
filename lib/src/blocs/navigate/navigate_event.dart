part of 'navigate_bloc.dart';

@freezed
class NavigateEvent with _$NavigateEvent {
  const factory NavigateEvent.changeTab({required NavTab tab}) = _ChangeTab;

  const factory NavigateEvent.toggleDrawer() = _ToggleDrawer;
}
