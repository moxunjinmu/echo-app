import 'package:dio/dio.dart';

class AuthService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://localhost:3000/api/v1',
  ));

  Future<Map<String, dynamic>> wechatLogin() async {
    // TODO: 集成微信 SDK 获取 code
    const mockCode = 'flutter_wechat_code';

    final response = await _dio.post('/auth/weapp/login', data: {
      'code': mockCode,
    });

    return response.data;
  }

  Future<Map<String, dynamic>> phoneLogin(String phone, String code) async {
    final response = await _dio.post('/auth/phone/login', data: {
      'phone': phone,
      'code': code,
    });

    return response.data;
  }

  Future<void> sendCode(String phone) async {
    await _dio.post('/auth/phone/send_code', data: {
      'phone': phone,
    });
  }
}
