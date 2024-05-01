import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:icons_plus/icons_plus.dart';
import 'package:portfolio/src/comman/constant.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:url_launcher/url_launcher.dart';

class FooterApp extends StatefulWidget {
  const FooterApp({super.key});

  @override
  State<FooterApp> createState() => _FooterAppState();
}

class _FooterAppState extends State<FooterApp> {
  bool isHovered = false;
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 500,
      width: MediaQuery.of(context).size.width,
      color: Colors.black,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            children: [
              SizedBox(
                width: ResponsiveBreakpoints.of(context).isDesktop ? 500 : 400,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Image.asset(
                      "assets/images/circle_line.png",
                      width: 150,
                      fit: BoxFit.contain,
                      color: Colors.white10,
                    ),
                  ],
                ),
              ),
              Positioned(
                bottom: 0,
                top: 0,
                left: 0,
                right: 0,
                child: Container(
                  alignment: Alignment.center,
                  child: Text(
                    "Let's work together.",
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: ResponsiveBreakpoints.of(context).isDesktop
                            ? 50
                            : 35,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 20,
          ),
          const Text(
            "I'm available for Consultancy & Freelancing",
            style: TextStyle(
              color: Colors.grey,
              fontSize: 16,
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              MouseRegion(
                cursor: SystemMouseCursors.click,
                onEnter: (event) {
                  setState(() {
                    isHovered = true;
                  });
                },
                onExit: (event) {
                  setState(() {
                    isHovered = false;
                  });
                },
                child: Stack(
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Stack(
                          children: [
                            const SizedBox(
                              height: 50,
                              width: 150,
                            ),
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 500),
                              height: 50,
                              width: isHovered ? 150 : 50,
                              decoration: BoxDecoration(
                                color: Colors.grey.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(50),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const Positioned(
                      top: 0,
                      left: 20,
                      right: 0,
                      bottom: 0,
                      child: Row(
                        children: [
                          Text(
                            "SAY HELLO",
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          SizedBox(width: 10),
                          Icon(
                            Icons.arrow_forward,
                            color: Colors.white,
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 50,
          ),
          socialWidget(),
          const SizedBox(
            height: 50,
          ),
          const Text(
            "© 2024 built by Yash Rank",
            style: TextStyle(color: Colors.white),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                "Built using ",
                style: TextStyle(color: Colors.white),
              ),
              Brand(
                Brands.flutter,
                size: 20,
              ),
              const Text(" & ", style: TextStyle(color: Colors.white)),
              // favourite icon
              const Icon(
                Icons.favorite,
                color: Colors.red,
                size: 20,
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget socialWidget() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
            onTap: () {
              _launchURL(Githuburl);
            },
            child: const Row(
              children: [
                Icon(Bootstrap.github, color: Colors.white),
                SizedBox(width: 10),
                Text(
                  'Github',
                  style: TextStyle(color: Colors.white),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 20),
        const Text(
          "/",
          style: TextStyle(color: Colors.white),
        ),
        const SizedBox(width: 20),
        MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
            onTap: () {
              _launchURL(Linkedinurl);
            },
            child: const Row(
              children: [
                Icon(Bootstrap.linkedin, color: Colors.white),
                SizedBox(width: 10),
                Text('Linkedin', style: TextStyle(color: Colors.white)),
              ],
            ),
          ),
        ),
        const SizedBox(width: 20),
        const Text(
          "/",
          style: TextStyle(color: Colors.white),
        ),
        const SizedBox(width: 20),
        MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
            onTap: () {
              _launchURL(mediumurl);
            },
            child: const Row(
              children: [
                Icon(Bootstrap.medium, color: Colors.white),
                SizedBox(width: 10),
                Text('Medium', style: TextStyle(color: Colors.white)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // url launch
  void _launchURL(String url) async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      throw 'Could not launch $url';
    }
  }
}
