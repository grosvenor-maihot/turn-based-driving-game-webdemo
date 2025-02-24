import { TYPE_SIZES, TYPE_ARRAYS, METADATA_PATH } from './constants';

// Utility functions
function findClosestValue(value, min, max, step) {
    const values = [];
    for (let v = min; v <= max; v += step) {
        values.push(v);
    }
    return values.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
}

function getDataFilePath(params, metadata) {
    let fileName = 'initial_speed{initial_speed}_steering{steering}_controlsALL.dat';

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

function getRecordSize(metadata) {
    return metadata.TRAJECTORY_DIMENSIONS.reduce((sum, dim) => {
        return sum + TYPE_SIZES[dim.type] * metadata.TRAJECTORY_LENGTH;
    }, 0);
}

function calculateOffset(params, metadata) {
    const recordSize = getRecordSize(metadata);
    let offset = 0;

    // Récupérer les paramètres de contrôle
    const controlsParams = metadata.params_ranges.controls.params;

    // Obtenir les nombres de valeurs possibles pour chaque contrôle
    const throttleSteps = Math.floor((controlsParams.throttle.max - controlsParams.throttle.min) / controlsParams.throttle.step) + 1;
    const brakeSteps = Math.floor((controlsParams.brake.max - controlsParams.brake.min) / controlsParams.brake.step) + 1;

    if (params.throttle > 0) {
        // Calculer l'index pour throttle
        const throttleIndex = Math.floor((params.throttle - controlsParams.throttle.min) / controlsParams.throttle.step);
        offset = throttleIndex * recordSize;
    }
    else if (params.brake > 0) {
        // Calculer l'index pour brake
        const brakeIndex = Math.floor((params.brake - controlsParams.brake.min) / controlsParams.brake.step);
        offset = (throttleSteps + brakeIndex) * recordSize;
    }
    else if (params.handbrake > 0) {
        // Calculer l'index pour handbrake
        const handbrakeIndex = Math.floor((params.handbrake - controlsParams.handbrake.min) / controlsParams.handbrake.step);
        offset = (throttleSteps + brakeSteps + handbrakeIndex) * recordSize;
    }

    return offset;
}

export async function loadMetadata() {
    try {
        const response = await fetch(METADATA_PATH);
        if (!response.ok) throw new Error('Failed to load metadata');
        return response.json();
    } catch (error) {
        throw new Error(`Metadata loading error: ${error.message}`);
    }
}

export async function loadTrajectoryData(params, metadata) {
    try {
        const filePath = getDataFilePath(params, metadata);
        const targetOffset = calculateOffset(params, metadata);
        const recordSize = getRecordSize(metadata);

        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load trajectory data from ${filePath}`);

        const buffer = await response.arrayBuffer();
        // Extraction de la portion qui nous intéresse
        const relevantBuffer = buffer.slice(targetOffset, targetOffset + recordSize);

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
        throw new Error(`Trajectory data loading error: ${error.message}`);
    }
}

export async function fetchTrajectoryFromAPI(params) {
    try {
        const response = await fetch(
            `https://www.dvf.ovh/compute_trajectory?params=${JSON.stringify(params)}`
        );

        if (!response.ok) throw new Error('Failed to fetch from API');

        const buffer = await response.arrayBuffer();
        const data = new Float32Array(buffer);
        const trajectoryLength = 100; // Ajustez selon votre configuration

        // Restructurer les données
        return {
            x: Array.from(data.slice(0, trajectoryLength)),
            y: Array.from(data.slice(trajectoryLength, 2 * trajectoryLength)),
            yaw: Array.from(data.slice(2 * trajectoryLength, 3 * trajectoryLength)),
            speed: Array.from(data.slice(3 * trajectoryLength, 4 * trajectoryLength)),
            slip_angle: Array.from(data.slice(4 * trajectoryLength, 5 * trajectoryLength)),
            yaw_rate: Array.from(data.slice(5 * trajectoryLength, 6 * trajectoryLength))
        };
    } catch (error) {
        throw new Error(`API Error: ${error.message}`);
    }
}
