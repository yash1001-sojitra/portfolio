import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:url_launcher/url_launcher.dart';

class WorkDataSection extends StatefulWidget {
  String index;
  String title;
  String description;
  String url;
  String image;
  WorkDataSection({
    Key? key,
    required this.index,
    required this.title,
    required this.description,
    required this.url,
    required this.image,
  }) : super(key: key);

  @override
  State<WorkDataSection> createState() => _WorkDataSectionState();
}

class _WorkDataSectionState extends State<WorkDataSection> {
  @override
  Widget build(BuildContext context) {
    return MouseRegion(
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
      child: ResponsiveBreakpoints.of(context).isDesktop
          ? desktopView()
          : mobileView(),
    );
  }

  Widget desktopView() {
    return Container(
      color: Colors.grey[100],
      child: Stack(
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            child: Opacity(
              opacity: isHovered ? 1 : 0,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: widget.index == "01" || widget.index == "03"
                    ? MainAxisAlignment.start
                    : MainAxisAlignment.end,
                children: [
                  Image.asset(
                    widget.image,
                    height: 200,
                  ),
                ],
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(
                height: 50,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(top: 0),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          height: 2,
                          width: isHovered ? 250 : 200,
                          decoration: BoxDecoration(
                            color: isHovered
                                ? Colors.grey.withOpacity(0.5)
                                : Colors.grey.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(50),
                          ),
                        ),
                      ),
                      const SizedBox(
                        width: 10,
                      ),
                      Text(
                        widget.index,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 60),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    child: Text(
                      widget.title,
                      style: TextStyle(
                        color: isHovered ? Colors.black : Colors.grey[800],
                        fontSize: 35,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const Spacer(),
                  viewProjectSection(),
                  const SizedBox(
                    width: 100,
                  )
                ],
              ),
              const SizedBox(width: 20),
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: EdgeInsets.only(left: isHovered ? 340 : 290),
                child: Text(
                  widget.description,
                  style: const TextStyle(
                    color: Colors.grey,
                    letterSpacing: 1.5,
                    fontSize: 14,
                  ),
                ),
              ),
              const SizedBox(
                height: 80,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget mobileView() {
    return Container(
      color: Colors.grey[100],
      child: Stack(
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Image.asset(
                  widget.image,
                  height: 200,
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(
                height: 50,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(top: 0),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          height: 2,
                          width: isHovered ? 100 : 50,
                          decoration: BoxDecoration(
                            color: isHovered
                                ? Colors.grey.withOpacity(0.5)
                                : Colors.grey.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(50),
                          ),
                        ),
                      ),
                      const SizedBox(
                        width: 10,
                      ),
                      Text(
                        widget.index,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 60),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    child: Text(
                      widget.title,
                      style: TextStyle(
                        color: isHovered ? Colors.black : Colors.grey[800],
                        fontSize: 35,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 20),
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: EdgeInsets.only(left: isHovered ? 190 : 140),
                child: Text(
                  widget.description,
                  style: const TextStyle(
                    color: Colors.grey,
                    letterSpacing: 1.5,
                    fontSize: 14,
                  ),
                ),
              ),
              const SizedBox(
                height: 40,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  mobileviewProjectSection(),
                  const SizedBox(width: 20),
                ],
              ),
              const SizedBox(
                height: 80,
              ),
            ],
          ),
        ],
      ),
    );
  }

  bool isHovered = false;

  Widget viewProjectSection() {
    return GestureDetector(
      onTap: () {
        _launchplayUrl();
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Stack(
                    children: [
                      const SizedBox(
                        height: 50,
                        width: 190,
                      ),
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 500),
                        height: 50,
                        width: isHovered ? 190 : 50,
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
                      "VIEW PROJECT",
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
        ],
      ),
    );
  }

  Widget mobileviewProjectSection() {
    return GestureDetector(
      onTap: () {
        _launchplayUrl();
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Stack(
                    children: [
                      const SizedBox(
                        height: 50,
                        width: 190,
                      ),
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 500),
                        height: 50,
                        width: isHovered ? 190 : 50,
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
                      "VIEW PROJECT",
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
        ],
      ),
    );
  }

  _launchplayUrl() async {
    if (await canLaunchUrl(Uri.parse(widget.url))) {
      await launchUrl(Uri.parse(widget.url));
    } else {
      throw 'Could not launch ${widget.url}';
    }
  }
}
