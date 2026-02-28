import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CourseDetailPage extends StatelessWidget {
  final String courseId;

  const CourseDetailPage({super.key, required this.courseId});

  @override
  Widget build(BuildContext context) {
    // Mock data
    final course = _mockCourse();

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: const Color(0xFF00D084),
            foregroundColor: Colors.white,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(course['title'] as String),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF00D084), Color(0xFF00A368)],
                  ),
                ),
                child: const Center(
                  child: Icon(Icons.headphones, size: 80, color: Colors.white30),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats row
                  Row(
                    children: [
                      _statChip(Icons.format_list_numbered,
                          '${course['total_sentences']} 句'),
                      const SizedBox(width: 8),
                      _statChip(
                          Icons.timer, '${course['estimated_minutes']} 分钟'),
                      const SizedBox(width: 8),
                      _statChip(Icons.signal_cellular_alt,
                          course['difficulty'] as String),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    course['description'] as String,
                    style: const TextStyle(fontSize: 15, color: Colors.black87),
                  ),
                  const SizedBox(height: 24),
                  // Progress
                  const Text('学习进度',
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: (course['progress'] as int) / 100,
                      minHeight: 8,
                      backgroundColor: Colors.grey[200],
                      valueColor: const AlwaysStoppedAnimation<Color>(
                          Color(0xFF00D084)),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text('${course['progress']}% 已完成',
                      style:
                          const TextStyle(fontSize: 12, color: Colors.grey)),
                  const SizedBox(height: 24),
                  // Sentence list
                  const Text('句子列表',
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                ],
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) => _SentenceItem(index: index),
              childCount: course['total_sentences'] as int,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: () => context.push('/training/$courseId'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF00D084),
              minimumSize: const Size(double.infinity, 52),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(26)),
            ),
            child: const Text('开始训练',
                style: TextStyle(fontSize: 18, color: Colors.white)),
          ),
        ),
      ),
    );
  }

  Widget _statChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F8F2),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: const Color(0xFF00A368)),
          const SizedBox(width: 4),
          Text(label,
              style:
                  const TextStyle(fontSize: 12, color: Color(0xFF00A368))),
        ],
      ),
    );
  }

  Map<String, dynamic> _mockCourse() => {
        'title': '托福听力校园对话精选',
        'description': '攻克新题型，先听后说直觉反射。精选45句高频校园对话，帮助你快速提升听力理解和口语表达能力。',
        'category': 'toefl',
        'difficulty': '进阶',
        'total_sentences': 45,
        'estimated_minutes': 30,
        'progress': 35,
      };
}

class _SentenceItem extends StatelessWidget {
  final int index;
  const _SentenceItem({required this.index});

  @override
  Widget build(BuildContext context) {
    final isDone = index < 16;
    return ListTile(
      leading: CircleAvatar(
        radius: 16,
        backgroundColor:
            isDone ? const Color(0xFF00D084) : Colors.grey[200],
        child: isDone
            ? const Icon(Icons.check, size: 16, color: Colors.white)
            : Text('${index + 1}',
                style:
                    const TextStyle(fontSize: 12, color: Colors.grey)),
      ),
      title: Text('句子 ${index + 1}',
          style: const TextStyle(fontSize: 14)),
      subtitle: Text(
        isDone ? '已完成' : '未学习',
        style: TextStyle(
            fontSize: 12, color: isDone ? const Color(0xFF00D084) : Colors.grey),
      ),
      trailing: isDone
          ? const Icon(Icons.star, color: Colors.amber, size: 16)
          : null,
    );
  }
}
