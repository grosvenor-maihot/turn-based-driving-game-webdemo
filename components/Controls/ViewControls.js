import { SliderContainer, Label, Slider } from '../../styles/MainStyles';

export function ViewControls({ metadata, params, onParamChange }) {
    return (
        <SliderContainer>
            <Label>
                {metadata.view_params.scale.label}: {params.scale}
            </Label>
            <Slider
                type="range"
                min={metadata.view_params.scale.min}
                max={metadata.view_params.scale.max}
                step={metadata.view_params.scale.step}
                value={params.scale}
                onChange={(e) => onParamChange('scale', e.target.value)}
            />
        </SliderContainer>
    );
}
