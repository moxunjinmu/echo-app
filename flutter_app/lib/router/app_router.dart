import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:echo_app/pages/login/login_page.dart';
import 'package:echo_app/pages/home/home_page.dart';
import 'package:echo_app/pages/profile/profile_page.dart';

final appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfilePage(),
    ),
  ],
);
