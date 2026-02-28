import 'package:flutter/material.dart';

class ProgressPage extends StatelessWidget {
  const ProgressPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('学习进度'),
        backgroundColor: const Color(0xFF00D084),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSummaryCards(),
            const SizedBox(height: 24),
            const Text('本周训练',
                style:
                    TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildWeeklyChart(),
            const SizedBox(height: 24),
            const Text('课程进度',
                style:
                    TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildCourseProgressList(),
            const SizedBox(height: 24),
            const Text('学习连续天数',
                style:
                    TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildStreakCalendar(),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCards() {
    final stats = [
      {'label': '累计句子', 'value': '256', 'icon': Icons.format_quote},
      {'label': '训练天数', 'value': '18', 'icon': Icons.calendar_today},
      {'label': '平均准确率', 'value': '82%', 'icon': Icons.trending_up},
      {'label': '连续打卡', 'value': '7天', 'icon': Icons.local_fire_department},
    ];

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.6,
      children: stats
          .map((s) => _StatCard(
                label: s['label'] as String,
                value: s['value'] as String,
                icon: s['icon'] as IconData,
              ))
          .toList(),
    );
  }

  Widget _buildWeeklyChart() {
    final days = ['一', '二', '三', '四', '五', '六', '日'];
    final counts = [12, 8, 15, 0, 20, 18, 10];
    final maxCount = counts.reduce((a, b) => a > b ? a : b);

    return Container(
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
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: List.generate(7, (i) {
          final ratio = maxCount > 0 ? counts[i] / maxCount : 0.0;
          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('${counts[i]}',
                  style: const TextStyle(fontSize: 10, color: Colors.grey)),
              const SizedBox(height: 4),
              Container(
                width: 28,
                height: 80 * ratio + 4,
                decoration: BoxDecoration(
                  color: counts[i] > 0
                      ? const Color(0xFF00D084)
                      : Colors.grey[200],
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(height: 4),
              Text(days[i],
                  style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          );
        }),
      ),
    );
  }

  Widget _buildCourseProgressList() {
    final courses = [
      {'title': '托福听力校园对话', 'progress': 0.35, 'done': 16, 'total': 45},
      {'title': '日常实用口语50句', 'progress': 0.72, 'done': 36, 'total': 50},
      {'title': '外企高频会议实战', 'progress': 0.10, 'done': 3, 'total': 30},
    ];

    return Column(
      children: courses
          .map((c) => _CourseProgressItem(
                title: c['title'] as String,
                progress: c['progress'] as double,
                done: c['done'] as int,
                total: c['total'] as int,
              ))
          .toList(),
    );
  }

  Widget _buildStreakCalendar() {
    // Simple 4-week grid
    final today = DateTime.now();
    return Container(
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
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 7,
          crossAxisSpacing: 4,
          mainAxisSpacing: 4,
        ),
        itemCount: 28,
        itemBuilder: (context, i) {
          final day = today.subtract(Duration(days: 27 - i));
          final hasActivity = i % 3 != 0; // mock
          return Container(
            decoration: BoxDecoration(
              color: hasActivity
                  ? const Color(0xFF00D084)
                  : Colors.grey[100],
              borderRadius: BorderRadius.circular(4),
            ),
            child: Center(
              child: Text(
                '${day.day}',
                style: TextStyle(
                  fontSize: 10,
                  color: hasActivity ? Colors.white : Colors.grey,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _StatCard(
      {required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
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
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF00D084), size: 28),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(value,
                  style: const TextStyle(
                      fontSize: 20, fontWeight: FontWeight.bold)),
              Text(label,
                  style:
                      const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        ],
      ),
    );
  }
}

class _CourseProgressItem extends StatelessWidget {
  final String title;
  final double progress;
  final int done;
  final int total;

  const _CourseProgressItem(
      {required this.title,
      required this.progress,
      required this.done,
      required this.total});

  @override
  Widget build(BuildContext context) {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title,
                  style: const TextStyle(
                      fontSize: 14, fontWeight: FontWeight.w500)),
              Text('$done/$total 句',
                  style:
                      const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 6,
              backgroundColor: Colors.grey[200],
              valueColor: const AlwaysStoppedAnimation<Color>(
                  Color(0xFF00D084)),
            ),
          ),
        ],
      ),
    );
  }
}
