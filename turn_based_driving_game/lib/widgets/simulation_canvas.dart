import 'package:flutter/material.dart';
import '../models/simulation_models.dart';
import '../constants/app_constants.dart';
import 'painters/car_painter.dart';
import 'painters/tire_track_painter.dart';
import 'painters/trajectory_painter.dart';

/// Widget for rendering the simulation canvas
class SimulationCanvas extends StatelessWidget {
  final List<Position> positions;
  final double steering;
  final double scale;
  final List<SimulationStep> previousSteps;

  const SimulationCanvas({
    Key? key,
    required this.positions,
    required this.steering,
    required this.scale,
    required this.previousSteps,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: CanvasConstants.width,
      height: CanvasConstants.height,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        border: Border.all(color: Colors.grey.shade400),
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: CustomPaint(
          size: Size(CanvasConstants.width, CanvasConstants.height),
          painter: SimulationCanvasPainter(
            positions: positions,
            steering: steering,
            scale: scale,
            previousSteps: previousSteps,
          ),
        ),
      ),
    );
  }
}

/// Custom painter that combines all simulation painters
class SimulationCanvasPainter extends CustomPainter {
  final List<Position> positions;
  final double steering;
  final double scale;
  final List<SimulationStep> previousSteps;

  SimulationCanvasPainter({
    required this.positions,
    required this.steering,
    required this.scale,
    required this.previousSteps,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Clear canvas
    canvas.drawRect(
      Rect.fromLTWH(0, 0, size.width, size.height),
      Paint()..color = Colors.grey.shade200,
    );

    // Draw previous trajectories
    if (previousSteps.isNotEmpty) {
      final previousTrajectoryPainter = PreviousTrajectoryPainter(
        steps: previousSteps,
        scale: scale,
      );
      previousTrajectoryPainter.paint(canvas, size);
    }

    // Draw current trajectory
    if (positions.isNotEmpty) {
      final trajectoryPainter = TrajectoryPainter(
        positions: positions,
        scale: scale,
      );
      trajectoryPainter.paint(canvas, size);

      // Draw tire tracks for all positions
      for (final position in positions) {
        _drawTireTracks(canvas, position);
      }

      // Draw car at the last position
      final lastPos = positions.last;
      final transformedPos = _transformCoordinates(lastPos.x, lastPos.y);
      
      final carPainter = CarPainter(
        x: transformedPos.dx,
        y: transformedPos.dy,
        yaw: lastPos.yaw,
        steering: steering,
        scale: scale,
      );
      
      carPainter.paint(canvas, size);
    }
  }

  /// Draw tire tracks for a vehicle at the specified position
  void _drawTireTracks(Canvas canvas, Position position) {
    final transformedPos = _transformCoordinates(position.x, position.y);
    final carLength = CarConstants.length * scale / 10;
    final carWidth = CarConstants.width * scale / 10;
    
    // Draw tracks for all four wheels
    final frontLeftTrack = TireTrackPainter(
      x: transformedPos.dx,
      y: transformedPos.dy,
      yaw: position.yaw,
      offsetX: carLength * 0.5,
      offsetY: carWidth * 0.5,
      scale: scale,
    );
    frontLeftTrack.paint(canvas, Size.zero);
    
    final frontRightTrack = TireTrackPainter(
      x: transformedPos.dx,
      y: transformedPos.dy,
      yaw: position.yaw,
      offsetX: carLength * 0.5,
      offsetY: -carWidth * 0.5,
      scale: scale,
    );
    frontRightTrack.paint(canvas, Size.zero);
    
    final rearLeftTrack = TireTrackPainter(
      x: transformedPos.dx,
      y: transformedPos.dy,
      yaw: position.yaw,
      offsetX: -carLength * 0.5,
      offsetY: carWidth * 0.5,
      scale: scale,
    );
    rearLeftTrack.paint(canvas, Size.zero);
    
    final rearRightTrack = TireTrackPainter(
      x: transformedPos.dx,
      y: transformedPos.dy,
      yaw: position.yaw,
      offsetX: -carLength * 0.5,
      offsetY: -carWidth * 0.5,
      scale: scale,
    );
    rearRightTrack.paint(canvas, Size.zero);
  }

  /// Transforms a simulation coordinate to canvas coordinate
  Offset _transformCoordinates(double x, double y) {
    return Offset(
      CanvasConstants.startX + x * scale,
      CanvasConstants.startY - y * scale,
    );
  }

  @override
  bool shouldRepaint(SimulationCanvasPainter oldDelegate) {
    return oldDelegate.positions != positions ||
        oldDelegate.steering != steering ||
        oldDelegate.scale != scale ||
        oldDelegate.previousSteps != previousSteps;
  }
}