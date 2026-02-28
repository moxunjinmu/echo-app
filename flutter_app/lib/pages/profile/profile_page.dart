import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('我的'),
        backgroundColor: const Color(0xFF00D084),
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text('个人中心'),
      ),
    );
  }
}
