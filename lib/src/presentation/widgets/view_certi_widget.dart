import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:portfolio/src/presentation/download/download_pdf.dart';
import 'package:portfolio/src/routes/routes.dart';

class ViewCerti extends StatefulWidget {
  String url;
  ViewCerti({
    Key? key,
    required this.url,
  }) : super(key: key);

  @override
  State<ViewCerti> createState() => _ViewCertiState();
}

class _ViewCertiState extends State<ViewCerti>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    _animation = Tween<double>(begin: 0, end: 1).animate(_controller);
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (event) {
        _controller.forward();
      },
      onExit: (event) {
        _controller.reverse();
      },
      child: GestureDetector(
        onTap: () {
          context.pushNamed(AppRoutes.PHOTO_VIEW_ROUTE_NAME,
              pathParameters: {'photoUrl': widget.url});
        },
        child: Container(
          width: 100,
          height: 40,
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(
              color: Colors.black,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.5),
                spreadRadius: 5,
                blurRadius: 7,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Stack(
                children: [
                  Align(
                    alignment: Alignment(_animation.value * 2 - 1, 0),
                    child: Container(
                      width: 100,
                      height: 40,
                      color:
                          // not animated then background color is white
                          _animation.value == 0
                              ? Colors.white
                              : Colors.black
                                  .withOpacity(0.2 + 0.8 * _animation.value),
                      alignment: Alignment.center,
                      child: Text(
                        'View',
                        style: TextStyle(
                          color: _animation.value == 0
                              ? Colors.black
                              : Colors.white
                                  .withOpacity(0.2 + 0.8 * _animation.value),
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
