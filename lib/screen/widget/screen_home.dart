import 'package:englich_kids/screen/home/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class SplashVideoScreen extends StatefulWidget {
  const SplashVideoScreen({super.key});

  @override
  State<SplashVideoScreen> createState() => _SplashVideoScreenState();
}

class _SplashVideoScreenState extends State<SplashVideoScreen> {
  late VideoPlayerController _controller;
  bool _isReady = false;
  bool _isNavigated = false;

  @override
  void initState() {
    super.initState();

    _controller = VideoPlayerController.asset('assets/video/screenHome.mp4');

    _initializeVideo();
  }

  Future<void> _initializeVideo() async {
    try {
      await _controller.initialize();

      print('VIDEO LOADED SUCCESSFULLY');

      setState(() {
        _isReady = true;
      });

      await _controller.play();

      _controller.addListener(() {
        if (_isNavigated) return;

        final position = _controller.value.position;
        final duration = _controller.value.duration;

        if (duration.inMilliseconds > 0 &&
            position >= duration &&
            !_controller.value.isPlaying) {
          _isNavigated = true;

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const HomeScreen()),
          );
        }
      });
    } catch (e) {
      print('VIDEO ERROR: $e');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isReady
          ? SizedBox.expand(
              child: FittedBox(
                fit: BoxFit.cover,
                child: SizedBox(
                  width: _controller.value.size.width,
                  height: _controller.value.size.height,
                  child: VideoPlayer(_controller),
                ),
              ),
            )
          : const Center(child: CircularProgressIndicator()),
    );
  }
}
