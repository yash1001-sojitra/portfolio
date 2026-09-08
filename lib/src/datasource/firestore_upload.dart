import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreUpload {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Analytics

  Future<void> uploadAnalytics(Map<String, dynamic> data) async {
    await _firestore.collection("Analytics").add(data);
  }
  
}
