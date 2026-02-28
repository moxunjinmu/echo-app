import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:echo_app/models/user.dart';
import 'package:echo_app/services/auth_service.dart';

class AuthState {
  final User? user;
  final String? token;
  final bool isLoading;

  AuthState({
    this.user,
    this.token,
    this.isLoading = false,
  });

  AuthState copyWith({
    User? user,
    String? token,
    bool? isLoading,
  }) {
    return AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;

  AuthNotifier(this._authService) : super(AuthState());

  Future<void> wechatLogin() async {
    state = state.copyWith(isLoading: true);
    try {
      final result = await _authService.wechatLogin();
      state = AuthState(
        user: result['user'],
        token: result['access_token'],
      );
    } catch (e) {
      state = state.copyWith(isLoading: false);
      rethrow;
    }
  }

  Future<void> phoneLogin(String phone, String code) async {
    state = state.copyWith(isLoading: true);
    try {
      final result = await _authService.phoneLogin(phone, code);
      state = AuthState(
        user: result['user'],
        token: result['access_token'],
      );
    } catch (e) {
      state = state.copyWith(isLoading: false);
      rethrow;
    }
  }

  Future<void> sendCode(String phone) async {
    await _authService.sendCode(phone);
  }

  void logout() {
    state = AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(AuthService());
});
