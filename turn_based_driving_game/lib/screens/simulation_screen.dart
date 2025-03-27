import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/simulation_provider.dart';
import '../widgets/simulation_canvas.dart';
import '../widgets/control_panel.dart';

/// Main screen for the turn-based driving simulation
class SimulationScreen extends StatefulWidget {
  const SimulationScreen({Key? key}) : super(key: key);

  @override
  State<SimulationScreen> createState() => _SimulationScreenState();
}

class _SimulationScreenState extends State<SimulationScreen> {
  @override
  void initState() {
    super.initState();
    // Initialize the simulation when the screen is first loaded
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SimulationProvider>().initialize();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Turn-Based Driving Simulator'),
        centerTitle: true,
      ),
      body: Consumer<SimulationProvider>(
        builder: (context, provider, child) {
          // Show loading state if metadata or current step is not available
          if (provider.metadata == null || provider.currentStepData == null) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Loading simulation data...'),
                ],
              ),
            );
          }

          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Step indicator
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      'Turn #${provider.currentStep}',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onPrimaryContainer,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Control panel with all user inputs
                  ControlPanel(
                    metadata: provider.metadata!,
                    params: provider.currentStepData!.params,
                    onParamChange: provider.updateParameter,
                    onPreviousStep: provider.previousStep,
                    onNextStep: provider.nextStep,
                    currentStep: provider.currentStep,
                    disableNext: provider.loading || 
                        provider.currentStepData!.positions.isEmpty,
                    disablePrevious: provider.currentStep <= 1 || provider.loading,
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Canvas visualization
                  SimulationCanvas(
                    positions: provider.allPositions,
                    steering: provider.currentStepData!.params['steering'].toDouble(),
                    scale: provider.currentStepData!.params['scale'].toDouble(),
                    previousSteps: provider.steps.sublist(0, provider.currentStep - 1),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Status messages
                  if (provider.loading)
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                          SizedBox(width: 8),
                          Text('Loading trajectory data...'),
                        ],
                      ),
                    ),
                    
                  if (provider.error != null)
                    Container(
                      padding: const EdgeInsets.all(8),
                      margin: const EdgeInsets.only(top: 8),
                      decoration: BoxDecoration(
                        color: Colors.red.shade100,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline, color: Colors.red),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              provider.error!,
                              style: const TextStyle(color: Colors.red),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}