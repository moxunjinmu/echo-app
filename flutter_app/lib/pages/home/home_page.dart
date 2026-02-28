import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Echo'),
        backgroundColor: const Color(0xFF00D084),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.menu_book_outlined),
            onPressed: () => context.push('/vocabulary'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildQuickActions(context),
            const SizedBox(height: 24),
            const Text('推荐课程',
                style:
                    TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ..._mockCourses()
                .map((c) => _CourseCard(course: c)),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(context),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        _QuickAction(
          icon: Icons.trending_up,
          label: '学习进度',
          onTap: () => context.push('/progress'),
        ),
        const SizedBox(width: 12),
        _QuickAction(
          icon: Icons.error_outline,
          label: '弱项错题',
          onTap: () => context.push('/weak-items'),
        ),
        const SizedBox(width: 12),
        _QuickAction(
          icon: Icons.menu_book_outlined,
          label: '生词本',
          onTap: () => context.push('/vocabulary'),
        ),
      ],
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: 0,
      selectedItemColor: const Color(0xFF00D084),
      onTap: (i) {
        if (i == 1) context.push('/progress');
        if (i == 2) context.push('/profile');
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: '首页'),
        BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart), label: '进度'),
        BottomNavigationBarItem(
            icon: Icon(Icons.person), label: '我的'),
      ],
    );
  }

  List<Map<String, dynamic>> _mockCourses() => [
        {
          'id': 'course_001',
          'title': '托福听力校园对话精选',
          'description': '攻克新题型，先听后说直觉反射',
          'category': 'TOEFL',
          'difficulty': '进阶',
          'total': 45,
          'progress': 0.35,
          'isVip': false,
        },
        {
          'id': 'course_002',
          'title': '日常实用口语50句',
          'description': '适合零基础，培养英语语感',
          'category': '日常',
          'difficulty': '入门',
          'total': 50,
          'progress': 0.72,
          'isVip': false,
        },
        {
          'id': 'course_003',
          'title': '外企高频会议实战',
          'description': '摆脱哑巴英语，地道职场表达',
          'category': '商务',
          'difficulty': '中级',
          'total': 30,
          'progress': 0.10,
          'isVip': true,
        },
      ];
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickAction(
      {required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: const Color(0xFFE8F8F2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              Icon(icon, color: const Color(0xFF00D084), size: 24),
              const SizedBox(height: 6),
              Text(label,
                  style: const TextStyle(
                      fontSize: 12, color: Color(0xFF00A368))),
            ],
          ),
        ),
      ),
    );
  }
}

class _CourseCard extends StatelessWidget {
  final Map<String, dynamic> course;
  const _CourseCard({required this.course});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/course/${course['id']}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 8,
                offset: const Offset(0, 2))
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    course['title'] as String,
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                ),
                if (course['isVip'] as bool)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.amber[100],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text('VIP',
                        style: TextStyle(
                            fontSize: 11,
                            color: Colors.amber,
                            fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text(course['description'] as String,
                style:
                    const TextStyle(fontSize: 13, color: Colors.grey)),
            const SizedBox(height: 10),
            Row(
              children: [
                _tag(course['category'] as String),
                const SizedBox(width: 6),
                _tag(course['difficulty'] as String),
                const SizedBox(width: 6),
                _tag('${course['total']} 句'),
                const Spacer(),
                Text(
                  '${((course['progress'] as double) * 100).toInt()}%',
                  style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF00A368),
                      fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: course['progress'] as double,
                minHeight: 4,
                backgroundColor: Colors.grey[200],
                valueColor: const AlwaysStoppedAnimation<Color>(
                    Color(0xFF00D084)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _tag(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(label,
          style: const TextStyle(fontSize: 11, color: Colors.grey)),
    );
  }
}
