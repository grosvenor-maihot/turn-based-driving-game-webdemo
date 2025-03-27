import { memo } from 'react';
import { StepControls } from './Controls/StepControls';
import { BasicControls } from './Controls/BasicControls';
import { VehicleControls } from './Controls/VehicleControls';
import { CombinedSlider } from './Controls/CombinedSlider';
import { ViewControls } from './Controls/ViewControls';
import { Controls, Panel } from '../styles/MainStyles';

/**
 * Control panel component that contains all user input controls
 *
 * @param {Object} props - Component props
 * @param {Object} props.metadata - Simulation metadata
 * @param {Object} props.params - Current simulation parameters
 * @param {Function} props.onParamChange - Handler for parameter changes
 * @param {number} props.currentStep - Current simulation step
 * @param {Function} props.onPreviousStep - Handler for moving to previous step
 * @param {Function} props.onNextStep - Handler for moving to next step
 * @param {boolean} [props.disableNext=false] - Whether next step button should be disabled
 * @param {boolean} [props.disablePrevious=false] - Whether previous step button should be disabled
 * @returns {JSX.Element} - Rendered control panel
 */
function ControlPanel({
    metadata,
    params,
    onParamChange,
    currentStep,
    onPreviousStep,
    onNextStep,
    disableNext = false,
    disablePrevious = false
}) {
    return (
        <Controls>
            <Panel>
                <StepControls
                    currentStep={currentStep}
                    onPreviousStep={onPreviousStep}
                    onNextStep={onNextStep}
                    disableNext={disableNext}
                    disablePrevious={disablePrevious}
                />
            </Panel>
            
            <Panel>
                <BasicControls
                    metadata={metadata}
                    params={params}
                    onParamChange={onParamChange}
                />
            </Panel>
            
            <Panel>
                <VehicleControls
                    params={params}
                    onParamChange={onParamChange}
                />
            </Panel>
            
            <Panel>
                <CombinedSlider
                    value={0} // Default to 0 since we calculate throttle/brake/handbrake separately
                    onChange={onParamChange}
                />
            </Panel>
            
            <Panel>
                <ViewControls
                    metadata={metadata}
                    params={params}
                    onParamChange={onParamChange}
                />
            </Panel>
        </Controls>
    );
}

// Use memo to prevent unnecessary re-renders
export default memo(ControlPanel);
