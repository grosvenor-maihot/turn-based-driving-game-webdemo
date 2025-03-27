import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:flutter/services.dart' show rootBundle;

import '../constants/app_constants.dart';
import '../models/simulation_models.dart';

/// Service for handling API requests and data loading
class ApiService {
  /// Load simulation metadata from assets
  Future<SimulationMetadata> loadMetadata() async {
    try {
      final String jsonString =
          await rootBundle.loadString(AssetPaths.metadataPath);
      final Map<String, dynamic> jsonData = json.decode(jsonString);
      return SimulationMetadata.fromJson(jsonData);
    } catch (e) {
      throw Exception('${ErrorMessages.metadataLoad}: $e');
    }
  }

  /// Fetch trajectory data from the API
  Future<TrajectoryData> fetchTrajectoryFromAPI(
      Map<String, dynamic> params) async {
    try {
      // Validate required parameters
      final requiredParams = [
        'x',
        'y',
        'yaw',
        'initial_speed',
        'steering',
        'road_condition',
        'vehicle_type'
      ];
      
      for (final param in requiredParams) {
        if (!params.containsKey(param)) {
          throw Exception('Missing required parameter: $param');
        }
      }

      // Make the API request
      final response = await http.get(
        Uri.parse(
            '${ApiConfig.baseUrl}/compute_trajectory?params=${Uri.encodeComponent(json.encode(params))}'),
      );

      if (response.statusCode != 200) {
        throw Exception(
            '${ErrorMessages.apiFetch} (${response.statusCode}): ${response.body}');
      }

      // Parse the response
      final buffer = response.bodyBytes;
      final data = Float32List.fromList(
          List.generate(buffer.length ~/ 4, (i) => _getFloat32(buffer, i * 4)));
      
      final trajectoryLength = ApiConfig.trajectoryLength;

      // Validate the response data
      if (data.length < trajectoryLength * 6) {
        throw Exception(
            'Invalid trajectory data: expected at least ${trajectoryLength * 6} values, got ${data.length}');
      }

      // Restructure the data
      return TrajectoryData(
        x: data.sublist(0, trajectoryLength).toList(),
        y: data.sublist(trajectoryLength, 2 * trajectoryLength).toList(),
        yaw: data.sublist(2 * trajectoryLength, 3 * trajectoryLength).toList(),
        speed: data.sublist(3 * trajectoryLength, 4 * trajectoryLength).toList(),
        slipAngle: data.sublist(4 * trajectoryLength, 5 * trajectoryLength).toList(),
        yawRate: data.sublist(5 * trajectoryLength, 6 * trajectoryLength).toList(),
      );
    } catch (e) {
      throw Exception('${ErrorMessages.apiFetch}: $e');
    }
  }

  /// Helper method to extract a float32 from a byte buffer
  double _getFloat32(Uint8List bytes, int offset) {
    final buffer = bytes.buffer;
    final byteData = ByteData.view(buffer, offset, 4);
    return byteData.getFloat32(0);
  }

  /// Find the closest valid value in a range
  double findClosestValue(double value, double min, double max, double step) {
    // Generate all possible values in the range
    final values = <double>[];
    for (double v = min; v <= max; v += step) {
      values.add(v);
    }

    // Find the closest value
    return values.reduce((prev, curr) =>
        (curr - value).abs() < (prev - value).abs() ? curr : prev);
  }
}