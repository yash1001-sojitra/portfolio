import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/blocs/navigate/navigate_bloc.dart';
import 'package:portfolio/src/comman/enum.dart';
import 'package:portfolio/src/comman/padding_style.dart';
import 'package:portfolio/src/comman/text_style.dart';
import 'package:portfolio/src/presentation/widgets/download_resume_widget.dart';
import 'package:responsive_framework/responsive_framework.dart';

class AppHeader extends StatefulWidget {
  const AppHeader({Key? key}) : super(key: key);

  @override
  State<AppHeader> createState() => _AppHeaderState();
}

class _AppHeaderState extends State<AppHeader> {
  NavTab? _hoveredText;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      width: MediaQuery.of(context).size.width,
      color: Colors.transparent,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: ResponsiveBreakpoints.of(context).isDesktop
            ? _desktopHeader()
            : _mobileHeader(),
      ),
    );
  }

  Widget _desktopHeader() {
    return Row(
      children: [
        MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
              onTap: () {
                context.goNamed(NavTab.Home.name);
              },
              child: Text('YR', style: logoStyle)),
        ),
        const Spacer(),
        _textHoverWidget(NavTab.Home),
        horizontalSize,
        _textHoverWidget(NavTab.About),
        horizontalSize,
        _textHoverWidget(NavTab.Works),
        horizontalSize,
        _textHoverWidget(NavTab.Educations),
        horizontalSize,
        _textHoverWidget(NavTab.Experiences),
        horizontalSize,
        _textHoverWidget(NavTab.Certifications),
        horizontalSize,
        _textHoverWidget(NavTab.Contact),
        horizontalSize,
        _textHoverWidget(NavTab.Blogs),
        // horizontalSize,
        // _textHoverWidget(NavTab.Weather),
        horizontalSize,
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
      child: GestureDetector(onTap: () {
        context.goNamed(text.name);
      }, child: BlocBuilder<NavigateBloc, NavigateState>(
        builder: (context, state) {
          return Text(
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
            ),
          );
        },
      )),
    );
  }

  Widget _mobileHeader() {
    return Row(
      children: [
        MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
              onTap: () {
                context.goNamed(NavTab.Home.name);
              },
              child: Text('YR', style: logoStyle)),
        ),
        const Spacer(),
        IconButton(
          onPressed: () {
            context
                .read<NavigateBloc>()
                .add(const NavigateEvent.toggleDrawer());
          },
          icon: const Icon(Icons.menu, color: Colors.black),
        ),
      ],
    );
  }
}
