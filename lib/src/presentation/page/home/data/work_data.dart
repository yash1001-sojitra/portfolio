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
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          WorkDataSection(
            index: "01",
            title: 'NevamCX',
            description:
                'AI-Powered Customer Feedback & Experience Management Platform',
            url: "https://www.nevamcx.com/",
            image: "assets/applogo/nevam.png",
          ),
          WorkDataSection(
            index: "02",
            title: 'FireDraw',
            description:
                'Collaborative Drawing Canvas & Realtime Sketching Tool',
            url: "https://firedraw.dezoko.com/",
            image: "assets/applogo/firedraw.png",
          ),
          WorkDataSection(
            index: "03",
            title: 'AI Proposal Agent',
            description:
                'Autonomous RFP & Proposal Generation Agent with RAG Pipeline',
            url: "https://spectrum-frontend-prod-graqjg6dna-ww.a.run.app",
            image: "",
          ),
          WorkDataSection(
            index: "04",
            title: 'School Analytics',
            description:
                'AI-Powered School Analytics & Performance Intelligence Platform',
            url: "",
            image: "",
          ),
          WorkDataSection(
            index: "05",
            title: 'CRIC BEATS',
            description:
                'Live Cricket Score & Ball-by-Ball Commentary App (Flutter, Firebase)',
            url:
                "https://play.google.com/store/apps/details?id=com.iycreateapp.cricbeats",
            image: "assets/applogo/cricbeats3.png",
          ),
          WorkDataSection(
            index: "06",
            title: 'ClgBuddy',
            description: 'Campus Social Network & Academic Collaboration App',
            url:
                "https://play.google.com/store/apps/details?id=com.iycreateapp.clgbuddy",
            image: "assets/applogo/clg_logo.png",
          ),
          WorkDataSection(
            index: "07",
            title: 'MY Hostel',
            description: 'Hostel Administration & Resident Management System',
            url:
                "https://play.google.com/store/apps/details?id=com.iycreateapp.myhostel",
            image: "assets/applogo/myhostel_logo.png",
          ),
        ],
      ),
    );
  }
}
