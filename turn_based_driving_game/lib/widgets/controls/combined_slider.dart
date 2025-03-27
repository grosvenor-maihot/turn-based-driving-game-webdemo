import 'package:flutter/material.dart';
import '../../constants/app_constants.dart';

/// Widget for combined vehicle control slider (throttle/brake/handbrake)
class CombinedSlider extends StatefulWidget {
  final int value;
  final Function(String, dynamic) onChange;

  const CombinedSlider({
    Key? key,
    this.value = 0,
    required this.onChange,
  }) : super(key: key);

  @override
  State<CombinedSlider> createState() => _CombinedSliderState();
}

class _CombinedSliderState extends State<CombinedSlider> {
  late double _sliderValue;

  @override
  void initState() {
    super.initState();
    _sliderValue = _clampValue(widget.value.toDouble(),
        CombinedControlRanges.min.toDouble(),
        CombinedControlRanges.max.toDouble());
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Vehicle Controls',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          
          // Labels for the slider
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(CombinedControlLabels.handbrake),
              Text(CombinedControlLabels.brake),
              Text(CombinedControlLabels.neutral),
              Text(CombinedControlLabels.throttle),
            ],
          ),
          
          // Slider with marker
          Stack(
            children: [
              Slider(
                value: _sliderValue,
                min: CombinedControlRanges.min.toDouble(),
                max: CombinedControlRanges.max.toDouble(),
                onChanged: (value) {
                  setState(() {
                    _sliderValue = value;
                  });
                  widget.onChange('controls', value.toInt());
                },
              ),
              
              // Current control state marker
              Positioned(
                top: 0,
                left: _calculateMarkerPosition(),
                child: _buildControlMarker(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Calculate the position of the marker on the slider
  double _calculateMarkerPosition() {
    // This is an approximation - in a real app you'd need to measure the actual slider width
    const sliderWidth = 300.0;
    const sliderStart = 16.0; // Left padding
    
    // Calculate the percentage position on the slider
    final range = CombinedControlRanges.max - CombinedControlRanges.min;
    final percentage = (_sliderValue - CombinedControlRanges.min) / range;
    
    // Convert to pixels
    return sliderStart + percentage * sliderWidth;
  }

  /// Build the control state marker
  Widget _buildControlMarker() {
    String label;
    Color color;
    
    // Determine the current control state
    if (_sliderValue < ControlThresholds.handbrake) {
      label = CombinedControlLabels.handbrake;
      color = Colors.red;
    } else if (_sliderValue < ControlThresholds.brake) {
      label = CombinedControlLabels.brake;
      color = Colors.orange;
    } else if (_sliderValue == ControlThresholds.throttle) {
      label = CombinedControlLabels.neutral;
      color = Colors.grey;
    } else {
      label = CombinedControlLabels.throttle;
      color = Colors.green;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
        ),
      ),
    );
  }
  
  /// Helper method to clamp a value between min and max
  double _clampValue(double value, double min, double max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
}