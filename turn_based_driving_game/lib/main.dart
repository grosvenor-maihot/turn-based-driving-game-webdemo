import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/simulation_provider.dart';
import 'screens/simulation_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => SimulationProvider(),
      child: MaterialApp(
        title: 'Turn-Based Driving Simulator',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
          sliderTheme: SliderThemeData(
            activeTrackColor: Colors.blue,
            thumbColor: Colors.blue,
            overlayColor: Colors.blue.withOpacity(0.2),
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
            ),
          ),
        ),
        home: const SimulationScreen(),
      ),
    );
  }
}
