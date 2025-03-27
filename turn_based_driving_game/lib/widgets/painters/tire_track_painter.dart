import 'dart:math';
import 'package:flutter/material.dart';

/// Custom painter for drawing tire tracks on the canvas
class TireTrackPainter extends CustomPainter {
  final double x;
  final double y;
  final double yaw;
  final double offsetX;
  final double offsetY;
  final double scale;
  final Color color;

  TireTrackPainter({
    required this.x,
    required this.y,
    required this.yaw,
    required this.offsetX,
    required this.offsetY,
    this.scale = 1.0,
    this.color = Colors.black,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Save the current canvas state
    canvas.save();
    
    // Position and rotate for the tire track
    canvas.translate(x, y);
    canvas.rotate(-yaw);
    
    // Calculate the wheel position
    final wheelX = offsetX * scale;
    final wheelY = offsetY * scale;
    
    // Draw the tire track
    final trackPaint = Paint()
      ..color = color.withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0 * scale / 10;
      
    // Draw a small line to represent the tire track
    canvas.drawLine(
      Offset(wheelX - 2 * scale / 10, wheelY),
      Offset(wheelX + 2 * scale / 10, wheelY),
      trackPaint,
    );
    
    // Restore the canvas state
    canvas.restore();
  }

  @override
  bool shouldRepaint(TireTrackPainter oldDelegate) {
    return oldDelegate.x != x ||
        oldDelegate.y != y ||
        oldDelegate.yaw != yaw ||
        oldDelegate.offsetX != offsetX ||
        oldDelegate.offsetY != offsetY ||
        oldDelegate.scale != scale ||
        oldDelegate.color != color;
  }
}