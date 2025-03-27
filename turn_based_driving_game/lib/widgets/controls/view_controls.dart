import 'package:flutter/material.dart';
import '../../models/simulation_models.dart';

/// Widget for view controls (scale)
class ViewControls extends StatelessWidget {
  final SimulationMetadata metadata;
  final Map<String, dynamic> params;
  final Function(String, dynamic) onParamChange;

  const ViewControls({
    Key? key,
    required this.metadata,
    required this.params,
    required this.onParamChange,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get scale parameter range from metadata
    final scaleRange = metadata.getParameterRange('scale');

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'View Controls',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          
          // Scale slider
          _buildSlider(
            context: context,
            label: scaleRange.label,
            value: _clampValue(params['scale'].toDouble(), scaleRange.min, scaleRange.max),
            min: scaleRange.min,
            max: scaleRange.max,
            divisions: ((scaleRange.max - scaleRange.min) / scaleRange.step).round(),
            onChanged: (value) => onParamChange('scale', value),
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