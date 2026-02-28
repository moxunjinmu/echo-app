import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class TrainingPage extends ConsumerStatefulWidget {
  final String courseId;
  final String? sentenceId;

  const TrainingPage({
    super.key,
    required this.courseId,
    this.sentenceId,
  });

  @override
  ConsumerState<TrainingPage> createState() => _TrainingPageState();
}

class _TrainingPageState extends ConsumerState<TrainingPage> {
  int _currentIndex = 0;
  int _totalSentences = 45;
  bool _isPlaying = false;
  bool _isRecording = false;
  bool _showResult = false;
  String _recognizedText = '';
  int _accuracyScore = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('第 ${_currentIndex + 1} / $_totalSentences 句'),
        backgroundColor: const Color(0xFF00D084),
      ),
      body: Column(
        children: [
          // 进度条
          LinearProgressIndicator(
            value: (_currentIndex + 1) / _totalSentences,
            backgroundColor: Colors.grey[200],
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF00D084)),
          ),

          // 句子展示区
          Expanded(
            child: Center(
              child: _showResult
                  ? _buildResultArea()
                  : const Text(
                      '请仔细听，不要看字幕',
                      style: TextStyle(fontSize: 24, color: Colors.grey),
                    ),
            ),
          ),

          // 控制区
          _buildControls(),
        ],
      ),
    );
  }

  Widget _buildResultArea() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          _recognizedText,
          style: const TextStyle(fontSize: 24),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          decoration: BoxDecoration(
            color: const Color(0xFFE8F8F2),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Text(
            '发音准确度 $_accuracyScore%',
            style: const TextStyle(
              color: Color(0xFF00A368),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildControls() {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          // 操作按钮
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                onPressed: _playAudio,
                icon: const Icon(Icons.replay),
                iconSize: 48,
                color: const Color(0xFF00D084),
              ),
              GestureDetector(
                onLongPressStart: _startRecording,
                onLongPressEnd: _stopRecording,
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: _isRecording ? Colors.red : const Color(0xFF00D084),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _isRecording ? Icons.stop : Icons.mic,
                    color: Colors.white,
                    size: 40,
                  ),
                ),
              ),
              IconButton(
                onPressed: _nextSentence,
                icon: const Icon(Icons.skip_next),
                iconSize: 48,
                color: const Color(0xFF00D084),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            _isRecording ? '松手结束录音' : '长按开始录音',
            style: const TextStyle(color: Colors.grey),
          ),
          if (_showResult) ...[
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _nextSentence,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00D084),
                minimumSize: const Size(double.infinity, 48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
              ),
              child: const Text('下一句'),
            ),
          ],
        ],
      ),
    );
  }

  void _playAudio() {
    setState(() => _isPlaying = true);
    // TODO: 播放音频
    Future.delayed(const Duration(seconds: 2), () {
      setState(() => _isPlaying = false);
    });
  }

  void _startRecording(LongPressStartDetails details) {
    setState(() => _isRecording = true);
    // TODO: 开始录音
  }

  void _stopRecording(LongPressEndDetails details) {
    setState(() => _isRecording = false);
    // TODO: 停止录音并识别

    // 模拟识别结果
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        _recognizedText = 'Hello world';
        _accuracyScore = 85;
        _showResult = true;
      });
    });
  }

  void _nextSentence() {
    setState(() {
      _currentIndex++;
      _showResult = false;
      _recognizedText = '';
      _accuracyScore = 0;
    });
  }
}
