import { StepControls } from './controls/StepControls';
import { BasicControls } from './controls/BasicControls';
import { VehicleControls } from './controls/VehicleControls';
import { CombinedSlider } from './controls/CombinedSlider';
import { ViewControls } from './controls/ViewControls';
import { Controls } from '../styles/MainStyles';

export default function ControlPanel({ metadata, params, onParamChange, currentStep, onPreviousStep, onNextStep }) {
    return (
        <Controls>
            <StepControls
                currentStep={currentStep}
                onPreviousStep={onPreviousStep}
                onNextStep={onNextStep}
            />
            <BasicControls
                metadata={metadata}
                params={params}
                onParamChange={onParamChange}
            />
            <VehicleControls
                params={params}
                onParamChange={onParamChange}
            />
            <CombinedSlider
                value={params.combinedControl}
                onChange={onParamChange}
            />
            <ViewControls
                metadata={metadata}
                params={params}
                onParamChange={onParamChange}
            />
        </Controls>
    );
}
