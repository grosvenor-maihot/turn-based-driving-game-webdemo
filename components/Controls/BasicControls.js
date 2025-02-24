import { SliderContainer, Label, Slider } from '../../styles/MainStyles';

export function BasicControls({ metadata, params, onParamChange }) {
    return (
        <>
            <SliderContainer>
                <Label>
                    {metadata.params_ranges.steering.label}: {params.steering}
                </Label>
                <Slider
                    type="range"
                    min={metadata.params_ranges.steering.min}
                    max={metadata.params_ranges.steering.max}
                    step={metadata.params_ranges.steering.step}
                    value={params.steering}
                    onChange={(e) => onParamChange('steering', e.target.value)}
                />
            </SliderContainer>
        </>
    );
}
