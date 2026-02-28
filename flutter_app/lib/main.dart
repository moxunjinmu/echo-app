import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:echo_app/router/app_router.dart';

void main() {
  runApp(const ProviderScope(child: EchoApp()));
}

class EchoApp extends StatelessWidget {
  const EchoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Echo',
      theme: ThemeData(
        primaryColor: const Color(0xFF00D084),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00D084),
        ),
        useMaterial3: true,
      ),
      routerConfig: appRouter,
    );
  }
}
