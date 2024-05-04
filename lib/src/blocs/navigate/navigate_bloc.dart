import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/comman/enum.dart';

part 'navigate_state.dart';
part 'navigate_event.dart';
part 'navigate_bloc.freezed.dart';

class NavigateBloc extends Bloc<NavigateEvent, NavigateState> {
  NavigateBloc() : super(NavigateState.initial()) {
    on<NavigateEvent>((event, emit) async {
      await event.map(
        changeTab: (e) async {
          emit(state.copyWith(
            currentTab: e.tab,
            isDrawerOpen: false,
          ));
        },
        toggleDrawer: (e) async {
          emit(state.copyWith(isDrawerOpen: !state.isDrawerOpen));
        },
      );
    });
  }
}
