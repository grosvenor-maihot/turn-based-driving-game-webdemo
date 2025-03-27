import 'package:flutter/material.dart';
import '../../models/simulation_models.dart';
import '../../constants/app_constants.dart';

/// Custom painter for drawing trajectories on the canvas
class TrajectoryPainter extends CustomPainter {
  final List<Position> positions;
  final Color color;
  final double lineWidth;
  final double scale;
  final double opacity;

  TrajectoryPainter({
    required this.positions,
    this.color = Colors.blue,
    this.lineWidth = 2.0,
    this.scale = 1.0,
    this.opacity = 0.3,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (positions.isEmpty) return;

    final paint = Paint()
      ..color = color.withOpacity(opacity)
      ..style = PaintingStyle.stroke
      ..strokeWidth = lineWidth * scale / 10;

    final path = Path();
    
    // Transform the first position
    final firstPos = _transformCoordinates(positions.first.x, positions.first.y);
    path.moveTo(firstPos.dx, firstPos.dy);
    
    // Add all other positions to the path
    for (var i = 1; i < positions.length; i++) {
      final pos = _transformCoordinates(positions[i].x, positions[i].y);
      path.lineTo(pos.dx, pos.dy);
    }
    
    // Draw the path
    canvas.drawPath(path, paint);
  }

  /// Transforms a simulation coordinate to canvas coordinate
  Offset _transformCoordinates(double x, double y) {
    return Offset(
      CanvasConstants.startX + x * scale,
      CanvasConstants.startY - y * scale,
    );
  }

  @override
  bool shouldRepaint(TrajectoryPainter oldDelegate) {
    return oldDelegate.positions != positions ||
        oldDelegate.color != color ||
        oldDelegate.lineWidth != lineWidth ||
        oldDelegate.scale != scale ||
        oldDelegate.opacity != opacity;
  }
}

/// Custom painter for drawing multiple trajectories from previous steps
class PreviousTrajectoryPainter extends CustomPainter {
  final List<SimulationStep> steps;
  final double scale;

  PreviousTrajectoryPainter({
    required this.steps,
    this.scale = 1.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (steps.isEmpty) return;

    // Draw each step's trajectory with decreasing opacity
    for (var i = 0; i < steps.length; i++) {
      final opacity = _calculateOpacity(i, steps.length);
      final trajectoryPainter = TrajectoryPainter(
        positions: steps[i].positions,
        color: Colors.grey,
        lineWidth: 2.0,
        scale: scale,
        opacity: opacity,
      );
      
      trajectoryPainter.paint(canvas, size);
    }
  }

  /// Calculate opacity based on step index
  double _calculateOpacity(int index, int totalSteps) {
    return 0.05 + (0.3 - index * 0.05).clamp(0.05, 0.3);
  }

  @override
  bool shouldRepaint(PreviousTrajectoryPainter oldDelegate) {
    return oldDelegate.steps != steps || oldDelegate.scale != scale;
  }
}