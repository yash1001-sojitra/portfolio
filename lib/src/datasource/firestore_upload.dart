import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreUpload {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<void> uploadData(Map<String, dynamic> data) async {
    await _firestore.collection("Weather").add(data);
  }

 // Analytics

  Future<void> uploadAnalytics(Map<String, dynamic> data) async {
    await _firestore.collection("Analytics").add(data);
  }
  
}
