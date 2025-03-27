/// Models for the turn-based driving simulation game

/// Represents a position in the simulation
class Position {
  final double x;
  final double y;
  final double yaw;
  final double speed;
  final double slipAngle;
  final double yawRate;

  Position({
    required this.x,
    required this.y,
    required this.yaw,
    required this.speed,
    required this.slipAngle,
    required this.yawRate,
  });

  factory Position.fromJson(Map<String, dynamic> json) {
    return Position(
      x: json['x'].toDouble(),
      y: json['y'].toDouble(),
      yaw: json['yaw'].toDouble(),
      speed: json['speed'].toDouble(),
      slipAngle: json['slip_angle'].toDouble(),
      yawRate: json['yaw_rate'].toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'x': x,
      'y': y,
      'yaw': yaw,
      'speed': speed,
      'slip_angle': slipAngle,
      'yaw_rate': yawRate,
    };
  }
}

/// Represents a simulation step with parameters and positions
class SimulationStep {
  final Map<String, dynamic> params;
  final List<Position> positions;

  SimulationStep({
    required this.params,
    required this.positions,
  });

  factory SimulationStep.fromJson(Map<String, dynamic> json) {
    return SimulationStep(
      params: json['params'],
      positions: (json['positions'] as List)
          .map((pos) => Position.fromJson(pos))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'params': params,
      'positions': positions.map((pos) => pos.toJson()).toList(),
    };
  }
}

/// Represents trajectory data returned from the API
class TrajectoryData {
  final List<double> x;
  final List<double> y;
  final List<double> yaw;
  final List<double> speed;
  final List<double> slipAngle;
  final List<double> yawRate;

  TrajectoryData({
    required this.x,
    required this.y,
    required this.yaw,
    required this.speed,
    required this.slipAngle,
    required this.yawRate,
  });

  factory TrajectoryData.fromJson(Map<String, dynamic> json) {
    return TrajectoryData(
      x: List<double>.from(json['x']),
      y: List<double>.from(json['y']),
      yaw: List<double>.from(json['yaw']),
      speed: List<double>.from(json['speed']),
      slipAngle: List<double>.from(json['slip_angle']),
      yawRate: List<double>.from(json['yaw_rate']),
    );
  }

  /// Convert trajectory data to a list of positions
  List<Position> toPositions() {
    final positions = <Position>[];
    for (var i = 0; i < x.length; i++) {
      positions.add(
        Position(
          x: x[i],
          y: y[i],
          yaw: yaw[i],
          speed: speed[i],
          slipAngle: slipAngle[i],
          yawRate: yawRate[i],
        ),
      );
    }
    return positions;
  }
}

/// Represents a parameter range in the simulation metadata
class ParameterRange {
  final double min;
  final double max;
  final double step;
  final double defaultValue;
  final String label;

  ParameterRange({
    required this.min,
    required this.max,
    required this.step,
    required this.defaultValue,
    required this.label,
  });

  factory ParameterRange.fromJson(Map<String, dynamic> json) {
    return ParameterRange(
      min: json['min'].toDouble(),
      max: json['max'].toDouble(),
      step: json['step'].toDouble(),
      defaultValue: json['default'].toDouble(),
      label: json['label'],
    );
  }
}

/// Represents the simulation metadata
class SimulationMetadata {
  final int trajectoryLength;
  final List<Map<String, dynamic>> trajectoryDimensions;
  final Map<String, dynamic> paramsRanges;
  final Map<String, dynamic> viewParams;
  final String filePattern;
  final String baseUrl;
  final List<String> fileParams;
  final List<String> offsetParams;

  SimulationMetadata({
    required this.trajectoryLength,
    required this.trajectoryDimensions,
    required this.paramsRanges,
    required this.viewParams,
    required this.filePattern,
    required this.baseUrl,
    required this.fileParams,
    required this.offsetParams,
  });

  factory SimulationMetadata.fromJson(Map<String, dynamic> json) {
    return SimulationMetadata(
      trajectoryLength: json['TRAJECTORY_LENGTH'],
      trajectoryDimensions: List<Map<String, dynamic>>.from(
          json['TRAJECTORY_DIMENSIONS']),
      paramsRanges: json['params_ranges'],
      viewParams: json['view_params'],
      filePattern: json['file_pattern'],
      baseUrl: json['base_url'],
      fileParams: List<String>.from(json['file_params']),
      offsetParams: List<String>.from(json['offset_params']),
    );
  }

  /// Get a parameter range from the metadata
  ParameterRange getParameterRange(String paramName) {
    if (paramsRanges.containsKey(paramName)) {
      return ParameterRange.fromJson(paramsRanges[paramName]);
    } else if (paramsRanges['controls']['params'].containsKey(paramName)) {
      return ParameterRange.fromJson(
          paramsRanges['controls']['params'][paramName]);
    } else if (viewParams.containsKey(paramName)) {
      return ParameterRange.fromJson(viewParams[paramName]);
    }
    throw Exception('Parameter $paramName not found in metadata');
  }
}