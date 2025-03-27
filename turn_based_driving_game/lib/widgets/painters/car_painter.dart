import 'dart:math';
import 'package:flutter/material.dart';
import '../../constants/app_constants.dart';

/// Custom painter for drawing a car on the canvas
class CarPainter extends CustomPainter {
  final double x;
  final double y;
  final double yaw;
  final double steering;
  final double opacity;
  final double scale;

  CarPainter({
    required this.x,
    required this.y,
    required this.yaw,
    required this.steering,
    this.opacity = 1.0,
    this.scale = 1.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Save the current canvas state
    canvas.save();
    
    // Position and rotate the car
    canvas.translate(x, y);
    canvas.rotate(-yaw);

    // Calculate dimensions based on scale
    final scaleFactor = scale / 10;
    final carWidth = CarConstants.width * scaleFactor;
    final carLength = CarConstants.length * scaleFactor;
    final wheelWidth = carWidth / 5;
    final wheelLength = carLength / 5.6;

    // Draw car components
    _drawCarBody(canvas, carLength, carWidth, opacity);
    _drawCockpit(canvas, carLength, carWidth, opacity);
    _drawWings(canvas, carLength, carWidth, opacity);

    // Calculate steering angle
    final steeringAngle = (steering / 100) * CarConstants.maxSteeringAngle;
    final wheelPositionRatio = 1.3;

    // Draw wheels
    _drawWheel(canvas, carLength / 3, carWidth / wheelPositionRatio, wheelLength,
        wheelWidth, opacity, steeringAngle); // Front left
    _drawWheel(canvas, carLength / 3, -carWidth / wheelPositionRatio, wheelLength,
        wheelWidth, opacity, steeringAngle); // Front right
    _drawWheel(canvas, -carLength / 3, carWidth / wheelPositionRatio, wheelLength,
        wheelWidth, opacity); // Rear left
    _drawWheel(canvas, -carLength / 3, -carWidth / wheelPositionRatio, wheelLength,
        wheelWidth, opacity); // Rear right

    // Restore the canvas state
    canvas.restore();
  }

  /// Draw a wheel at the specified position with optional steering angle
  void _drawWheel(Canvas canvas, double x, double y, double wheelLength,
      double wheelWidth, double opacity, [double steeringAngle = 0]) {
    canvas.save();
    canvas.translate(x, y);
    canvas.rotate(-steeringAngle);
    
    final wheelPaint = Paint()
      ..color = Colors.black.withOpacity(opacity)
      ..style = PaintingStyle.fill;
      
    canvas.drawRect(
      Rect.fromCenter(
        center: Offset.zero,
        width: wheelLength,
        height: wheelWidth,
      ),
      wheelPaint,
    );
    
    canvas.restore();
  }

  /// Draw the car body
  void _drawCarBody(Canvas canvas, double carLength, double carWidth, double opacity) {
    final bodyPaint = Paint()
      ..color = Colors.red.withOpacity(opacity)
      ..style = PaintingStyle.fill;

    final path = Path();
    
    // Draw car body shape
    path.moveTo(-carLength / 2, -carWidth / 4);
    path.lineTo(-carLength / 3, -carWidth / 2);
    path.lineTo(carLength / 3, -carWidth / 2);
    path.lineTo(carLength / 2, -carWidth / 4);
    path.lineTo(carLength / 2, carWidth / 4);
    path.lineTo(carLength / 3, carWidth / 2);
    path.lineTo(-carLength / 3, carWidth / 2);
    path.lineTo(-carLength / 2, carWidth / 4);
    path.close();
    
    canvas.drawPath(path, bodyPaint);
  }

  /// Draw the car cockpit
  void _drawCockpit(Canvas canvas, double carLength, double carWidth, double opacity) {
    final cockpitPaint = Paint()
      ..color = Colors.grey.shade800.withOpacity(opacity)
      ..style = PaintingStyle.fill;

    canvas.drawOval(
      Rect.fromCenter(
        center: Offset.zero,
        width: carLength / 6,
        height: carWidth / 3,
      ),
      cockpitPaint,
    );
  }

  /// Draw the car wings
  void _drawWings(Canvas canvas, double carLength, double carWidth, double opacity) {
    final wingPaint = Paint()
      ..color = Colors.red.shade800.withOpacity(opacity)
      ..style = PaintingStyle.fill;

    // Front wing
    canvas.drawRect(
      Rect.fromLTWH(
        carLength / 2,
        -carWidth / 1.5,
        carLength / 10,
        carWidth * 1.3,
      ),
      wingPaint,
    );

    // Rear wing
    canvas.drawRect(
      Rect.fromLTWH(
        -carLength / 2 - carLength / 10,
        -carWidth / 1.5,
        carLength / 10,
        carWidth * 1.3,
      ),
      wingPaint,
    );
  }

  @override
  bool shouldRepaint(CarPainter oldDelegate) {
    return oldDelegate.x != x ||
        oldDelegate.y != y ||
        oldDelegate.yaw != yaw ||
        oldDelegate.steering != steering ||
        oldDelegate.opacity != opacity ||
        oldDelegate.scale != scale;
  }
}