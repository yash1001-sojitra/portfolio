// ignore_for_file: library_private_types_in_public_api

import 'dart:developer';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/blocs/blogs/blogs_bloc.dart';
import 'package:portfolio/src/blocs/navigate/navigate_bloc.dart';
import 'package:portfolio/src/routes/go_routes.dart';
import 'package:portfolio/injection.dart' as di;
import 'package:responsive_framework/responsive_framework.dart';
import 'package:url_strategy/url_strategy.dart';

String? token;
Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
  di.init();

  setPathUrlStrategy();

  await Firebase.initializeApp(
      options: const FirebaseOptions(
    apiKey: "AIzaSyB5XjQ7r2GOvW-GVGQebRUVtCmQaytXJcc",
    authDomain: "portfolio-f623c.firebaseapp.com",
    projectId: "portfolio-f623c",
    storageBucket: "portfolio-f623c.appspot.com",
    messagingSenderId: "226572521089",
    appId: "1:226572521089:web:8f3a171e1b5c30809fc780",
    measurementId: "G-5Y7KP6XCPC",
  ));

  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();

  static _MyAppState of(BuildContext context) =>
      context.findAncestorStateOfType<_MyAppState>()!;
}

class _MyAppState extends State<MyApp> {
  late GoRouter _router;
  @override
  void initState() {
    super.initState();
    _router = createRouter();
    messageListener();

    // WeatherData().getWeatherData();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => di.locator<NavigateBloc>()),
        BlocProvider(create: (_) => di.locator<BlogsBloc>()),
      ],
      child: MaterialApp.router(
        title: 'Yash Rank Portfolio',
        routerConfig: _router,
        theme: ThemeData(fontFamily: "TimesNewRoman"),
        debugShowCheckedModeBanner: false,
        builder: (context, child) => ResponsiveBreakpoints.builder(
          breakpoints: [
            const Breakpoint(start: 0, end: 450, name: MOBILE),
            const Breakpoint(start: 451, end: 800, name: TABLET),
            const Breakpoint(start: 801, end: 1920, name: DESKTOP),
            const Breakpoint(start: 1921, end: double.infinity, name: '4K'),
          ],
          child: child!,
        ),
      ),
    );
  }

  void messageListener() async {
    await FirebaseMessaging.instance.requestPermission().then((value) async {
      if (value.authorizationStatus == AuthorizationStatus.authorized) {
        log('requestPermission');
        await FirebaseMessaging.instance
            .setForegroundNotificationPresentationOptions(
          alert: true,
          badge: true,
          sound: true,
        )
            .then((value) async {
          log('setForegroundNotificationPresentationOptions');
          await FirebaseMessaging.instance.getToken().then((value) {
            log("token : $value");

            token = value ?? "";
          }).catchError((e) {
            log("token error : $e");
          });
        });

        log('messageListener');

        FirebaseMessaging.onMessage.listen((RemoteMessage message) {
          log('onMessage');
          if (message.notification != null) {
            Fluttertoast.showToast(msg: message.notification!.title!);
          }
        });
      } else {
        log('requestPermission denied');
      }
    });
  }
}
