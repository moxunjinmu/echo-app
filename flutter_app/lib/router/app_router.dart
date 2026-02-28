import 'package:go_router/go_router.dart';
import 'package:echo_app/pages/login/login_page.dart';
import 'package:echo_app/pages/home/home_page.dart';
import 'package:echo_app/pages/profile/profile_page.dart';
import 'package:echo_app/pages/training/training_page.dart';
import 'package:echo_app/pages/course/course_detail_page.dart';
import 'package:echo_app/pages/progress/progress_page.dart';
import 'package:echo_app/pages/weak_items/weak_items_page.dart';
import 'package:echo_app/pages/vocabulary/vocabulary_page.dart';

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
    GoRoute(
      path: '/training/:courseId',
      builder: (context, state) => TrainingPage(
        courseId: state.pathParameters['courseId']!,
        sentenceId: state.uri.queryParameters['sentenceId'],
      ),
    ),
    GoRoute(
      path: '/course/:courseId',
      builder: (context, state) => CourseDetailPage(
        courseId: state.pathParameters['courseId']!,
      ),
    ),
    GoRoute(
      path: '/progress',
      builder: (context, state) => const ProgressPage(),
    ),
    GoRoute(
      path: '/weak-items',
      builder: (context, state) => const WeakItemsPage(),
    ),
    GoRoute(
      path: '/vocabulary',
      builder: (context, state) => const VocabularyPage(),
    ),
  ],
);
