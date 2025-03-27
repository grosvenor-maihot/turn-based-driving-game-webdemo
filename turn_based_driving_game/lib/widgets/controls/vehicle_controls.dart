import 'package:flutter/material.dart';
import '../../constants/app_constants.dart';

/// Widget for vehicle type and road condition controls
class VehicleControls extends StatelessWidget {
  final Map<String, dynamic> params;
  final Function(String, dynamic) onParamChange;

  const VehicleControls({
    Key? key,
    required this.params,
    required this.onParamChange,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Vehicle Settings',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          
          // Vehicle type dropdown
          _buildDropdown(
            context: context,
            label: 'Vehicle Type',
            value: params['vehicle_type'],
            items: VehicleTypes.values,
            onChanged: (value) => onParamChange('vehicle_type', value),
          ),
          
          const SizedBox(height: 16),
          
          // Road condition dropdown
          _buildDropdown(
            context: context,
            label: 'Road Condition',
            value: params['road_condition'],
            items: RoadConditions.values,
            onChanged: (value) => onParamChange('road_condition', value),
          ),
        ],
      ),
    );
  }

  /// Build a labeled dropdown
  Widget _buildDropdown({
    required BuildContext context,
    required String label,
    required String value,
    required Map<String, String> items,
    required ValueChanged<String> onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        const SizedBox(height: 4),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade400),
            borderRadius: BorderRadius.circular(4),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: DropdownButton<String>(
            value: value,
            isExpanded: true,
            underline: const SizedBox(),
            items: items.entries.map((entry) {
              return DropdownMenuItem<String>(
                value: entry.key,
                child: Text(entry.value),
              );
            }).toList(),
            onChanged: (newValue) {
              if (newValue != null) {
                onChanged(newValue);
              }
            },
          ),
        ),
      ],
    );
  }
}