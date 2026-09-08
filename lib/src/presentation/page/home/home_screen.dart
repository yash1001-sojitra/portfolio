import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:portfolio/src/blocs/navigate/navigate_bloc.dart';
import 'package:portfolio/src/comman/enum.dart';
import 'package:portfolio/src/presentation/page/Error/error_screen.dart';
import 'package:portfolio/src/presentation/page/home/about_screen.dart';
import 'package:portfolio/src/presentation/page/home/blogs_screen.dart';
import 'package:portfolio/src/presentation/page/home/certification_screen.dart';
import 'package:portfolio/src/presentation/page/home/contect_screen.dart';
import 'package:portfolio/src/presentation/page/home/education_screen.dart';
import 'package:portfolio/src/presentation/page/home/experience_screen.dart';
import 'package:portfolio/src/presentation/page/home/widgets/top_profile_section.dart';
import 'package:portfolio/src/presentation/page/home/work_screen.dart';
import 'package:portfolio/src/presentation/widgets/header_app.dart';
import 'package:portfolio/src/presentation/widgets/mobile_drawer.dart';
import 'package:responsive_framework/responsive_framework.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    final state = context.watch<NavigateBloc>().state;
    log("HomeScreen: ${state.currentTab.name}");
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Stack(
              fit: StackFit.expand,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 350),
                  switchInCurve: Curves.easeOutCubic,
                  switchOutCurve: Curves.easeInCubic,
                  layoutBuilder:
                      (Widget? currentChild, List<Widget> previousChildren) {
                    return Stack(
                      fit: StackFit.expand,
                      children: <Widget>[
                        ...previousChildren,
                        if (currentChild != null) currentChild,
                      ],
                    );
                  },
                  transitionBuilder:
                      (Widget child, Animation<double> animation) {
                    return FadeTransition(
                      opacity: animation,
                      child: SlideTransition(
                        position: Tween<Offset>(
                          begin: const Offset(0.0, 0.015),
                          end: Offset.zero,
                        ).animate(animation),
                        child: child,
                      ),
                    );
                  },
                  child: _buildBody(context, state),
                ),
                const Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: AppHeader(),
                ),
              ],
            ),
            ResponsiveBreakpoints.of(context).isDesktop
                ? Positioned(
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
                            return AnimatedSwitcher(
                              duration: const Duration(milliseconds: 250),
                              transitionBuilder: (child, animation) =>
                                  FadeTransition(
                                opacity: animation,
                                child: child,
                              ),
                              child: Container(
                                key: ValueKey(state.currentTab.name),
                                alignment: Alignment.center,
                                color: Colors.white,
                                child: Padding(
                                  padding: const EdgeInsets.only(
                                      left: 8.0,
                                      right: 8.0,
                                      top: 4.0,
                                      bottom: 4.0),
                                  child: Text(
                                    state.currentTab.name,
                                    style:
                                        const TextStyle(color: Colors.black),
                                  ),
                                ),
                              ),
                            );
                          }),
                        ),
                      ),
                    ),
                  )
                : const SizedBox()
          ],
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context, NavigateState state) {
    if (state.isDrawerOpen && !ResponsiveBreakpoints.of(context).isDesktop) {
      return const KeyedSubtree(
        key: ValueKey('drawer'),
        child: MobileDrawer(),
      );
    }
    switch (state.currentTab) {
      case NavTab.Home:
        return const KeyedSubtree(
          key: ValueKey(NavTab.Home),
          child: TopProfileSection(),
        );
      case NavTab.Contact:
        return const KeyedSubtree(
          key: ValueKey(NavTab.Contact),
          child: ContectScreen(),
        );
      case NavTab.About:
        return const KeyedSubtree(
          key: ValueKey(NavTab.About),
          child: AboutScreen(),
        );
      case NavTab.Works:
        return const KeyedSubtree(
          key: ValueKey(NavTab.Works),
          child: WorksScreen(),
        );
      case NavTab.Educations:
        return const KeyedSubtree(
          key: ValueKey(NavTab.Educations),
          child: EductaionScreen(),
        );
      case NavTab.Experiences:
        return const KeyedSubtree(
          key: ValueKey(NavTab.Experiences),
          child: ExperienceScreen(),
        );
      case NavTab.Certifications:
        return const KeyedSubtree(
          key: ValueKey(NavTab.Certifications),
          child: CertificationScreen(),
        );
      case NavTab.Blogs:
        return const KeyedSubtree(
          key: ValueKey(NavTab.Blogs),
          child: BlogsScreen(),
        );
      default:
        return const KeyedSubtree(
          key: ValueKey('error'),
          child: ErrorScreen(),
        );
    }
  }
}
