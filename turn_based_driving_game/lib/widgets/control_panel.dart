import 'package:flutter/material.dart';
import '../models/simulation_models.dart';
import 'controls/step_controls.dart';
import 'controls/basic_controls.dart';
import 'controls/vehicle_controls.dart';
import 'controls/combined_slider.dart';
import 'controls/view_controls.dart';

/// Widget that contains all user input controls
class ControlPanel extends StatelessWidget {
  final SimulationMetadata metadata;
  final Map<String, dynamic> params;
  final Function(String, dynamic) onParamChange;
  final int currentStep;
  final VoidCallback onPreviousStep;
  final VoidCallback onNextStep;
  final bool disableNext;
  final bool disablePrevious;

  const ControlPanel({
    Key? key,
    required this.metadata,
    required this.params,
    required this.onParamChange,
    required this.currentStep,
    required this.onPreviousStep,
    required this.onNextStep,
    this.disableNext = false,
    this.disablePrevious = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.all(8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Step controls
            StepControls(
              currentStep: currentStep,
              onPreviousStep: onPreviousStep,
              onNextStep: onNextStep,
              disableNext: disableNext,
              disablePrevious: disablePrevious,
            ),
            
            const Divider(),
            
            // Basic controls
            BasicControls(
              metadata: metadata,
              params: params,
              onParamChange: onParamChange,
            ),
            
            const Divider(),
            
            // Vehicle controls
            VehicleControls(
              params: params,
              onParamChange: onParamChange,
            ),
            
            const Divider(),
            
            // Combined slider
            CombinedSlider(
              value: 0, // Default to 0 since we calculate throttle/brake/handbrake separately
              onChange: onParamChange,
            ),
            
            const Divider(),
            
            // View controls
            ViewControls(
              metadata: metadata,
              params: params,
              onParamChange: onParamChange,
            ),
          ],
        ),
      ),
    );
  }
}