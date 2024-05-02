import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';

import 'package:portfolio/src/presentation/widgets/photo_view.dart';

class CertiView extends StatefulWidget {
  String url;
  CertiView({
    Key? key,
    required this.url,
  }) : super(key: key);

  @override
  State<CertiView> createState() => _CertiViewState();
}

class _CertiViewState extends State<CertiView> {
  @override
  Widget build(BuildContext context) {
    return PhotoView(
      imageProvider: AssetImage("assets/certi/certi${widget.url}.png"),
    );
  }
}
