import 'dart:io';

import 'package:dio/dio.dart';

import 'package:universal_html/html.dart' as html;

Future<void> downloadPDF(String url, String fileName) async {
  try {
    final response = await Dio().get(
      url,
      options: Options(responseType: ResponseType.bytes),
    );

    final file = File(fileName);
    await file.writeAsBytes(response.data);
    // Show a message or perform any additional action upon successful download
    print('PDF downloaded successfully!');
  } catch (error) {
    // Handle errors, e.g., showing an error message
    print('Failed to download PDF: $error');
  }
}

void downloadFile(String url) {
  final anchor = html.AnchorElement(href: url)..setAttribute('download', '');
  anchor.click();
}
