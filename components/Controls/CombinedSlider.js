import { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    CombinedSliderContainer,
    CombinedSliderLabel,
    Slider,
    Label
} from '../../styles/MainStyles';
import { COMBINED_CONTROL_RANGES, COMBINED_CONTROL_LABELS } from '../../utils/constants';

// Styled marker to show the current control state
const ControlMarker = styled.div`
    position: absolute;
    top: -20px;
    left: ${props => props.position}%;
    transform: translateX(-50%);
    background-color: #007bff;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
`;

// Styled container with relative positioning for the marker
const SliderContainer = styled.div`
    position: relative;
    margin-top: 30px;
    width: 100%;
`;

/**
 * Combined vehicle control slider component
 *
 * @param {Object} props - Component props
 * @param {number} props.value - Current slider value
 * @param {Function} props.onChange - Handler for value changes
 * @returns {JSX.Element} - Rendered slider component
 */
export const CombinedSlider = memo(function CombinedSlider({ value = 0, onChange }) {
    const [sliderValue, setSliderValue] = useState(value);
    const [controlState, setControlState] = useState('neutral');
    
    // Calculate the slider position as a percentage for the marker
    const sliderPosition = ((sliderValue - COMBINED_CONTROL_RANGES.min) /
        (COMBINED_CONTROL_RANGES.max - COMBINED_CONTROL_RANGES.min)) * 100;
    
    // Update the control state based on the slider value
    useEffect(() => {
        if (sliderValue < -100) {
            setControlState('handbrake');
        } else if (sliderValue < 0) {
            setControlState('brake');
        } else if (sliderValue === 0) {
            setControlState('neutral');
        } else {
            setControlState('throttle');
        }
    }, [sliderValue]);
    
    // Handle slider change
    const handleChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        setSliderValue(newValue);
        onChange('controls', newValue);
    };

    return (
        <CombinedSliderContainer>
            <Label>Vehicle Controls</Label>
            <CombinedSliderLabel>
                <span>{COMBINED_CONTROL_LABELS.handbrake}</span>
                <span>{COMBINED_CONTROL_LABELS.brake}</span>
                <span>{COMBINED_CONTROL_LABELS.neutral}</span>
                <span>{COMBINED_CONTROL_LABELS.throttle}</span>
            </CombinedSliderLabel>
            
            <SliderContainer>
                <ControlMarker position={sliderPosition}>
                    {COMBINED_CONTROL_LABELS[controlState]}
                </ControlMarker>
                <Slider
                    type="range"
                    min={COMBINED_CONTROL_RANGES.min}
                    max={COMBINED_CONTROL_RANGES.max}
                    value={sliderValue}
                    onChange={handleChange}
                    aria-label="Vehicle control slider"
                    aria-valuemin={COMBINED_CONTROL_RANGES.min}
                    aria-valuemax={COMBINED_CONTROL_RANGES.max}
                    aria-valuenow={sliderValue}
                    aria-valuetext={COMBINED_CONTROL_LABELS[controlState]}
                />
            </SliderContainer>
        </CombinedSliderContainer>
    );
});
