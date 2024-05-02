import 'package:flutter/material.dart';
import 'package:portfolio/src/presentation/page/home/widgets/work_data_section.dart';

class WorkData extends StatefulWidget {
  const WorkData({super.key});

  @override
  State<WorkData> createState() => _WorkDataState();
}

class _WorkDataState extends State<WorkData> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          WorkDataSection(
            index: "01",
            title: 'CRIC BEATS',
            description: 'Live Cricket Score App',
            url:
                "https://play.google.com/store/apps/details?id=com.iycreateapp.cricbeats",
            image: "assets/applogo/cricbeats3.png",
          ),
          WorkDataSection(
            index: "02",
            title: 'ClgBuddy',
            description: 'Communication App for College Students',
            url:
                "https://play.google.com/store/apps/details?id=com.iycreateapp.clgbuddy",
            image: "assets/applogo/clg_logo.png",
          ),
          WorkDataSection(
            index: "03",
            title: 'MY Hostel',
            description: 'Hostel Management App',
            url:
                "https://play.google.com/store/apps/details?id=com.iycreateapp.myhostel",
            image: "assets/applogo/myhostel_logo.png",
          ),
        ],
      ),
    );
  }
}
