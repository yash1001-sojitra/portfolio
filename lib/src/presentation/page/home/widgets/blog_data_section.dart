import 'package:flutter/material.dart';
import 'package:iconsx_plus/iconsx_plus.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:url_launcher/url_launcher.dart';

class BlogDataSection extends StatefulWidget {
  final String index;
  final String title;
  final String description;
  final String topic;
  final String url;

  const BlogDataSection({
    super.key,
    required this.index,
    required this.title,
    required this.description,
    required this.topic,
    required this.url,
  });

  @override
  State<BlogDataSection> createState() => _BlogDataSectionState();
}

class _BlogDataSectionState extends State<BlogDataSection> {
  bool isHovered = false;

  Future<void> _launchBlogUrl() async {
    if (widget.url.isEmpty) return;
    final Uri uri = Uri.parse(widget.url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      debugPrint('Could not launch ${widget.url}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => isHovered = true),
      onExit: (_) => setState(() => isHovered = false),
      child: GestureDetector(
        onTap: _launchBlogUrl,
        child: ResponsiveBreakpoints.of(context).isDesktop
            ? desktopView()
            : mobileView(),
      ),
    );
  }

  Widget desktopView() {
    return Container(
      color: Colors.grey[100],
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 40),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                height: 2,
                width: isHovered ? 180 : 130,
                decoration: BoxDecoration(
                  color: isHovered
                      ? Colors.grey.withValues(alpha: 0.6)
                      : Colors.grey.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(50),
                ),
              ),
              const SizedBox(width: 10),
              Text(
                widget.index,
                style: const TextStyle(
                  color: Colors.grey,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(width: 40),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    widget.topic.toUpperCase(),
                    style: TextStyle(
                      color: Colors.grey[800],
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 200),
                  style: TextStyle(
                    color: isHovered ? Colors.black : Colors.grey[850],
                    fontSize: 28,
                    fontWeight: FontWeight.w600,
                    height: 1.3,
                  ),
                  child: Text(widget.title),
                ),
                const SizedBox(height: 12),
                Text(
                  widget.description,
                  style: const TextStyle(
                    color: Colors.grey,
                    letterSpacing: 1.1,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 40),
          readArticleButton(),
          const SizedBox(width: 60),
        ],
      ),
    );
  }

  Widget mobileView() {
    return Container(
      color: Colors.grey[100],
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                height: 2,
                width: isHovered ? 80 : 40,
                decoration: BoxDecoration(
                  color: isHovered
                      ? Colors.grey.withValues(alpha: 0.6)
                      : Colors.grey.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(50),
                ),
              ),
              const SizedBox(width: 10),
              Text(
                widget.index,
                style: const TextStyle(
                  color: Colors.grey,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              widget.topic.toUpperCase(),
              style: TextStyle(
                color: Colors.grey[800],
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.0,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            widget.title,
            style: TextStyle(
              color: isHovered ? Colors.black : Colors.grey[850],
              fontSize: 22,
              fontWeight: FontWeight.w600,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            widget.description,
            style: const TextStyle(
              color: Colors.black87,
              letterSpacing: 1.0,
              fontSize: 13,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 25),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              readArticleButton(),
            ],
          ),
        ],
      ),
    );
  }

  Widget readArticleButton() {
    return Stack(
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Stack(
              children: [
                const SizedBox(
                  height: 50,
                  width: 200,
                ),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  height: 50,
                  width: isHovered ? 200 : 50,
                  decoration: BoxDecoration(
                    color: Colors.grey.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(50),
                  ),
                ),
              ],
            ),
          ],
        ),
        const Positioned(
          top: 0,
          left: 16,
          right: 0,
          bottom: 0,
          child: Row(
            children: [
              Icon(
                Bootstrap.medium,
                color: Colors.black,
                size: 18,
              ),
              SizedBox(width: 8),
              Text(
                "READ ARTICLE",
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              SizedBox(width: 8),
              Icon(
                Icons.arrow_forward,
                color: Colors.black,
                size: 16,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
