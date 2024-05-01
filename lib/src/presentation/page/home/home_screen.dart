import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:portfolio/src/blocs/navigate/navigate_bloc.dart';
import 'package:portfolio/src/comman/enum.dart';
import 'package:portfolio/src/presentation/page/home/contect_screen.dart';
import 'package:portfolio/src/presentation/page/home/widgets/top_profile_section.dart';
import 'package:portfolio/src/presentation/widgets/footer_app.dart';
import 'package:portfolio/src/presentation/widgets/header_app.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Stack(
              fit: StackFit.expand,
              children: [
                BlocBuilder<NavigateBloc, NavigateState>(
                  builder: (context, state) {
                    return state.currentTab == NavTab.Home
                        ? const TopProfileSection()
                        : const ContectScreen();
                  },
                ),
                const Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: AppHeader(),
                ),
              ],
            ),
            Positioned(
              left: 0,
              top: MediaQuery.of(context).size.height / 2 - 50,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Container(
                  color: Colors.transparent,
                  child: Transform.rotate(
                    angle: -3.14 / 2, // Change rotation angle
                    child: BlocBuilder<NavigateBloc, NavigateState>(
                        builder: (context, state) {
                      return Container(
                        alignment: Alignment.center,
                        color: Colors.white,
                        child: Padding(
                          padding: const EdgeInsets.only(
                              left: 8.0, right: 8.0, top: 4.0, bottom: 4.0),
                          child: Text(
                            state.currentTab.name,
                            style: const TextStyle(color: Colors.black),
                          ),
                        ),
                      );
                    }),
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
