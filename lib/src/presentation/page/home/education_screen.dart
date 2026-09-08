import 'package:flutter/material.dart';
import 'package:portfolio/src/presentation/page/home/widgets/text_data_section.dart';
import 'package:portfolio/src/presentation/widgets/footer_app.dart';

class EductaionScreen extends StatefulWidget {
  const EductaionScreen({super.key});

  @override
  State<EductaionScreen> createState() => _EductaionScreenState();
}

class _EductaionScreenState extends State<EductaionScreen>
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
                        'Educations',
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
                  date: "2023 - 2025",
                  title: "Master of Technology — Computer Science & Engineering",
                  description: "Parul University",
                  points: [
                    "Pursuing Master of Technology in Computer Science & Engineering, specializing in advanced software architecture, distributed cloud systems, and intelligent systems.",
                  ],
                ),
                const SizedBox(height: 20),
                const TextDataSection(
                  index: "02",
                  date: "June 2019 - March 2023",
                  title: "Bachelor of Engineering — Computer Science & Engineering",
                  description: "Government College of Engineering Bhavnagar",
                  points: [
                    "Completed Bachelor of Computer Science & Engineering from Government College of Engineering Bhavnagar with a CGPA of 8.0.",
                  ],
                ),
                const SizedBox(height: 20),
                const TextDataSection(
                  index: "03",
                  date: "June 2017 - March 2019",
                  title: "HSC - Science (GSHEB)",
                  description: "Aashadeep Science Bhavan, Surat",
                  points: [
                    "Completed Higher Secondary School Certificate (HSC - GSHEB) with 94.02 PR.",
                  ],
                ),
                const SizedBox(height: 20),
                const TextDataSection(
                  index: "04",
                  date: "June 2015 - March 2017",
                  title: "SSC (GSEB)",
                  description: "Baldha D.V.P Madhyamik Shala, Surat",
                  points: [
                    "Completed Secondary School Certificate (SSC - GSEB) with 96 PR.",
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
