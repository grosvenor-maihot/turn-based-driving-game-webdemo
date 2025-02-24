Here's the documentation for the REST API at dvf.ovh/compute_trajectory:

# Trajectory Computation API Documentation

## Overview
This API provides vehicle trajectory computation based on various input parameters. It returns predicted vehicle states over time, including position, orientation, and dynamics.

## Endpoint
```
GET https://dvf.ovh/compute_trajectory
```

## Request Parameters
The API accepts a single query parameter `params` which should be a JSON-encoded object containing:

### Required Parameters
- `initial_speed` (number): Initial vehicle speed in m/s
- `steering` (number): Steering angle in radians
- One of the following control inputs must be provided:
  - `throttle` (number): Throttle input [0 to 1]
  - `brake` (number): Brake input [0 to 1]
  - `handbrake` (number): Handbrake input [0 to 1]

### Example Request
```javascript
const params = {
    initial_speed: 10,
    steering: 0.5,
    throttle: 0.8
};

fetch(`https://dvf.ovh/compute_trajectory?params=${JSON.stringify(params)}`);
```

## Response Format
The API returns a binary buffer containing Float32 arrays for different trajectory dimensions. The data is structured as follows:

### Response Structure
The response contains 6 arrays of 100 elements each, arranged sequentially:
1. `x`: X-coordinates (meters)
2. `y`: Y-coordinates (meters)
3. `yaw`: Vehicle heading angle (radians)
4. `speed`: Vehicle speed (m/s)
5. `slip_angle`: Vehicle slip angle (radians)
6. `yaw_rate`: Vehicle yaw rate (radians/s)

### Data Processing
To process the response:
```javascript
const buffer = await response.arrayBuffer();
const data = new Float32Array(buffer);

const result = {
    x: Array.from(data.slice(0, 100)),
    y: Array.from(data.slice(100, 200)),
    yaw: Array.from(data.slice(200, 300)),
    speed: Array.from(data.slice(300, 400)),
    slip_angle: Array.from(data.slice(400, 500)),
    yaw_rate: Array.from(data.slice(500, 600))
};
```

## Error Handling
The API returns standard HTTP status codes:
- 200: Successful computation
- 400: Invalid parameters
- 500: Server error

## Limitations
- Only one control input (throttle, brake, or handbrake) should be non-zero
- Trajectory length is fixed at 100 points
- All parameters must be within their valid ranges

## Example Usage
```javascript
async function getTrajectory(initialSpeed, steering, throttle) {
    const params = {
        initial_speed: initialSpeed,
        steering: steering,
        throttle: throttle
    };
    
    try {
        const response = await fetch(
            `https://dvf.ovh/compute_trajectory?params=${JSON.stringify(params)}`
        );
        if (!response.ok) throw new Error('API request failed');
        
        return await processResponse(response);
    } catch (error) {
        console.error('Failed to fetch trajectory:', error);
        throw error;
    }
}
```

This documentation should provide all necessary information to successfully interact with the trajectory computation API.
