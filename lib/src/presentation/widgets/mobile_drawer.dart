import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/blocs/navigate/navigate_bloc.dart';
import 'package:portfolio/src/comman/enum.dart';
import 'package:portfolio/src/comman/padding_style.dart';
import 'package:portfolio/src/comman/text_style.dart';
import 'package:portfolio/src/presentation/widgets/download_resume_widget.dart';

class MobileDrawer extends StatefulWidget {
  const MobileDrawer({super.key});

  @override
  State<MobileDrawer> createState() => _MobileDrawerState();
}

class _MobileDrawerState extends State<MobileDrawer> {
  NavTab? _hoveredText;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 100),
          _textHoverWidget(NavTab.Home, 0),
          verticalSize,
          _textHoverWidget(NavTab.About, 1),
          verticalSize,
          _textHoverWidget(NavTab.Works, 2),
          verticalSize,
          _textHoverWidget(NavTab.Educations, 3),
          verticalSize,
          _textHoverWidget(NavTab.Experiences, 4),
          verticalSize,
          _textHoverWidget(NavTab.Certifications, 5),
          verticalSize,
          _textHoverWidget(NavTab.Contact, 6),
          verticalSize,
          _textHoverWidget(NavTab.Blogs, 6),
          verticalSize,
          verticalSize,
          const DownloadResume(),
          const SizedBox(height: 50)
        ],
      ),
    );
  }

  Widget _textHoverWidget(NavTab text, int index) {
    return MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (event) {
          setState(() {
            _hoveredText = text;
          });
        },
        onExit: (event) {
          setState(() {
            _hoveredText = null;
          });
        },
        child:
            BlocBuilder<NavigateBloc, NavigateState>(builder: (context, state) {
          return GestureDetector(
              onTap: () {
                if (state.isDrawerOpen) {
                  context
                      .read<NavigateBloc>()
                      .add(const NavigateEvent.toggleDrawer());
                }
                context.goNamed(text.name);
              },
              child: Stack(
                children: [
                  Container(
                    alignment: Alignment.center,
                    child: _hoveredText == text
                        ? SizedBox(
                            height: 100,
                            width: 200,
                            child: Text(
                              "0$index",
                              textAlign: TextAlign.center,
                              style: headerStyle.copyWith(
                                fontSize: 70,
                                color: Colors.grey[200],
                              ),
                            ),
                          )
                        : const SizedBox(
                            height: 50,
                            width: 200,
                          ),
                  ),
                  Positioned(
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          text.name,
                          style: headerStyle.copyWith(
                            color:
                                _hoveredText == text || state.currentTab == text
                                    ? Colors.black
                                    : Colors.grey,
                            // decoration: _hoveredText == text
                            //     ? TextDecoration.lineThrough
                            //     : TextDecoration.none,
                            // decorationThickness: 2.5,
                            // decorationColor: _hoveredText == text
                            //     ? Colors.black
                            //     : Colors.grey,
                            fontSize: 30,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ));
        }));
  }
}
