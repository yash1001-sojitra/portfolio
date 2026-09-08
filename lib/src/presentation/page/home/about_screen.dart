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
                const AboutDataSection(
                  index: "01",
                  date: "STORY",
                  title: "A little bit about myself",
                  description:
                      "Senior Software Developer with 4 years of experience building robust mobile, web, and backend applications using Flutter, Dart, Node.js, and Firebase. Proven leader with hands-on experience architecting scalable systems and leading a 15-member engineering team across mobile, web, and backend projects, from technical design through production deployment. Google Cloud Certified (Associate Cloud Engineer & Professional Cloud Architect), with practical experience across Cloud Run, GKE, Cloud Build, and CI/CD automation. Skilled in clean architecture, rigorous code review, and performance optimization in fast-paced product environments.",
                  points: [],
                ),
                const SkillDataSection(
                  index: "02",
                  date: "TECHNOLOGY",
                  title: "What i use.",
                  description:
                      "I use a wide array of languages, cloud technologies, and modern frameworks to bring production-grade systems to life.",
                  skills: [
                    "Flutter",
                    "Dart",
                    "Android (Kotlin)",
                    "iOS (Swift)",
                    "BLoC & Provider",
                  ],
                  webskills: [
                    "Node.js",
                    "Nuxt.js",
                    "Vue.js",
                    "TypeScript / JavaScript",
                    "REST & GraphQL",
                  ],
                  cloud: [
                    "Google Cloud Platform",
                    "Cloud Run & GKE",
                    "Cloud Build & CI/CD",
                    "Terraform & Docker",
                    "Microservices Architecture",
                  ],
                  ai: [
                    "Google ADK & Gemini Flash",
                    "Model Context Protocol (MCP)",
                    "LLM APIs & Prompt Engineering",
                    "Retrieval-Augmented Gen (RAG)",
                    "Vector Search",
                  ],
                  tools: [
                    "Git & GitHub",
                    "Postman",
                    "VS Code & Android Studio",
                    "JIRA & Agile/Scrum",
                    "Linux & Shell Scripting",
                  ],
                  database: [
                    "Firebase & Firestore",
                    "PostgreSQL",
                    "MongoDB",
                    "Redis",
                    "MySQL",
                  ],
                ),
              ],
            ),
          ),
          const SocialDataSection(
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
