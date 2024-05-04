import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:portfolio/src/presentation/page/home/widgets/about_data_section.dart';
import 'package:portfolio/src/presentation/widgets/footer_app.dart';

class AboutScreen extends StatefulWidget {
  const AboutScreen({super.key});

  @override
  State<AboutScreen> createState() => _AboutScreenState();
}

class _AboutScreenState extends State<AboutScreen>
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
    // TODO: implement dispose
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
                        'About',
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
                AboutDataSection(
                  index: "01",
                  date: "STORY",
                  title: "A little bit about myself",
                  description:
                      "Hello there! I'm Yash, a passionate Flutter developer with 1.5 years of experience in crafting engaging mobile applications. Currently, I'm dedicated to my role at Empiric Infotech, where I thrive on turning innovative ideas into user-friendly digital experiences. Previously, I honed my skills at Aim2Excel, where I delved into the intricacies of app development. My journey in Flutter has been an exciting one, and I'm eager to continue pushing boundaries and creating impactful solutions in the ever-evolving tech landscape. Let's connect and explore the endless possibilities together!",
                  points: const [],
                ),
                SkillDataSection(
                  index: "02",
                  date: "TECHNOLOGY",
                  title: "What i use.",
                  description:
                      "I use number of tools to aid my creative process when bringing things to life. Listed below are the tools and technologies that I use to create beautiful and functional applications.",
                  skills: const [
                    "Anroid",
                    "Flutter",
                    "Dart",
                    "Kotlin",
                    "Java",
                  ],
                  webskills: const [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "React",
                    "Node",
                    "Express",
                    "MongoDB",
                  ],
                  tools: const [
                    "Android Studio",
                    "VS Code",
                    "Git",
                    "Postman",
                    "Adobe XD",
                    "Figma",
                  ],
                  database: const [
                    "Firebase",
                    "MySQL",
                    "SQLite",
                    "MongoDB",
                  ],
                ),
              ],
            ),
          ),
          SocialDataSection(
            index: "03",
            date: "CONTACT",
            title: "Social.",
          ),
          const SizedBox(height: 50),
          const Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              // albert einstein quote with quote symbol
              SizedBox(width: 20),
              Text(
                "“",
                style: TextStyle(
                  fontSize: 60,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(width: 20),
              Text(
                "Strive not to be a success, but rather to be of value.",
                style: TextStyle(
                  fontSize: 35,
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(width: 20),
              Text(
                "”",
                style: TextStyle(
                  fontSize: 60,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(width: 20),
            ],
          ),
          SizedBox(
            width: MediaQuery.of(context).size.width - 100,
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  "- Albert Einstein",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
