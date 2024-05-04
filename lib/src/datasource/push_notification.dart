//send notification
import 'dart:convert';
import 'dart:developer';

import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

sendPushMessageToWeb(
  String token,
  String title,
  String body,
) async {
  try {
    String serverKey = dotenv.get('SERVER_KEY',);
    log('FCM request for web sent! $token');
    await Dio().post('https://fcm.googleapis.com/fcm/send',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization':
                'key=$serverKey'
          },
        ),
        data: {
          'to': token,
          "notification": {
            "title": title,
            "body": body,
          }
        }).then((value) => print(value.data));
    print('FCM request for web sent!');
  } catch (e) {
    print(e);
  }
}
