import 'dart:math';

import 'package:flutter/animation.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:portfolio/src/comman/constant.dart';
import 'package:portfolio/src/comman/text_style.dart';
import 'package:portfolio/src/presentation/page/home/data/work_data.dart';
import 'package:portfolio/src/presentation/page/home/widgets/work_data_section.dart';
import 'package:portfolio/src/presentation/widgets/footer_app.dart';
import 'package:icons_plus/icons_plus.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:url_launcher/url_launcher.dart';

class TopProfileSection extends StatefulWidget {
  const TopProfileSection({super.key});

  @override
  State<TopProfileSection> createState() => _TopProfileSectionState();
}

class _TopProfileSectionState extends State<TopProfileSection>
    with SingleTickerProviderStateMixin {
  AnimationController? _controller;
  bool isHovered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        color: Colors.grey[50],
        child: Column(
          children: [
            Stack(
              children: [
                ResponsiveBreakpoints.of(context).isDesktop
                    ? profileDesktopSection()
                    : profileMobileSection(),
                Positioned(
                  right: 0,
                  bottom: 50,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 0),
                    child: Container(
                      color: Colors.transparent,
                      child: Transform.rotate(
                        angle: 3.14 / 2, // Change rotation angle
                        child: const Padding(
                          padding: EdgeInsets.only(
                            left: 8.0,
                            right: 8.0,
                          ),
                          child: Row(
                            children: [
                              Text(
                                'Scroll Down',
                                style: TextStyle(color: Colors.black),
                              ),
                              Icon(
                                Icons.arrow_forward,
                                color: Colors.black,
                              )
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                )
              ],
            ),
            const WorkData(),
            const FooterApp(),
          ],
        ),
      ),
    );
  }

  Widget profileDesktopSection() {
    return Container(
      width: MediaQuery.of(context).size.width,
      color: Colors.transparent,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            children: [
              Container(
                height: MediaQuery.of(context).size.height,
                color: Colors.grey[100],
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        SizedBox(height: 40),
                      ],
                    ),
                    Container(
                      height: 400,
                      width: 400,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              Positioned(
                top: 180,
                left: MediaQuery.of(context).size.width / 4 - 100,
                right: 100,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hi,',
                            style: profiletextStyle,
                          ),
                          Text(
                            "I'm Yash Rank",
                            style: profiletextStyle,
                          ),
                          Text(
                            'Software Engineer',
                            style: profiletextStyle,
                          ),
                          const SizedBox(height: 50),
                          const Text(
                            "Mobile App Developer / Web Developer / Flutter Developer",
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 50),
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
                                          width: 180,
                                        ),
                                        AnimatedContainer(
                                          duration:
                                              const Duration(milliseconds: 500),
                                          height: 50,
                                          width: isHovered ? 170 : 50,
                                          decoration: BoxDecoration(
                                            color: Colors.grey[50],
                                            borderRadius:
                                                BorderRadius.circular(50),
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
                                        "SEE MY WORKS",
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15,
                                        ),
                                      ),
                                      SizedBox(width: 10),
                                      Icon(
                                        Icons.arrow_forward,
                                        color: Colors.black,
                                      )
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 50),
                          socialWidget(),
                        ],
                      ),
                      profileImageSection(370),
                    ],
                  ),
                ),
              )
            ],
          ),
          // const SizedBox(height: 20),
        ],
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
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              const Row(
                children: [
                  SizedBox(height: 80),
                ],
              ),
              profileImageSection(200),
            ],
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hi,',
                      style: profiletextStyle,
                    ),
                    Text(
                      "I'm Yash Rank",
                      style: profiletextStyle,
                    ),
                    Text(
                      'Software Engineer',
                      style: profiletextStyle,
                    ),
                    const SizedBox(height: 50),
                    const Text(
                      "Mobile App Developer / Web Developer / Flutter Developer",
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 50),
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
                                    width: 180,
                                  ),
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 500),
                                    height: 50,
                                    width: isHovered ? 170 : 50,
                                    decoration: BoxDecoration(
                                      color: Colors.grey[50],
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
                                  "SEE MY WORKS",
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                                SizedBox(width: 10),
                                Icon(
                                  Icons.arrow_forward,
                                  color: Colors.black,
                                )
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 50),
                    socialWidget(),
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

  // social widget
  Widget socialWidget() {
    return Row(
      children: [
        MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
            onTap: () {
              _launchURL(Githuburl);
            },
            child: const Row(
              children: [
                Icon(Bootstrap.github),
                SizedBox(width: 10),
                Text('Github'),
              ],
            ),
          ),
        ),
        const SizedBox(width: 20),
        const Text(
          "/",
          style: TextStyle(color: Colors.black),
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
                Icon(Bootstrap.linkedin),
                SizedBox(width: 10),
                Text('Linkedin'),
              ],
            ),
          ),
        ),
        const SizedBox(width: 20),
        const Text(
          "/",
          style: TextStyle(color: Colors.black),
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
                Icon(Bootstrap.medium),
                SizedBox(width: 10),
                Text('Medium'),
              ],
            ),
          ),
        ),
      ],
    );
  }

  List icons = [
    Brands.android_studio,
    Brands.flutter,
    Brands.dart,
    Brands.firebase,
    Brands.github,
    Brands.kotlin,
    Brands.java,
    Brands.javascript,
    Brands.nodejs,
    Brands.html_5,
    Brands.css3,
  ];

  Widget profileImageSection(
    double size,
  ) {
    return Stack(
      children: [
        Container(
          margin: const EdgeInsets.all(60),
          height: size,
          width: size,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            image: DecorationImage(
              image: AssetImage("assets/images/profile_image.png"),
              fit: BoxFit.cover,
            ),
          ),
        ),
        for (int i = 0; i < icons.length; i++)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            child: AnimatedBuilder(
              animation: _controller!,
              builder: (context, child) {
                return Transform.rotate(
                  angle: _controller!.value * 2 * pi,
                  child: Transform.rotate(
                    angle: i * 2 * pi / icons.length,
                    child: Transform.rotate(
                      angle: i * 2 * pi / icons.length,
                      child: Align(
                        alignment: Alignment.topCenter,
                        child: Padding(
                          padding: const EdgeInsets.only(),
                          child: Brand(
                            icons[i],
                            size: 40,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
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
