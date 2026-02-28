import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:echo_app/providers/auth_provider.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _phoneController = TextEditingController();
  final _codeController = TextEditingController();
  bool _agreed = false;
  bool _canSendCode = false;
  int _countdown = 0;

  @override
  void dispose() {
    _phoneController.dispose();
    _codeController.dispose();
    super.dispose();
  }

  bool _validatePhone(String phone) {
    return RegExp(r'^1[3-9]\d{9}$').hasMatch(phone);
  }

  Future<void> _handleWechatLogin() async {
    if (!_agreed) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请先同意用户协议')),
      );
      return;
    }

    // TODO: 实现微信登录
    try {
      await ref.read(authProvider.notifier).wechatLogin();
      if (mounted) {
        context.go('/home');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('登录失败: $e')),
        );
      }
    }
  }

  Future<void> _handlePhoneLogin() async {
    if (!_agreed) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请先同意用户协议')),
      );
      return;
    }

    if (!_validatePhone(_phoneController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请输入正确的手机号')),
      );
      return;
    }

    if (_codeController.text.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请输入6位验证码')),
      );
      return;
    }

    try {
      await ref.read(authProvider.notifier).phoneLogin(
            _phoneController.text,
            _codeController.text,
          );
      if (mounted) {
        context.go('/home');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('登录失败: $e')),
        );
      }
    }
  }

  Future<void> _handleSendCode() async {
    if (!_canSendCode) return;

    try {
      await ref.read(authProvider.notifier).sendCode(_phoneController.text);
      _startCountdown();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('验证码已发送')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('发送失败: $e')),
        );
      }
    }
  }

  void _startCountdown() {
    setState(() {
      _countdown = 60;
      _canSendCode = false;
    });

    Future.delayed(const Duration(seconds: 1), () {
      if (_countdown > 0) {
        setState(() => _countdown--);
        _startCountdown();
      } else {
        setState(() {
          _canSendCode = _validatePhone(_phoneController.text);
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFE8F8F2), Color(0xFFF7F8FA)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                const Icon(
                  Icons.headphones,
                  size: 80,
                  color: Color(0xFF00D084),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Echo',
                  style: TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  '盲听复说英语训练',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 48),

                // 微信登录按钮
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _handleWechatLogin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF07C160),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                    icon: const Icon(Icons.chat),
                    label: const Text(
                      '微信一键登录',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // 分割线
                Row(
                  children: [
                    const Expanded(child: Divider()),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Text('或', style: TextStyle(color: Colors.grey)),
                    ),
                    const Expanded(child: Divider()),
                  ],
                ),
                const SizedBox(height: 24),

                // 手机号输入
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  maxLength: 11,
                  decoration: InputDecoration(
                    hintText: '请输入手机号',
                    filled: true,
                    fillColor: Colors.grey[100],
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onChanged: (value) {
                    setState(() {
                      _canSendCode = _validatePhone(value) && _countdown == 0;
                    });
                  },
                ),
                const SizedBox(height: 16),

                // 验证码输入
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _codeController,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
                        decoration: InputDecoration(
                          hintText: '验证码',
                          filled: true,
                          fillColor: Colors.grey[100],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    SizedBox(
                      width: 120,
                      child: ElevatedButton(
                        onPressed: _canSendCode ? _handleSendCode : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _canSendCode
                              ? const Color(0xFF00D084)
                              : Colors.grey,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          _countdown > 0 ? '${_countdown}s' : '发送验证码',
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // 手机号登录按钮
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _handlePhoneLogin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF00D084),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                    child: const Text(
                      '登录',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // 用户协议
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Checkbox(
                      value: _agreed,
                      onChanged: (value) {
                        setState(() => _agreed = value ?? false);
                      },
                      activeColor: const Color(0xFF00D084),
                    ),
                    const Text.rich(
                      TextSpan(
                        text: '我已阅读并同意',
                        children: [
                          TextSpan(
                            text: '《用户协议》',
                            style: TextStyle(color: Color(0xFF00D084)),
                          ),
                          TextSpan(text: '和'),
                          TextSpan(
                            text: '《隐私政策》',
                            style: TextStyle(color: Color(0xFF00D084)),
                          ),
                        ],
                      ),
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
