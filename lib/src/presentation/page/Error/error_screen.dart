import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:portfolio/src/blocs/navigate/navigate_bloc.dart';
import 'package:portfolio/src/presentation/widgets/footer_app.dart';
import 'package:portfolio/src/presentation/widgets/header_app.dart';

class ErrorScreen extends StatelessWidget {
  const ErrorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Stack(
              fit: StackFit.expand,
              children: [
                SingleChildScrollView(
                  child: Column(
                    children: [
                      const SizedBox(height: 100),
                      Image.asset(
                        'assets/images/404_image.jpg',
                        fit: BoxFit.cover,
                      ),
                      const FooterApp(),
                    ],
                  ),
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
