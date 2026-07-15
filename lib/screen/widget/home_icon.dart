import 'package:flutter/material.dart';

// ignore: must_be_immutable
class TapRow extends StatelessWidget {
  String name;
  Color color = Colors.white54;
  String image;
  Function() onTap;
  bool isLocked;

  TapRow({
    super.key,
    required this.name,
    required this.image,
    required this.onTap,
    this.isLocked = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            end: Alignment.topCenter,
            begin: Alignment.bottomCenter,
            stops: const [0, 1],
            tileMode: TileMode.clamp,
            colors: [Theme.of(context).dividerColor, color],
          ),
          borderRadius: BorderRadius.circular(50),
          color: color,
        ),
        margin: const EdgeInsets.all(10),
        alignment: Alignment.center,
        width: MediaQuery.of(context).size.width * .5,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: MediaQuery.of(context).size.width * .42,
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.15),
                            blurRadius: 12,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Image.asset(image, fit: BoxFit.cover),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 1),
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 26,
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            if (isLocked)
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(50),
                    color: Colors.black.withOpacity(0.15), // تظليل خفيف جداً ليظهر النص
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(
                        Icons.lock,
                        color: Colors.white,
                        size: 40,
                        shadows: [Shadow(color: Colors.black54, blurRadius: 10)],
                      ),
                      SizedBox(height: 5),
                      Text(
                        'قريباً',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          shadows: [Shadow(color: Colors.black54, blurRadius: 10)],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
