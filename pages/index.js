import { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import ControlPanel from '../components/ControlPanel';
import Canvas from '../components/Canvas/Canvas';
import { loadMetadata, fetchTrajectoryFromAPI } from '../utils/dataFetching';
import { Container, Header, Status, ToggleSwitch, StepIndicator, Message } from '../styles/MainStyles';
import { ERROR_MESSAGES } from '../utils/constants';

/**
 * Default initial parameters for the simulation
 */
const DEFAULT_PARAMS = {
    x: 0,
    y: 0,
    yaw: 0.0,
    initial_speed: 10,
    steering: 20,
    road_condition: 'dirt',
    vehicle_type: 'four_wheel_drive',
    throttle: 50,
    brake: 0,
    handbrake: 0,
    scale: 3
};

/**
 * Home page component for the turn-based driving simulator
 */
export default function Home() {
    // Step management
    const [currentStep, setCurrentStep] = useState(1);
    const [steps, setSteps] = useState([{
        params: { ...DEFAULT_PARAMS },
        positions: []
    }]);
    
    // Application state
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeControl, setActiveControl] = useState(null);

    /**
     * Load metadata on component mount
     */
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                setLoading(true);
                setError(null);
                const metadataData = await loadMetadata();
                setMetadata(metadataData);

                // Initialize parameters with values from metadata
                const initialParams = {
                    ...DEFAULT_PARAMS,
                    initial_speed: metadataData.params_ranges.initial_speed.default,
                    steering: metadataData.params_ranges.steering.default,
                    scale: metadataData.view_params.scale.default,
                    road_condition: metadataData.params_ranges.controls.params.road_condition.default,
                    vehicle_type: metadataData.params_ranges.controls.params.vehicle_type.default,
                    throttle: 100,
                    brake: 0,
                    handbrake: 0
                };

                // Initialize first control as active
                const firstControl = Object.keys(metadataData.params_ranges.controls.params)
                    .find(param => param !== 'road_condition' && param !== 'vehicle_type');
                setActiveControl(firstControl);
                initialParams[firstControl] = metadataData.params_ranges.controls.params[firstControl].default;

                setSteps([{
                    params: initialParams,
                    positions: []
                }]);
            } catch (err) {
                console.error('Error loading metadata:', err);
                setError(ERROR_MESSAGES.METADATA_LOAD);
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, []);

    /**
     * Fetch trajectory data when parameters change
     */
    useEffect(() => {
        if (!metadata || !steps[currentStep - 1]) return;

        const updateTrajectory = async () => {
            setLoading(true);
            setError(null);
            try {
                const currentParams = steps[currentStep - 1].params;
                const trajectoryData = await fetchTrajectoryFromAPI(currentParams);
                
                // Map trajectory data to position objects
                const newPositions = trajectoryData.x.map((_, i) => ({
                    x: trajectoryData.x[i],
                    y: trajectoryData.y[i],
                    yaw: trajectoryData.yaw[i],
                    speed: trajectoryData.speed[i],
                    slip_angle: trajectoryData.slip_angle[i],
                    yaw_rate: trajectoryData.yaw_rate[i]
                }));

                // Update steps with new positions
                setSteps(prevSteps => {
                    const newSteps = [...prevSteps];
                    newSteps[currentStep - 1] = {
                        ...newSteps[currentStep - 1],
                        positions: newPositions
                    };
                    return newSteps;
                });
            } catch (err) {
                console.error('Error fetching trajectory:', err);
                setError(ERROR_MESSAGES.TRAJECTORY_LOAD);
            } finally {
                setLoading(false);
            }
        };

        updateTrajectory();
    }, [metadata, currentStep, steps[currentStep - 1]?.params]);

    /**
     * Handle parameter changes from controls
     * @param {string} paramName - Name of the parameter to change
     * @param {string|number} value - New value for the parameter
     */
    const handleParamChange = useCallback((paramName, value) => {
        setSteps(prevSteps => {
            const newSteps = [...prevSteps];
            const currentStepIndex = currentStep - 1;
            
            // Handle string parameters (road_condition, vehicle_type)
            if (paramName === 'road_condition' || paramName === 'vehicle_type') {
                return newSteps.map((step, index) =>
                    index === currentStepIndex
                        ? {
                            ...step,
                            params: {
                                ...step.params,
                                [paramName]: value
                            }
                          }
                        : step
                );
            }
            
            // Handle combined controls
            if (paramName === 'controls') {
                const numValue = Number(value);
                let handbrake = 0;
                let brake = 0;
                let throttle = 0;

                // Calculate control values based on slider position
                if (numValue < -100) { // Handbrake zone
                    handbrake = 100;
                } else if (numValue < 0) { // Brake zone
                    brake = -numValue;
                } else { // Throttle zone
                    throttle = numValue;
                }

                return newSteps.map((step, index) =>
                    index === currentStepIndex
                        ? {
                            ...step,
                            params: {
                                ...step.params,
                                handbrake,
                                brake,
                                throttle
                            }
                          }
                        : step
                );
            }
            
            // Handle numeric parameters
            const numValue = Number(value);
            return newSteps.map((step, index) =>
                index === currentStepIndex
                    ? {
                        ...step,
                        params: {
                            ...step.params,
                            [paramName]: numValue
                        }
                      }
                    : step
            );
        });
    }, [currentStep]);

    /**
     * Move to the next step in the simulation
     */
    const handleNextStep = useCallback(() => {
        setSteps(prevSteps => {
            const currentStepIndex = currentStep - 1;
            const currentPositions = prevSteps[currentStepIndex].positions;
            
            // Ensure we have positions to use for the next step
            if (!currentPositions || currentPositions.length === 0) {
                return prevSteps;
            }
            
            const lastPosition = currentPositions[currentPositions.length - 1];
            
            // Create new step with updated initial conditions
            return [
                ...prevSteps,
                {
                    params: {
                        ...prevSteps[currentStepIndex].params,
                        x: lastPosition.x,
                        y: lastPosition.y,
                        yaw: lastPosition.yaw,
                        initial_speed: lastPosition.speed,
                        slip_angle: lastPosition.slip_angle,
                        yaw_rate: lastPosition.yaw_rate,
                        steering: 0 // Reset steering for new step
                    },
                    positions: []
                }
            ];
        });
        setCurrentStep(prev => prev + 1);
    }, [currentStep]);

    /**
     * Move to the previous step in the simulation
     */
    const handlePreviousStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setSteps(prevSteps => prevSteps.slice(0, prevSteps.length - 1));
        }
    }, [currentStep]);

    // Compute all positions for rendering
    const allPositions = useMemo(() =>
        steps.slice(0, currentStep).flatMap(step => step.positions),
        [steps, currentStep]
    );
    
    // Show loading state if metadata or current step is not available
    if (!metadata || !steps[currentStep - 1]) {
        return (
            <Container>
                <Header>Turned Based Driving Simulator</Header>
                <Status>Loading simulation data...</Status>
            </Container>
        );
    }

    return (
        <Container>
            <Header>Turn-Based Driving Simulator</Header>
            <StepIndicator>Turn #{currentStep}</StepIndicator>

            {/* Control panel with all user inputs */}
            <ControlPanel
                metadata={metadata}
                params={steps[currentStep - 1].params}
                onParamChange={handleParamChange}
                onPreviousStep={handlePreviousStep}
                onNextStep={handleNextStep}
                currentStep={currentStep}
                disableNext={loading || steps[currentStep - 1].positions.length === 0}
                disablePrevious={currentStep <= 1 || loading}
            />

            {/* Canvas visualization */}
            <Canvas
                positions={allPositions}
                steering={steps[currentStep - 1].params.steering}
                scale={steps[currentStep - 1].params.scale}
                previousSteps={steps.slice(0, currentStep - 1)}
            />

            {/* Status messages */}
            {loading && (
                <Status>
                    <span role="status" aria-live="polite">Loading trajectory data...</span>
                </Status>
            )}
            
            {error && (
                <Message error aria-live="assertive">
                    <strong>Error:</strong> {error}
                </Message>
            )}
        </Container>
    );
}
