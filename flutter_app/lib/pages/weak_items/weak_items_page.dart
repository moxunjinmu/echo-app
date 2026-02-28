import 'package:flutter/material.dart';

class WeakItemsPage extends StatefulWidget {
  const WeakItemsPage({super.key});

  @override
  State<WeakItemsPage> createState() => _WeakItemsPageState();
}

class _WeakItemsPageState extends State<WeakItemsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('弱项错题本'),
        backgroundColor: const Color(0xFF00D084),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(text: '错误句子'),
            Tab(text: '弱项分析'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildErrorList(),
          _buildWeakAnalysis(),
        ],
      ),
    );
  }

  Widget _buildErrorList() {
    final items = _mockErrorItems();
    if (items.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle_outline, size: 64, color: Color(0xFF00D084)),
            SizedBox(height: 16),
            Text('暂无错题，继续保持！',
                style: TextStyle(fontSize: 16, color: Colors.grey)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      itemBuilder: (context, i) => _ErrorItem(item: items[i]),
    );
  }

  Widget _buildWeakAnalysis() {
    final weakPoints = [
      {'label': '连读', 'score': 0.45, 'count': 12},
      {'label': '弱读', 'score': 0.60, 'count': 8},
      {'label': '语调', 'score': 0.72, 'count': 5},
      {'label': '辅音', 'score': 0.55, 'count': 9},
      {'label': '元音', 'score': 0.80, 'count': 3},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF3E0),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Row(
              children: [
                Icon(Icons.lightbulb_outline, color: Colors.orange),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '根据你的训练记录，以下发音点需要重点练习',
                    style: TextStyle(fontSize: 13, color: Colors.orange),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          ...weakPoints.map((wp) => _WeakPointBar(
                label: wp['label'] as String,
                score: wp['score'] as double,
                count: wp['count'] as int,
              )),
        ],
      ),
    );
  }

  List<Map<String, dynamic>> _mockErrorItems() => [
        {
          'sentence': 'The professor asked the students to submit their assignments.',
          'course': '托福听力校园对话',
          'accuracy': 52,
          'attempts': 3,
          'date': '2026-02-27',
        },
        {
          'sentence': 'Could you give me a hand with this project?',
          'course': '日常实用口语50句',
          'accuracy': 61,
          'attempts': 2,
          'date': '2026-02-26',
        },
        {
          'sentence': "Let's circle back on that after the meeting.",
          'course': '外企高频会议实战',
          'accuracy': 48,
          'attempts': 4,
          'date': '2026-02-25',
        },
      ];
}

class _ErrorItem extends StatelessWidget {
  final Map<String, dynamic> item;
  const _ErrorItem({required this.item});

  @override
  Widget build(BuildContext context) {
    final accuracy = item['accuracy'] as int;
    final color = accuracy < 60 ? Colors.red : Colors.orange;

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
          Text(
            item['sentence'] as String,
            style: const TextStyle(fontSize: 15),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.book_outlined, size: 12, color: Colors.grey[400]),
              const SizedBox(width: 4),
              Text(item['course'] as String,
                  style:
                      const TextStyle(fontSize: 12, color: Colors.grey)),
              const Spacer(),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '准确率 $accuracy%',
                  style: TextStyle(
                      fontSize: 11,
                      color: color,
                      fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('练习 ${item['attempts']} 次 · ${item['date']}',
                  style:
                      const TextStyle(fontSize: 11, color: Colors.grey)),
              TextButton(
                onPressed: () {},
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text('重新练习',
                    style: TextStyle(
                        fontSize: 12, color: Color(0xFF00D084))),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _WeakPointBar extends StatelessWidget {
  final String label;
  final double score;
  final int count;

  const _WeakPointBar(
      {required this.label, required this.score, required this.count});

  @override
  Widget build(BuildContext context) {
    final color = score < 0.6
        ? Colors.red
        : score < 0.75
            ? Colors.orange
            : const Color(0xFF00D084);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label,
                  style: const TextStyle(
                      fontSize: 14, fontWeight: FontWeight.w500)),
              Text('${(score * 100).toInt()}% · $count 次错误',
                  style:
                      const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: score,
              minHeight: 8,
              backgroundColor: Colors.grey[200],
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ],
      ),
    );
  }
}
