import { TYPE_SIZES, TYPE_ARRAYS, METADATA_PATH, API_CONFIG, ERROR_MESSAGES } from './constants';

/**
 * Find the closest valid value in a range
 *
 * @param {number} value - The value to find the closest match for
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {number} step - Step size between values
 * @returns {number} - The closest valid value
 */
function findClosestValue(value, min, max, step) {
    // Generate all possible values in the range
    const values = [];
    for (let v = min; v <= max; v += step) {
        values.push(v);
    }
    
    // Find the closest value
    return values.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
}

/**
 * Generate the data file path based on parameters
 *
 * @param {Object} params - Simulation parameters
 * @param {Object} metadata - Simulation metadata
 * @returns {string} - The data file path
 */
function getDataFilePath(params, metadata) {
    let fileName = 'initial_speed{initial_speed}_steering{steering}_controlsALL.dat';

    // Replace placeholders with actual values
    ['initial_speed', 'steering'].forEach(param => {
        const paramConfig = metadata.params_ranges[param];
        const closest = findClosestValue(
            params[param],
            paramConfig.min,
            paramConfig.max,
            paramConfig.step
        );
        fileName = fileName.replace(`{${param}}`, String(closest).padStart(3, '0'));
    });

    return `${metadata.base_url}${fileName}`;
}

/**
 * Calculate the record size in bytes
 *
 * @param {Object} metadata - Simulation metadata
 * @returns {number} - The record size in bytes
 */
function getRecordSize(metadata) {
    return metadata.TRAJECTORY_DIMENSIONS.reduce((sum, dim) => {
        return sum + TYPE_SIZES[dim.type] * metadata.TRAJECTORY_LENGTH;
    }, 0);
}

/**
 * Calculate the offset in the data file based on control parameters
 *
 * @param {Object} params - Simulation parameters
 * @param {Object} metadata - Simulation metadata
 * @returns {number} - The offset in bytes
 */
function calculateOffset(params, metadata) {
    const recordSize = getRecordSize(metadata);
    let offset = 0;

    // Get control parameters
    const controlsParams = metadata.params_ranges.controls.params;

    // Calculate the number of possible values for each control
    const throttleSteps = Math.floor(
        (controlsParams.throttle.max - controlsParams.throttle.min) /
        controlsParams.throttle.step
    ) + 1;
    
    const brakeSteps = Math.floor(
        (controlsParams.brake.max - controlsParams.brake.min) /
        controlsParams.brake.step
    ) + 1;

    // Calculate offset based on active control
    if (params.throttle > 0) {
        // Calculate index for throttle
        const throttleIndex = Math.floor(
            (params.throttle - controlsParams.throttle.min) /
            controlsParams.throttle.step
        );
        offset = throttleIndex * recordSize;
    }
    else if (params.brake > 0) {
        // Calculate index for brake
        const brakeIndex = Math.floor(
            (params.brake - controlsParams.brake.min) /
            controlsParams.brake.step
        );
        offset = (throttleSteps + brakeIndex) * recordSize;
    }
    else if (params.handbrake > 0) {
        // Calculate index for handbrake
        const handbrakeIndex = Math.floor(
            (params.handbrake - controlsParams.handbrake.min) /
            controlsParams.handbrake.step
        );
        offset = (throttleSteps + brakeSteps + handbrakeIndex) * recordSize;
    }

    return offset;
}

/**
 * Load simulation metadata
 *
 * @returns {Promise<Object>} - The simulation metadata
 * @throws {Error} - If metadata loading fails
 */
export async function loadMetadata() {
    try {
        const response = await fetch(METADATA_PATH);
        
        if (!response.ok) {
            throw new Error(ERROR_MESSAGES.METADATA_LOAD);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Metadata loading error:', error);
        throw new Error(`${ERROR_MESSAGES.METADATA_LOAD}: ${error.message}`);
    }
}

/**
 * Load trajectory data from a data file
 *
 * @param {Object} params - Simulation parameters
 * @param {Object} metadata - Simulation metadata
 * @returns {Promise<Object>} - The trajectory data
 * @throws {Error} - If trajectory data loading fails
 */
export async function loadTrajectoryData(params, metadata) {
    try {
        const filePath = getDataFilePath(params, metadata);
        const targetOffset = calculateOffset(params, metadata);
        const recordSize = getRecordSize(metadata);

        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`${ERROR_MESSAGES.TRAJECTORY_LOAD} (${filePath})`);
        }

        const buffer = await response.arrayBuffer();
        
        // Extract the relevant portion of the buffer
        const relevantBuffer = buffer.slice(targetOffset, targetOffset + recordSize);

        // Parse the buffer into trajectory dimensions
        const result = {};
        let currentOffset = 0;

        metadata.TRAJECTORY_DIMENSIONS.forEach(dimension => {
            const TypedArray = TYPE_ARRAYS[dimension.type];
            const size = TYPE_SIZES[dimension.type] * metadata.TRAJECTORY_LENGTH;
            const dimensionBuffer = relevantBuffer.slice(currentOffset, currentOffset + size);
            result[dimension.name] = Array.from(new TypedArray(dimensionBuffer));
            currentOffset += size;
        });

        return result;
    } catch (error) {
        console.error('Trajectory data loading error:', error);
        throw new Error(`${ERROR_MESSAGES.TRAJECTORY_LOAD}: ${error.message}`);
    }
}

/**
 * Fetch trajectory data from the API
 *
 * @param {Object} params - Simulation parameters
 * @returns {Promise<Object>} - The trajectory data
 * @throws {Error} - If API request fails
 */
export async function fetchTrajectoryFromAPI(params) {
    try {
        // Create a copy of params to avoid modifying the original
        const apiParams = { ...params };
        
        // Validate required parameters
        const requiredParams = ['x', 'y', 'yaw', 'initial_speed', 'steering', 'road_condition', 'vehicle_type'];
        for (const param of requiredParams) {
            if (apiParams[param] === undefined) {
                throw new Error(`Missing required parameter: ${param}`);
            }
        }
        
        // Make the API request
        const response = await fetch(
            `${API_CONFIG.baseUrl}/compute_trajectory?params=${encodeURIComponent(JSON.stringify(apiParams))}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${ERROR_MESSAGES.API_FETCH} (${response.status}): ${errorText}`);
        }

        // Parse the response
        const buffer = await response.arrayBuffer();
        const data = new Float32Array(buffer);
        const trajectoryLength = API_CONFIG.trajectoryLength;

        // Validate the response data
        if (data.length < trajectoryLength * 6) {
            throw new Error(`Invalid trajectory data: expected at least ${trajectoryLength * 6} values, got ${data.length}`);
        }

        // Restructure the data
        return {
            x: Array.from(data.slice(0, trajectoryLength)),
            y: Array.from(data.slice(trajectoryLength, 2 * trajectoryLength)),
            yaw: Array.from(data.slice(2 * trajectoryLength, 3 * trajectoryLength)),
            speed: Array.from(data.slice(3 * trajectoryLength, 4 * trajectoryLength)),
            slip_angle: Array.from(data.slice(4 * trajectoryLength, 5 * trajectoryLength)),
            yaw_rate: Array.from(data.slice(5 * trajectoryLength, 6 * trajectoryLength))
        };
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(`${ERROR_MESSAGES.API_FETCH}: ${error.message}`);
    }
}
