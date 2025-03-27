/// Constants for the turn-based driving game

// API configuration
class ApiConfig {
  static const String baseUrl = 'https://www.dvf.ovh';
  static const int trajectoryLength = 100;
}

// Path to metadata file
class AssetPaths {
  static const String metadataPath = 'assets/metadata/simulation_metadata.json';
}

// Canvas dimensions
class CanvasConstants {
  static const double width = 900.0;
  static const double height = 600.0;
  static const double startX = width / 2;
  static const double startY = height / 2;
}

// Car dimensions
class CarConstants {
  static const double width = 60.0;
  static const double length = 140.0;
  static const double maxSteeringAngle = 0.8; // in radians
}

// Road conditions
class RoadConditions {
  static const Map<String, String> values = {
    'dirt': 'Dirt',
    'snow': 'Snow',
    'asphalt': 'Asphalt',
    'wet_asphalt': 'Wet asphalt',
  };
}

// Vehicle types
class VehicleTypes {
  static const Map<String, String> values = {
    'front_wheel_drive': 'FWD',
    'four_wheel_drive': '4WD',
    'front_engine_rear_drive': 'RWD',
  };
}

// Combined control ranges
class CombinedControlRanges {
  static const int min = -200;
  static const int max = 100;
  static const int neutral = 0;
}

// Control states
class ControlStates {
  static const String handbrake = 'handbrake';
  static const String brake = 'brake';
  static const String neutral = 'neutral';
  static const String throttle = 'throttle';
}

// Control thresholds
class ControlThresholds {
  static const int handbrake = -100;
  static const int brake = 0;
  static const int throttle = 0;
}

// Combined control labels
class CombinedControlLabels {
  static const String handbrake = 'Handbrake';
  static const String brake = 'Brake';
  static const String neutral = 'Neutral';
  static const String throttle = 'Throttle';
}

// View configuration
class ViewConfig {
  static const double defaultScale = 1.0;
  static const double minScale = 0.5;
  static const double maxScale = 2.0;
  static const double scaleStep = 0.1;
}

// Render configuration
class RenderConfig {
  static const int fps = 60;
  static const double updateInterval = 1000 / 60;
}

// Error messages
class ErrorMessages {
  static const String metadataLoad = 'Failed to load metadata';
  static const String trajectoryLoad = 'Unable to load trajectory';
  static const String apiFetch = 'Failed to fetch from API';
}

// Default parameters
class DefaultParams {
  static const Map<String, dynamic> values = {
    'x': 0,
    'y': 0,
    'yaw': 0.0,
    'initial_speed': 10,
    'steering': 20,
    'road_condition': 'dirt',
    'vehicle_type': 'four_wheel_drive',
    'throttle': 50,
    'brake': 0,
    'handbrake': 0,
    'scale': 3,
  };
}