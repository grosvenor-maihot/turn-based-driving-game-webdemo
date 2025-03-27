import 'package:flutter/foundation.dart';
import '../models/simulation_models.dart';
import '../constants/app_constants.dart';
import 'api_service.dart';

/// Provider for managing the simulation state
class SimulationProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  // State variables
  SimulationMetadata? _metadata;
  List<SimulationStep> _steps = [];
  int _currentStep = 1;
  bool _loading = false;
  String? _error;

  // Getters
  SimulationMetadata? get metadata => _metadata;
  List<SimulationStep> get steps => _steps;
  int get currentStep => _currentStep;
  bool get loading => _loading;
  String? get error => _error;
  
  // Current step getter
  SimulationStep? get currentStepData => 
      _currentStep > 0 && _currentStep <= _steps.length 
          ? _steps[_currentStep - 1] 
          : null;
  
  // All positions for rendering
  List<Position> get allPositions {
    final positions = <Position>[];
    for (var i = 0; i < _currentStep; i++) {
      positions.addAll(_steps[i].positions);
    }
    return positions;
  }

  /// Initialize the simulation
  Future<void> initialize() async {
    try {
      _setLoading(true);
      _setError(null);
      
      // Load metadata
      final metadataData = await _apiService.loadMetadata();
      _metadata = metadataData;

      // Initialize parameters with values from metadata
      final initialParams = Map<String, dynamic>.from(DefaultParams.values);
      initialParams['initial_speed'] = metadataData.paramsRanges['initial_speed']['default'];
      initialParams['steering'] = metadataData.paramsRanges['steering']['default'];
      initialParams['scale'] = metadataData.viewParams['scale']['default'];
      initialParams['road_condition'] = metadataData.paramsRanges['controls']['params']['road_condition']['default'];
      initialParams['vehicle_type'] = metadataData.paramsRanges['controls']['params']['vehicle_type']['default'];
      initialParams['throttle'] = 100;
      initialParams['brake'] = 0;
      initialParams['handbrake'] = 0;

      // Initialize first step
      _steps = [
        SimulationStep(
          params: initialParams,
          positions: [],
        ),
      ];
      
      // Update trajectory for the first step
      await _updateTrajectory();
    } catch (e) {
      _setError('Failed to initialize simulation: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Update the trajectory based on current parameters
  Future<void> _updateTrajectory() async {
    if (_metadata == null || currentStepData == null) return;

    try {
      _setLoading(true);
      _setError(null);
      
      // Get current parameters
      final currentParams = currentStepData!.params;
      
      // Fetch trajectory data
      final trajectoryData = await _apiService.fetchTrajectoryFromAPI(currentParams);
      
      // Convert to positions
      final newPositions = trajectoryData.toPositions();
      
      // Update steps with new positions
      _steps[_currentStep - 1] = SimulationStep(
        params: currentParams,
        positions: newPositions,
      );
      
      notifyListeners();
    } catch (e) {
      _setError('Error fetching trajectory: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Handle parameter changes
  Future<void> updateParameter(String paramName, dynamic value) async {
    if (_currentStep <= 0 || _currentStep > _steps.length) return;
    
    // Create a copy of the current steps
    final newSteps = List<SimulationStep>.from(_steps);
    final currentStepIndex = _currentStep - 1;
    
    // Handle string parameters (road_condition, vehicle_type)
    if (paramName == 'road_condition' || paramName == 'vehicle_type') {
      newSteps[currentStepIndex] = SimulationStep(
        params: {
          ...newSteps[currentStepIndex].params,
          paramName: value,
        },
        positions: newSteps[currentStepIndex].positions,
      );
    }
    // Handle combined controls
    else if (paramName == 'controls') {
      final numValue = value is int ? value : int.tryParse(value.toString()) ?? 0;
      int handbrake = 0;
      int brake = 0;
      int throttle = 0;
      
      // Calculate control values based on slider position
      if (numValue < -100) { // Handbrake zone
        handbrake = 100;
      } else if (numValue < 0) { // Brake zone
        brake = -numValue;
      } else { // Throttle zone
        throttle = numValue;
      }
      
      newSteps[currentStepIndex] = SimulationStep(
        params: {
          ...newSteps[currentStepIndex].params,
          'handbrake': handbrake,
          'brake': brake,
          'throttle': throttle,
        },
        positions: newSteps[currentStepIndex].positions,
      );
    }
    // Handle numeric parameters
    else {
      final numValue = value is num
          ? value
          : num.tryParse(value.toString()) ?? 0;
      
      // Clamp the value if it's a parameter with a defined range
      double clampedValue = numValue.toDouble();
      try {
        if (_metadata != null) {
          final paramRange = _metadata!.getParameterRange(paramName);
          clampedValue = _clampValue(clampedValue, paramRange.min, paramRange.max);
        }
      } catch (e) {
        // Parameter doesn't have a defined range, use as is
      }
          
      newSteps[currentStepIndex] = SimulationStep(
        params: {
          ...newSteps[currentStepIndex].params,
          paramName: clampedValue,
        },
        positions: newSteps[currentStepIndex].positions,
      );
    }
    
    // Update steps
    _steps = newSteps;
    notifyListeners();
    
    // Update trajectory
    await _updateTrajectory();
  }

  /// Move to the next step in the simulation
  Future<void> nextStep() async {
    final currentStepIndex = _currentStep - 1;
    final currentPositions = _steps[currentStepIndex].positions;
    
    // Ensure we have positions to use for the next step
    if (currentPositions.isEmpty) return;
    
    final lastPosition = currentPositions.last;
    
    // Get parameter ranges for clamping
    final initialSpeedRange = _metadata!.getParameterRange('initial_speed');
    
    // Create new step with updated initial conditions
    final newStep = SimulationStep(
      params: {
        ..._steps[currentStepIndex].params,
        'x': lastPosition.x,
        'y': lastPosition.y,
        'yaw': lastPosition.yaw,
        'initial_speed': _clampValue(lastPosition.speed, initialSpeedRange.min, initialSpeedRange.max),
        'slip_angle': lastPosition.slipAngle,
        'yaw_rate': lastPosition.yawRate,
        'steering': 0, // Reset steering for new step
      },
      positions: [],
    );
    
    // Add new step
    _steps.add(newStep);
    _currentStep++;
    notifyListeners();
    
    // Update trajectory for the new step
    await _updateTrajectory();
  }

  /// Move to the previous step in the simulation
  void previousStep() {
    if (_currentStep > 1) {
      _currentStep--;
      _steps = _steps.sublist(0, _steps.length - 1);
      notifyListeners();
    }
  }

  // Helper methods for state updates
  void _setLoading(bool value) {
    _loading = value;
    notifyListeners();
  }

  void _setError(String? value) {
    _error = value;
    notifyListeners();
  }
  
  /// Helper method to clamp a value between min and max
  double _clampValue(double value, double min, double max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
}