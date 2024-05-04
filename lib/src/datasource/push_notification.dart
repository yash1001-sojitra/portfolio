//send notification
import 'dart:convert';
import 'dart:developer';

import 'package:dio/dio.dart';

sendPushMessageToWeb(
  String token,
  String title,
  String body,
) async {
  try {
    log('FCM request for web sent! $token');
    await Dio().post('https://fcm.googleapis.com/fcm/send',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization':
                'key=AAAANMDGToE:APA91bHoNJ76dcCJN3WFy-hMpBm2V0LJEzpFxQGxIzDfNte5i5cBZqGWhfjr8zoFW-goloTkRbVeW51o6K7TNJ_McjmG0I92IZb8Pjw-9LcOFAKSKA4RwTsDQZImJTVsEcShijYLCqC0'
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
