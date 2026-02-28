import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Echo'),
        backgroundColor: const Color(0xFF00D084),
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text('首页 - 课程列表'),
      ),
    );
  }
}
