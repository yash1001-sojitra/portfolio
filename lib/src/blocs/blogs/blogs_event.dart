part of 'blogs_bloc.dart';

@freezed
class BlogsEvent with _$BlogsEvent {
  const factory BlogsEvent.fetchBlogs() = _FetchBlogs;

  // store all to database 
  const factory BlogsEvent.storeBlogs() = _StoreBlogs;

  // send notification to user
  const factory BlogsEvent.sendNotification() = _SendNotification;
  
}