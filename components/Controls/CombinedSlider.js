import { useState, useEffect } from 'react';
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
    left: ${props => props.$position}%;
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
export function CombinedSlider({ value = 0, onChange }) {
    // Simple state for the slider value
    const [sliderValue, setSliderValue] = useState(value);
    
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
                <span>Handbrake</span>
                <span>Brake</span>
                <span>Neutral</span>
                <span>Throttle</span>
            </CombinedSliderLabel>
            
            <Slider
                type="range"
                min={-200}
                max={100}
                value={sliderValue}
                onChange={handleChange}
                aria-label="Vehicle control slider"
            />
        </CombinedSliderContainer>
    );
}
