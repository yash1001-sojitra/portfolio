import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';

class CertiView extends StatefulWidget {
  final String url;
  const CertiView({
    super.key,
    required this.url,
  });

  @override
  State<CertiView> createState() => _CertiViewState();
}

class _CertiViewState extends State<CertiView> {
  @override
  Widget build(BuildContext context) {
    final String filename = widget.url.split('/').last;
    final String imagePath = filename.contains('.')
        ? 'assets/certi/$filename'
        : 'assets/certi/certi$filename.png';

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              Navigator.of(context).maybePop();
            }
          },
        ),
      ),
      body: PhotoView(
        imageProvider: AssetImage(imagePath),
      ),
    );
  }
}
