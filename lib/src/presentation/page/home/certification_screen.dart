import 'package:flutter/material.dart';
import 'package:portfolio/src/presentation/widgets/view_certi_widget.dart';
import 'package:responsive_framework/responsive_framework.dart';

import 'package:portfolio/src/presentation/widgets/footer_app.dart';

class CertificationScreen extends StatefulWidget {
  const CertificationScreen({super.key});

  @override
  State<CertificationScreen> createState() => _CertificationScreenState();
}

class _CertificationScreenState extends State<CertificationScreen>
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
                        'Certifications',
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
          ResponsiveBreakpoints.of(context).isDesktop
              ? gridViewImage()
              : listViewImage(),
          const SizedBox(height: 50),
        ],
      ),
    );
  }

  static const List<String> certificateImages = [
    "assets/certi/google_cloud_associate.png",
    "assets/certi/google_architech_udemy.jpg",
    "assets/certi/certi-1.png",
    "assets/certi/certi0.png",
    "assets/certi/certi1.png",
    "assets/certi/certi2.png",
    "assets/certi/certi3.png",
    "assets/certi/certi4.png",
    "assets/certi/certi5.png",
    "assets/certi/certi6.png",
    "assets/certi/certi7.png",
    "assets/certi/certi8.png",
    "assets/certi/certi9.png",
    "assets/certi/certi10.png",
    "assets/certi/certi11.png",
    "assets/certi/certi12.png",
    "assets/certi/certi13.png",
  ];

  Widget gridViewImage() {
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: (certificateImages.length / 2).ceil(),
      itemBuilder: (context, index) {
        final firstItem = index * 2;
        final secondItem = firstItem + 1;
        return Row(
          children: [
            Expanded(
              child: SizedBox(
                width: MediaQuery.of(context).size.width / 2,
                child: ImageHover(
                  imagePath: certificateImages[firstItem],
                ),
              ),
            ),
            Expanded(
              child: SizedBox(
                width: MediaQuery.of(context).size.width / 2,
                child: secondItem < certificateImages.length
                    ? ImageHover(imagePath: certificateImages[secondItem])
                    : const SizedBox(),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget listViewImage() {
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: certificateImages.length,
      itemBuilder: (context, index) {
        return ImageHover(
          imagePath: certificateImages[index],
        );
      },
    );
  }
}

class ImageHover extends StatefulWidget {
  final String imagePath;
  const ImageHover({
    super.key,
    required this.imagePath,
  });

  @override
  State<ImageHover> createState() => _ImageHoverState();
}

class _ImageHoverState extends State<ImageHover> {
  bool isHovered = false;
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
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Image.asset(
              widget.imagePath,
              fit: BoxFit.contain,
            ),
          ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            bottom: 50,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ViewCerti(
                  url: widget.imagePath.split('/').last,
                ),
                const SizedBox(height: 10),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
