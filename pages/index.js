import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ControlPanel from '../components/ControlPanel';

import Canvas from '../components/Canvas/Canvas';
import { loadMetadata, fetchTrajectoryFromAPI } from '../utils/dataFetching';
import { Container, Header, Status, ToggleSwitch, StepIndicator } from '../styles/MainStyles';

export default function Home() {
    const [currentStep, setCurrentStep] = useState(1);
    const [steps, setSteps] = useState([{
        params: {
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
        },
        positions: []
    }]);
    const [metadata, setMetadata] = useState(null);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [activeControl, setActiveControl] = useState(null);
    const [combinedControl, setCombinedControl] = useState(0); // -200 à 100 par exemple



    useEffect(() => {
        loadMetadata()
            .then(metadata => {
                setMetadata(metadata);

                // Initialize parameters
                const initialParams = {
                    x: 0,
                    y: 0,
                    yaw: 0.0,
                    initial_speed: metadata.params_ranges.initial_speed.default,
                    steering: metadata.params_ranges.steering.default,
                    scale: metadata.view_params.scale.default,
                    road_condition: metadata.params_ranges.controls.params.road_condition.default,
                    vehicle_type: metadata.params_ranges.controls.params.vehicle_type.default,
                    throttle: 100,
                    brake: 0,
                    handbrake: 0
                };

                // Initialize first control as active
                const firstControl = Object.keys(metadata.params_ranges.controls.params)
                    .find(param => param !== 'road_condition' && param !== 'vehicle_type');
                setActiveControl(firstControl);
                initialParams[firstControl] = metadata.params_ranges.controls.params[firstControl].default;

                setSteps([{
                    params: initialParams,
                    positions: []
                }]);
            })
            .catch(err => {
                console.error('Error loading metadata:', err);
                setError('Failed to load metadata');
            });
    }, []);

    useEffect(() => {
        if (!metadata || Object.keys(steps).length === 0) return;

        const updateTrajectory = async () => {
            setLoading(true);
            setError(null);
            try {
                const trajectoryData = await fetchTrajectoryFromAPI(steps[currentStep - 1].params);
                const newPositions = trajectoryData.x.map((x, i) => ({
                    x: trajectoryData.x[i],
                    y: trajectoryData.y[i],
                    yaw: trajectoryData.yaw[i],
                    speed: trajectoryData.speed[i],
                    slip_angle: trajectoryData.slip_angle[i],
                    yaw_rate: trajectoryData.yaw_rate[i]
                }));

                setSteps(prevSteps => {
                    const newSteps = [...prevSteps];
                    newSteps[currentStep - 1] = {
                        ...newSteps[currentStep - 1],
                        positions: newPositions
                    };
                    return newSteps;
                });
            } catch (err) {
                console.error('Erreur:', err);
                setError('Impossible de charger la trajectoire.');
            } finally {
                setLoading(false);
            }
        };
        updateTrajectory();
    }, [steps[currentStep - 1].params, currentStep]);

    const handleParamChange = (paramName, value) => {
        setSteps(prevSteps => {
            const newSteps = [...prevSteps];
            if (paramName === 'road_condition' || paramName === 'vehicle_type') {
                newSteps[currentStep - 1] = {
                    ...newSteps[currentStep - 1],
                    params: {
                        ...newSteps[currentStep - 1].params,
                        [paramName]: value
                    }
                };
                return newSteps;
            } else {

                const numValue = Number(value);

                if (paramName === 'controls') {
                    // Réinitialiser tous les contrôles
                    let handbrake = 0;
                    let brake = 0;
                    let throttle = 0;

                    if (numValue < -100) { // Zone frein à main
                        handbrake = 100; // Ajustez selon vos besoins
                    } else if (numValue < 0) { // Zone frein
                        brake = -numValue; // Ajustez selon vos besoins
                    } else { // Zone accélérateur
                        throttle = numValue;
                    }

                    newSteps[currentStep - 1] = {
                        ...newSteps[currentStep - 1],
                        params: {
                            ...newSteps[currentStep - 1].params,
                            handbrake: handbrake,
                            brake: brake,
                            throttle: throttle
                        }
                    };
                    return newSteps;

                } else {
                    newSteps[currentStep - 1] = {
                        ...newSteps[currentStep - 1],
                        params: {
                            ...newSteps[currentStep - 1].params,
                            [paramName]: numValue
                        }
                    };
                    return newSteps;
                }
            }
        });
    };

    // Ajoutez une vérification de sécurité dans le rendu
    if (!metadata || !steps[currentStep - 1]) {
        return <div>Loading...</div>;
    }

    const handleNextStep = () => {
        const currentPositions = steps[currentStep - 1].positions;
        const lastPosition = currentPositions[currentPositions.length - 1];

        setSteps(prevSteps => [
            ...prevSteps,
            {
                params: {
                    ...prevSteps[currentStep - 1].params,
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
        ]);
        setCurrentStep(prev => prev + 1);
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setSteps(prevSteps => prevSteps.slice(0, -1));
        }
    };

    const allPositions = steps.slice(0, currentStep).flatMap(step => step.positions);

    return (
        <Container>
            <Header>Turned Based Driving Simulator</Header>
            <StepIndicator>Turn #{currentStep}</StepIndicator>

            <ControlPanel
                metadata={metadata}
                params={steps[currentStep - 1].params}
                onParamChange={handleParamChange}
                onPreviousStep={handlePreviousStep}
                onNextStep={handleNextStep}
            />


            <Canvas
                positions={allPositions}
                steering={steps[currentStep - 1].params.steering}
                scale={steps[currentStep - 1].params.scale}
            />

            {loading && <Status>Loading trajectory...</Status>}
            {error && <Status error>{error}</Status>}
        </Container>
    );
}
