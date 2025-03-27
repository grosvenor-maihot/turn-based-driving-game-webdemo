import 'package:flutter/material.dart';

/// Widget for step navigation controls
class StepControls extends StatelessWidget {
  final int currentStep;
  final VoidCallback onPreviousStep;
  final VoidCallback onNextStep;
  final bool disableNext;
  final bool disablePrevious;

  const StepControls({
    Key? key,
    required this.currentStep,
    required this.onPreviousStep,
    required this.onNextStep,
    this.disableNext = false,
    this.disablePrevious = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ElevatedButton.icon(
            onPressed: (disablePrevious || currentStep <= 1)
                ? null
                : onPreviousStep,
            icon: const Icon(Icons.arrow_back),
            label: const Text('Previous Step'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
          const SizedBox(width: 16),
          ElevatedButton.icon(
            onPressed: disableNext ? null : onNextStep,
            icon: const Icon(Icons.arrow_forward),
            label: const Text('Next Step'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }
}