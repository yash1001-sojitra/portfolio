import 'package:flutter/material.dart';
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const SizedBox(height: 100),
        _textHoverWidget(NavTab.Home),
        verticalSize,
        _textHoverWidget(NavTab.About),
        verticalSize,
        _textHoverWidget(NavTab.Works),
        verticalSize,
        _textHoverWidget(NavTab.Educations),
        verticalSize,
        _textHoverWidget(NavTab.Experiences),
        verticalSize,
        _textHoverWidget(NavTab.Certifications),
        verticalSize,
        _textHoverWidget(NavTab.Contact),
        verticalSize,
        verticalSize,
        const DownloadResume(),
      ],
    );
  }

  Widget _textHoverWidget(NavTab text) {
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
              child: Text(
                text.name,
                style: headerStyle.copyWith(
                  color: _hoveredText == text || state.currentTab == text
                      ? Colors.black
                      : Colors.grey,
                  decoration: _hoveredText == text
                      ? TextDecoration.lineThrough
                      : TextDecoration.none,
                  decorationThickness: 2.5,
                  decorationColor:
                      _hoveredText == text ? Colors.black : Colors.grey,
                  fontSize: 30,
                ),
              ));
        }));
  }
}
