import 'package:flutter/material.dart';

class VocabularyPage extends StatefulWidget {
  const VocabularyPage({super.key});

  @override
  State<VocabularyPage> createState() => _VocabularyPageState();
}

class _VocabularyPageState extends State<VocabularyPage> {
  String _searchQuery = '';
  String _filter = 'all';

  @override
  Widget build(BuildContext context) {
    final words = _filteredWords();

    return Scaffold(
      appBar: AppBar(
        title: const Text('生词本'),
        backgroundColor: const Color(0xFF00D084),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.sort),
            onPressed: _showSortOptions,
          ),
        ],
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          _buildFilterChips(),
          Expanded(
            child: words.isEmpty
                ? _buildEmpty()
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: words.length,
                    itemBuilder: (context, i) =>
                        _VocabCard(word: words[i]),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      child: TextField(
        onChanged: (v) => setState(() => _searchQuery = v),
        decoration: InputDecoration(
          hintText: '搜索单词...',
          prefixIcon: const Icon(Icons.search, color: Colors.grey),
          filled: true,
          fillColor: Colors.grey[100],
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(24),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(vertical: 0),
        ),
      ),
    );
  }

  Widget _buildFilterChips() {
    final filters = [
      {'key': 'all', 'label': '全部'},
      {'key': 'new', 'label': '新词'},
      {'key': 'review', 'label': '待复习'},
      {'key': 'mastered', 'label': '已掌握'},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      child: Row(
        children: filters
            .map((f) => Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(f['label']!),
                    selected: _filter == f['key'],
                    onSelected: (_) =>
                        setState(() => _filter = f['key']!),
                    selectedColor: const Color(0xFFE8F8F2),
                    checkmarkColor: const Color(0xFF00D084),
                    labelStyle: TextStyle(
                      color: _filter == f['key']
                          ? const Color(0xFF00A368)
                          : Colors.grey,
                      fontSize: 13,
                    ),
                  ),
                ))
            .toList(),
      ),
    );
  }

  Widget _buildEmpty() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.menu_book_outlined, size: 64, color: Colors.grey),
          SizedBox(height: 16),
          Text('还没有收藏的生词',
              style: TextStyle(fontSize: 16, color: Colors.grey)),
          SizedBox(height: 8),
          Text('训练时长按句子可添加生词',
              style: TextStyle(fontSize: 13, color: Colors.grey)),
        ],
      ),
    );
  }

  void _showSortOptions() {
    showModalBottomSheet(
      context: context,
      builder: (_) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: const Icon(Icons.access_time),
            title: const Text('按添加时间'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.sort_by_alpha),
            title: const Text('按字母顺序'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.replay),
            title: const Text('按复习次数'),
            onTap: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  List<Map<String, dynamic>> _filteredWords() {
    final all = _mockWords();
    return all.where((w) {
      final matchSearch = _searchQuery.isEmpty ||
          (w['word'] as String)
              .toLowerCase()
              .contains(_searchQuery.toLowerCase());
      final matchFilter =
          _filter == 'all' || w['status'] == _filter;
      return matchSearch && matchFilter;
    }).toList();
  }

  List<Map<String, dynamic>> _mockWords() => [
        {
          'word': 'assignment',
          'phonetic': '/əˈsaɪnmənt/',
          'meaning': '作业；任务',
          'example': 'Please submit your assignment by Friday.',
          'status': 'review',
          'reviewCount': 2,
        },
        {
          'word': 'submit',
          'phonetic': '/səbˈmɪt/',
          'meaning': '提交；递交',
          'example': 'You need to submit the form online.',
          'status': 'mastered',
          'reviewCount': 5,
        },
        {
          'word': 'circle back',
          'phonetic': '/ˈsɜːrkl bæk/',
          'meaning': '回头再谈；稍后跟进',
          'example': "Let's circle back on that after the meeting.",
          'status': 'new',
          'reviewCount': 0,
        },
        {
          'word': 'give a hand',
          'phonetic': '/ɡɪv ə hænd/',
          'meaning': '帮忙；协助',
          'example': 'Could you give me a hand with this?',
          'status': 'review',
          'reviewCount': 1,
        },
      ];
}

class _VocabCard extends StatelessWidget {
  final Map<String, dynamic> word;
  const _VocabCard({required this.word});

  @override
  Widget build(BuildContext context) {
    final statusColors = {
      'new': Colors.blue,
      'review': Colors.orange,
      'mastered': const Color(0xFF00D084),
    };
    final statusLabels = {
      'new': '新词',
      'review': '待复习',
      'mastered': '已掌握',
    };
    final status = word['status'] as String;
    final color = statusColors[status] ?? Colors.grey;

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
            children: [
              Text(
                word['word'] as String,
                style: const TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(width: 8),
              Text(
                word['phonetic'] as String,
                style:
                    const TextStyle(fontSize: 13, color: Colors.grey),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  statusLabels[status] ?? '',
                  style: TextStyle(
                      fontSize: 11,
                      color: color,
                      fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            word['meaning'] as String,
            style: const TextStyle(
                fontSize: 14, color: Color(0xFF333333)),
          ),
          const SizedBox(height: 6),
          Text(
            word['example'] as String,
            style: const TextStyle(
                fontSize: 13,
                color: Colors.grey,
                fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '已复习 ${word['reviewCount']} 次',
                style:
                    const TextStyle(fontSize: 11, color: Colors.grey),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.volume_up_outlined,
                        size: 18, color: Color(0xFF00D084)),
                    onPressed: () {},
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                  const SizedBox(width: 12),
                  IconButton(
                    icon: const Icon(Icons.delete_outline,
                        size: 18, color: Colors.grey),
                    onPressed: () {},
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
