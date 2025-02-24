import {
    CombinedSliderContainer,
    CombinedSliderLabel,
    Slider
} from '../../styles/MainStyles';

export function CombinedSlider({ value, onChange }) {

    return (
        <CombinedSliderContainer>
            <CombinedSliderLabel>
                <span>Handbrake</span>
                <span>Brake</span>
                <span>Neutral</span>
                <span>Throttle</span>
            </CombinedSliderLabel>
            <Slider
                type="range"
                min={-200}
                max={100}
                value={value}
                onChange={(e) => onChange('controls', e.target.value)}
            />
        </CombinedSliderContainer>
    );
}
