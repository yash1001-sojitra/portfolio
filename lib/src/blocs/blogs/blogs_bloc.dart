import 'dart:developer';

import 'package:bloc/bloc.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/main.dart';
import 'package:portfolio/src/comman/enum.dart';
import 'package:portfolio/src/datasource/firestore_upload.dart';
import 'package:portfolio/src/datasource/push_notification.dart';
import 'package:portfolio/src/datasource/weather_data.dart';

part 'blogs_event.dart';
part 'blogs_state.dart';
part 'blogs_bloc.freezed.dart';

class BlogsBloc extends Bloc<BlogsEvent, BlogsState> {
  BlogsBloc() : super(BlogsState.initial()) {
    on<BlogsEvent>((event, emit) async {
      event.map(
        fetchBlogs: (e) {
          log("fetching blogs");
          WeatherData().getWeatherData().then((value) {
            emit(BlogsState(requestState: RequestState.loaded, blogs: value));
          });
          // add(const BlogsEvent.storeBlogs());
        },
        storeBlogs: (e) {
          FirestoreUpload().uploadData({
            "title": "Blog 1",
            "description": "This is blog 1",
            "date": DateTime.now().toIso8601String()
          });

          // send notification to user
          add(const BlogsEvent.sendNotification());
        },
        sendNotification: (e) {
          if (token != null) {
            // send notification to user
            sendPushMessageToWeb(
                token!, "Blog Added Succesfully", "New Blog Added");
          } else {
            FirebaseMessaging.instance.getToken().then((value) {
              token = value;
              sendPushMessageToWeb(
                  token!, "Blog Added Succesfully", "New Blog Added");
            });
          }
        },
      );
    });
  }
}
