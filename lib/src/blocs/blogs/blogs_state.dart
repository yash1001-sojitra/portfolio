part of 'blogs_bloc.dart';

@freezed
class BlogsState with _$BlogsState {
  const factory BlogsState({
    required RequestState requestState,
    required List<String> blogs,
  }) = _BlogsState;

  factory BlogsState.initial() => const BlogsState(
        requestState: RequestState.empty,
        blogs: [],
      );
}
