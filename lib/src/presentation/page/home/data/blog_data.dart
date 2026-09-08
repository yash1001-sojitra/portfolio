import 'package:flutter/material.dart';
import 'package:portfolio/src/presentation/page/home/widgets/blog_data_section.dart';

class BlogData extends StatefulWidget {
  const BlogData({super.key});

  @override
  State<BlogData> createState() => _BlogDataState();
}

class _BlogDataState extends State<BlogData> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          BlogDataSection(
            index: "01",
            topic: "Flutter • Android Native • Google Play Services",
            title:
                "Integrating Phone Number Hint in Flutter with Android Native Code",
            description:
                "A comprehensive guide on retrieving user phone numbers seamlessly using Google Play Services Identity and native Android platform channels in Flutter.",
            url:
                "https://medium.com/@yashsojitra0/integrating-phone-number-hint-in-flutter-with-android-native-code-b35889f39111",
          ),
          BlogDataSection(
            index: "02",
            topic: "Flutter • Shorebird • Code Push • DevOps",
            title: "Shorebird: The Developer’s Unexpected Wingman",
            description:
                "Unlock instant over-the-air code push for Flutter applications to ship bug fixes and updates directly to users without waiting for app store reviews.",
            url:
                "https://medium.com/@yashsojitra0/shorebird-the-developers-unexpected-wingman-11036a5bc945",
          ),
          BlogDataSection(
            index: "03",
            topic: "Firebase • Cloud Firestore • Database Architecture",
            title:
                "Using Firestore References to Avoid Redundancy: A Complete Guide",
            description:
                "Architect scalable NoSQL database schemas in Cloud Firestore using DocumentReferences to normalize relational data and eliminate redundancy.",
            url:
                "https://medium.com/@yashsojitra0/using-firestore-references-to-avoid-redundancy-a-complete-guide-ce6ce3f24423",
          ),
        ],
      ),
    );
  }
}
