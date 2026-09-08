import 'package:flutter/material.dart';
import 'package:portfolio/src/presentation/page/home/widgets/text_data_section.dart';
import 'package:portfolio/src/presentation/widgets/footer_app.dart';

class ExperienceScreen extends StatefulWidget {
  const ExperienceScreen({super.key});

  @override
  State<ExperienceScreen> createState() => _ExperienceScreenState();
}

class _ExperienceScreenState extends State<ExperienceScreen>
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
                        'Experience',
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
          SizedBox(
            width: MediaQuery.of(context).size.width,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const TextDataSection(
                  index: "01",
                  date: "March 2024 - Present",
                  title: "Aviato Consulting",
                  description:
                      "Senior Software Developer | Team Lead (15-member team)",
                  points: [
                    "Led a 15-member engineering team delivering mobile, web, and backend projects from architecture through deployment.",
                    "Architected and delivered Flutter apps and Nuxt.js web portals integrated with Firebase, Node.js, and Google Cloud Platform.",
                    "Designed cloud-native architectures on GCP using Cloud Run, GKE, and automated Cloud Build CI/CD pipelines.",
                    "Standardized development workflows across the team through clean architecture patterns, rigorous code review, and automated testing.",
                    "Mentored 15 engineers across Flutter, backend, and cloud domains, driving measurable improvements in sprint velocity and delivery.",
                  ],
                ),
                const SizedBox(height: 20),
                const TextDataSection(
                  index: "02",
                  date: "Feb 2023 - March 2024",
                  title: "Aim2Excel",
                  description: "Full Stack Mobile Developer",
                  points: [
                    "Delivered 25+ mobile apps across App Store and Google Play using Flutter, Dart, Firebase, and RESTful APIs, with flagship apps exceeding 1M+ downloads.",
                    "Designed scalable state management using BLoC and Provider patterns, reducing codebase complexity and boosting screen load speeds.",
                    "Implemented CI/CD pipelines automating build, test, and deployment workflows to Google Play Console and Apple App Store Connect.",
                    "Integrated third-party SDKs, payment gateways, offline caching, and deep linking across production applications.",
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 50),
        ],
      ),
    );
  }
}
