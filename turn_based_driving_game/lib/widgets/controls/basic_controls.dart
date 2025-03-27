import 'package:flutter/material.dart';
import '../../models/simulation_models.dart';

/// Widget for basic simulation controls (steering, initial speed)
class BasicControls extends StatelessWidget {
  final SimulationMetadata metadata;
  final Map<String, dynamic> params;
  final Function(String, dynamic) onParamChange;

  const BasicControls({
    Key? key,
    required this.metadata,
    required this.params,
    required this.onParamChange,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get parameter ranges from metadata
    final steeringRange = metadata.getParameterRange('steering');
    final initialSpeedRange = metadata.getParameterRange('initial_speed');

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Basic Controls',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          
          // Steering slider
          _buildSlider(
            context: context,
            label: steeringRange.label,
            value: _clampValue(params['steering'].toDouble(), steeringRange.min, steeringRange.max),
            min: steeringRange.min,
            max: steeringRange.max,
            divisions: ((steeringRange.max - steeringRange.min) / steeringRange.step).round(),
            onChanged: (value) => onParamChange('steering', value),
          ),
          
          const SizedBox(height: 16),
          
          // Initial speed slider
          _buildSlider(
            context: context,
            label: initialSpeedRange.label,
            value: _clampValue(params['initial_speed'].toDouble(), initialSpeedRange.min, initialSpeedRange.max),
            min: initialSpeedRange.min,
            max: initialSpeedRange.max,
            divisions: ((initialSpeedRange.max - initialSpeedRange.min) / initialSpeedRange.step).round(),
            onChanged: (value) => onParamChange('initial_speed', value),
          ),
        ],
      ),
    );
  }

  /// Build a labeled slider with value display
  Widget _buildSlider({
    required BuildContext context,
    required String label,
    required double value,
    required double min,
    required double max,
    required int divisions,
    required ValueChanged<double> onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label),
            Text(value.toStringAsFixed(1)),
          ],
        ),
        Slider(
          value: value,
          min: min,
          max: max,
          divisions: divisions,
          label: value.toStringAsFixed(1),
          onChanged: onChanged,
        ),
      ],
    );
  }

  /// Helper method to clamp a value between min and max
  double _clampValue(double value, double min, double max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
}