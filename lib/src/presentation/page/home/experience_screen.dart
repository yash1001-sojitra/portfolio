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
                TextDataSection(
                  index: "01",
                  date: "Feb 2023 - March 2024",
                  title: "Aim2Excel - Delhi",
                  description: "As Software Engineer",
                  points: const [
                    // 25 + app working

                    "I am currently working as a Software Engineer at Aim2Excel. I am responsible for developing and maintaining mobile and web applications. I am also responsible for the deployment of the applications.",
                    "Working on the development of the mobile application Web application using Flutter.",

                    // working in more than 25+ apps
                    "I have worked on more than 25+ applications. Some of the applications are:",
                    "1. Max Cricket Live Line - 1M+ Downloads",
                    "2. Mesmerizing Food - 5K+ Downloads",
                    "3. AP'Varnam - 1K+ Downloads",
                    "4. Jeeto Cric Live Line - 5K+ Downloads Etc.",
                  ],
                ),
                const SizedBox(height: 20),
                TextDataSection(
                  index: "02",
                  date: "March 2024 - Present",
                  title: "Empiric Infotech - Surat",
                  description: "As Software Engineer",
                  points: const [
                    "I am Currently working as a Software Engineer at Empiric InfoTech.",
                    "I have worked on below project:",
                    "1. Resume Builder Using AI - 10K+ Downloads",
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
