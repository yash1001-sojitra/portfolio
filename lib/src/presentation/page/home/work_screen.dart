import 'package:flutter/material.dart';
import 'package:portfolio/src/presentation/page/home/data/work_data.dart';
import 'package:portfolio/src/presentation/page/home/widgets/text_data_section.dart';
import 'package:portfolio/src/presentation/page/home/widgets/work_data_section.dart';
import 'package:portfolio/src/presentation/widgets/footer_app.dart';

class WorksScreen extends StatefulWidget {
  const WorksScreen({super.key});

  @override
  State<WorksScreen> createState() => _WorksScreenState();
}

class _WorksScreenState extends State<WorksScreen>
    with TickerProviderStateMixin {
  // Define animation controllers
  AnimationController? _controller;
  CurvedAnimation? _curvedAnimation;
  bool isHovered = false;

  @override
  void initState() {
    super.initState();

    final AnimationController controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );
    _curvedAnimation = CurvedAnimation(
      parent: controller,
      curve: Curves.easeInOut,
      reverseCurve: Curves.easeInOut,
    );

    _controller = controller;

    _controller!.repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller!.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        color: Colors.grey[50],
        child: Column(
          children: [
            profileMobileSection(),
            const FooterApp(),
          ],
        ),
      ),
    );
  }

  Widget profileMobileSection() {
    return Container(
      width: MediaQuery.of(context).size.width,
      color: Colors.transparent,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Row(
                children: [
                  SizedBox(height: 80),
                ],
              ),
              Stack(
                children: [
                  Image.asset(
                    "assets/images/main_circle.png",
                  ),
                  const Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: Center(
                      child: Text(
                        'Works',
                        style: TextStyle(
                          fontSize: 45,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  AnimatedBuilder(
                    animation: _curvedAnimation!,
                    builder: (context, child) {
                      double topPadding = _curvedAnimation!.value * 100;
                      double bottomPadding =
                          100 - _curvedAnimation!.value * 100;

                      return Padding(
                        padding: EdgeInsets.only(
                          top: topPadding,
                          bottom: bottomPadding,
                        ),
                        child: Image.asset(
                          "assets/images/down-arrow.png",
                        ),
                      );
                    },
                  )
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          const WorkData(),
          const SizedBox(height: 50),
        ],
      ),
    );
  }
}
