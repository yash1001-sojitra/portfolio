import 'package:flutter/material.dart';
import 'package:iconsx_plus/iconsx_plus.dart';
import 'package:portfolio/src/comman/constant.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutDataSection extends StatefulWidget {
  final String index;
  final String date;
  final String title;
  final String description;
  final List<String> points;
  const AboutDataSection({
    super.key,
    required this.index,
    required this.date,
    required this.title,
    required this.description,
    required this.points,
  });

  @override
  State<AboutDataSection> createState() => _AboutDataSectionState();
}

class _AboutDataSectionState extends State<AboutDataSection> {
  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      child: Padding(
        padding: EdgeInsets.only(
          left: ResponsiveBreakpoints.of(context).isDesktop ? 300 : 50,
          right: 20,
          top: 20,
          bottom: 20,
        ),
        child: ResponsiveBreakpoints.of(context).isDesktop
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 5),
                    child: Row(
                      children: [
                        Text(
                          "/${widget.index}",
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(width: 10),
                        SizedBox(
                          width: 100,
                          child: Text(
                            widget.date,
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 150),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.title,
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 25,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          SizedBox(
                            width: MediaQuery.of(context).size.width / 2,
                            child: Text(
                              widget.description,
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 16,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: widget.points
                            .map(
                              (point) => Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(
                                    Icons.arrow_right,
                                    color: Colors.black54,
                                  ),
                                  const SizedBox(width: 10),
                                  SizedBox(
                                    width:
                                        MediaQuery.of(context).size.width / 2 -
                                            100,
                                    child: Text(
                                      point,
                                      style: const TextStyle(
                                        color: Colors.black87,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ],
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Text(
                        "/${widget.index}",
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        widget.date,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      SizedBox(
                        width: MediaQuery.of(context).size.width - 70,
                        child: Text(
                          widget.title,
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      SizedBox(
                        width: MediaQuery.of(context).size.width - 70,
                        child: Text(
                          widget.description,
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 15,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Column(
                    children: widget.points
                        .map(
                          (point) => Row(
                            children: [
                              const Icon(
                                Icons.arrow_right,
                                color: Colors.black54,
                              ),
                              const SizedBox(width: 10),
                              SizedBox(
                                width: MediaQuery.of(context).size.width - 110,
                                child: Text(
                                  point,
                                  style: const TextStyle(
                                    color: Colors.black87,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                        .toList(),
                  ),
                ],
              ),
      ),
    );
  }
}

class SocialDataSection extends StatefulWidget {
  final String index;
  final String date;
  final String title;
  const SocialDataSection({
    super.key,
    required this.index,
    required this.date,
    required this.title,
  });

  @override
  State<SocialDataSection> createState() => _SocialDataSectionState();
}

class _SocialDataSectionState extends State<SocialDataSection> {
  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      child: Padding(
        padding: EdgeInsets.only(
          left: ResponsiveBreakpoints.of(context).isDesktop ? 300 : 50,
          right: 20,
          top: 20,
          bottom: 20,
        ),
        child: ResponsiveBreakpoints.of(context).isDesktop
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 5),
                    child: Row(
                      children: [
                        Text(
                          "/${widget.index}",
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(width: 10),
                        SizedBox(
                          width: 100,
                          child: Text(
                            widget.date,
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 150),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.title,
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 25,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      socialWidget(),
                      const SizedBox(height: 20),
                      const Text(
                        "Email.",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        "yashsojitra0@gmail.com",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        "Phone.",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        "+91 88669 90844",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ],
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Text(
                        "/${widget.index}",
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        widget.date,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      SizedBox(
                        width: MediaQuery.of(context).size.width - 70,
                        child: Text(
                          widget.title,
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  socialWidget(),
                  const SizedBox(height: 20),
                  const Text(
                    "Email.",
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    "yashsojitra0@gmail.com",
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    "Phone.",
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    "+91 88669 90844",
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
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
                Icon(Bootstrap.github, color: Colors.black),
                // SizedBox(width: 10),
                // Text(
                //   'Github',
                //   style: TextStyle(color: Colors.white),
                // ),
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
                Icon(Bootstrap.linkedin, color: Colors.black),
                // SizedBox(width: 10),
                // Text('Linkedin', style: TextStyle(color: Colors.white)),
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
                Icon(Bootstrap.medium, color: Colors.black),
                // SizedBox(width: 10),
                // Text('Medium', style: TextStyle(color: Colors.white)),
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

class SkillDataSection extends StatefulWidget {
  final String index;
  final String date;
  final String title;
  final String description;
  final List<String> skills;
  final List<String> webskills;
  final List<String> cloud;
  final List<String> ai;
  final List<String> tools;
  final List<String> database;
  const SkillDataSection({
    super.key,
    required this.index,
    required this.date,
    required this.title,
    required this.description,
    required this.skills,
    required this.webskills,
    this.cloud = const [],
    this.ai = const [],
    required this.tools,
    required this.database,
  });

  @override
  State<SkillDataSection> createState() => _SkillDataSectionState();
}

class _SkillDataSectionState extends State<SkillDataSection> {
  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      child: Padding(
        padding: EdgeInsets.only(
          left: ResponsiveBreakpoints.of(context).isDesktop ? 300 : 50,
          right: 20,
          top: 20,
          bottom: 20,
        ),
        child: ResponsiveBreakpoints.of(context).isDesktop
            ? desktopView()
            : mobileView(),
      ),
    );
  }

  Widget desktopView() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 5),
          child: Row(
            children: [
              Text(
                "/${widget.index}",
                style: const TextStyle(
                  color: Colors.grey,
                  fontSize: 14,
                ),
              ),
              const SizedBox(width: 10),
              SizedBox(
                width: 100,
                child: Text(
                  widget.date,
                  style: const TextStyle(
                    color: Colors.black,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 150),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.title,
                  style: const TextStyle(
                    color: Colors.black,
                    fontSize: 25,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                SizedBox(
                  width: MediaQuery.of(context).size.width / 2,
                  child: Text(
                    widget.description,
                    style: const TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _skillCategoryColumn(
                  "Mobile App Development",
                  widget.skills,
                  200,
                ),
                _skillCategoryColumn(
                  "Web Development",
                  widget.webskills,
                  200,
                ),
              ],
            ),
            if (widget.cloud.isNotEmpty || widget.ai.isNotEmpty) ...[
              const SizedBox(height: 20),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (widget.cloud.isNotEmpty)
                    _skillCategoryColumn(
                      "Cloud & DevOps",
                      widget.cloud,
                      200,
                    ),
                  if (widget.ai.isNotEmpty)
                    _skillCategoryColumn(
                      "AI & Agentic Systems",
                      widget.ai,
                      200,
                    ),
                ],
              ),
            ],
            const SizedBox(height: 20),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _skillCategoryColumn(
                  "Tools & Platforms",
                  widget.tools,
                  200,
                ),
                _skillCategoryColumn(
                  "Database & Backend",
                  widget.database,
                  200,
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

  Widget mobileView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          children: [
            Text(
              "/${widget.index}",
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 14,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              widget.date,
              style: const TextStyle(
                color: Colors.black,
                fontSize: 14,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width - 70,
              child: Text(
                widget.title,
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width - 70,
              child: Text(
                widget.description,
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 15,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        _skillCategoryColumn(
          "Mobile App Development",
          widget.skills,
          MediaQuery.of(context).size.width - 110,
        ),
        const SizedBox(height: 20),
        _skillCategoryColumn(
          "Web Development",
          widget.webskills,
          MediaQuery.of(context).size.width - 110,
        ),
        if (widget.cloud.isNotEmpty) ...[
          const SizedBox(height: 20),
          _skillCategoryColumn(
            "Cloud & DevOps",
            widget.cloud,
            MediaQuery.of(context).size.width - 110,
          ),
        ],
        if (widget.ai.isNotEmpty) ...[
          const SizedBox(height: 20),
          _skillCategoryColumn(
            "AI & Agentic Systems",
            widget.ai,
            MediaQuery.of(context).size.width - 110,
          ),
        ],
        const SizedBox(height: 20),
        _skillCategoryColumn(
          "Tools & Platforms",
          widget.tools,
          MediaQuery.of(context).size.width - 110,
        ),
        const SizedBox(height: 20),
        _skillCategoryColumn(
          "Database & Backend",
          widget.database,
          MediaQuery.of(context).size.width - 110,
        ),
      ],
    );
  }

  Widget _skillCategoryColumn(
    String title,
    List<String> items,
    double itemWidth,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: Colors.black,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: items
              .map(
                (point) => Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.arrow_right,
                      color: Colors.black54,
                    ),
                    const SizedBox(width: 10),
                    SizedBox(
                      width: itemWidth,
                      child: Text(
                        point,
                        style: const TextStyle(
                          color: Colors.black87,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              )
              .toList(),
        ),
      ],
    );
  }
}
