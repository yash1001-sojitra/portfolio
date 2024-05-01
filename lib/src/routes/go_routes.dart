import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/presentation/page/Error/error_screen.dart';
import 'package:portfolio/src/presentation/page/splash/splash_screen.dart';
import 'package:portfolio/src/routes/routes.dart';

GoRouter createRouter() => GoRouter(
      debugLogDiagnostics: true,
      initialLocation: '/',
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
      ],
      errorPageBuilder: (context, state) {
        return const MaterialPage(child: ErrorScreen());
      },
      redirect: (context, state) {
        log('redirect: ${state.uri}');
        return null;
      },
    );
