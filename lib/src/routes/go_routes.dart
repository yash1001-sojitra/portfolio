import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/blocs/navigate/navigate_bloc.dart';
import 'package:portfolio/src/blocs/weather/weather_bloc.dart';
import 'package:portfolio/src/comman/enum.dart';
import 'package:portfolio/src/presentation/page/Error/error_screen.dart';
import 'package:portfolio/src/presentation/page/home/home_screen.dart';
import 'package:portfolio/src/presentation/page/splash/splash_screen.dart';
import 'package:portfolio/src/presentation/widgets/photo_view.dart';
import 'package:portfolio/src/routes/routes.dart';

GoRouter createRouter() => GoRouter(
      debugLogDiagnostics: true,
      initialLocation: AppRoutes.SPLASH_ROUTE_PATH,
      routes: <RouteBase>[
        ///  =================================================================
        ///  ********************** Splash Route *****************************
        /// ==================================================================
        GoRoute(
          name: AppRoutes.SPLASH_ROUTE_NAME,
          path: AppRoutes.SPLASH_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            return const SplashScreen();
          },
        ),

        ///  =================================================================
        /// ********************** Home Route *****************************
        /// ==================================================================
        GoRoute(
          name: AppRoutes.HOME_ROUTE_NAME,
          path: AppRoutes.HOME_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.Home));
            return const HomeScreen();
          },
        ),

        GoRoute(
          name: AppRoutes.ABOUT_ROUTE_NAME,
          path: AppRoutes.ABOUT_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.About));
            return const HomeScreen();
          },
        ),

        GoRoute(
          name: AppRoutes.WORKS_ROUTE_NAME,
          path: AppRoutes.WORKS_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.Works));
            return const HomeScreen();
          },
        ),

        GoRoute(
          name: AppRoutes.EDUCATION_ROUTE_NAME,
          path: AppRoutes.EDUCATION_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.Educations));
            return const HomeScreen();
          },
        ),

        GoRoute(
          name: AppRoutes.EXPERIENCE_ROUTE_NAME,
          path: AppRoutes.EXPERIENCE_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.Experiences));
            return const HomeScreen();
          },
        ),

        GoRoute(
          name: AppRoutes.CERTIFICATION_ROUTE_NAME,
          path: AppRoutes.CERTIFICATION_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.Certifications));
            return const HomeScreen();
          },
        ),
        GoRoute(
          name: AppRoutes.CONTACT_ROUTE_NAME,
          path: AppRoutes.CONTACT_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.Contact));
            return const HomeScreen();
          },
        ),

        GoRoute(
          name: AppRoutes.PHOTO_VIEW_ROUTE_NAME,
          path: AppRoutes.PHOTO_VIEW_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            final String? url = state.pathParameters['photoUrl'];
            return CertiView(
              url: url ?? '0',
            );
          },
        ),

        GoRoute(
          name: AppRoutes.BLOG_ROUTE_NAME,
          path: AppRoutes.BLOG_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.Blogs));

       

            return const HomeScreen();
          },
        ),

        GoRoute(
          name: AppRoutes.WEATHER_ROUTE_NAME,
          path: AppRoutes.WEATHER_ROUTE_PATH,
          builder: (BuildContext context, GoRouterState state) {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.changeTab(tab: NavTab.Weather));
                     context.read<WeatherBloc>().add(const WeatherEvent.fetchWeather());
            return const HomeScreen();
          },
        ),

      ],
      errorPageBuilder: (context, state) {
        return const MaterialPage(child: ErrorScreen());
      },
      redirect: (context, state) {
        log('redirect: ${state.uri}');
        return null;
      },
    );
