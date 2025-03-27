import { useRef, memo } from 'react';
import styled from 'styled-components';
import { useCanvasDrawing } from './useCanvasDrawing';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

/**
 * Styled canvas component with consistent styling
 */
const StyledCanvas = styled.canvas`
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  max-width: 100%;
  height: auto;
`;

/**
 * Canvas component for rendering vehicle trajectories
 * @param {Object} props - Component props
 * @param {Array} props.positions - Array of position objects with x, y, yaw properties
 * @param {number} props.steering - Current steering angle
 * @param {number} [props.scale=10] - Scale factor for rendering
 * @param {Array} [props.previousSteps] - Previous trajectory steps
 * @returns {JSX.Element} - Rendered canvas component
 */
const Canvas = ({ positions, steering, scale = 10, previousSteps }) => {
    const canvasRef = useRef(null);
    
    useCanvasDrawing(canvasRef, positions, steering, scale, previousSteps);

    return (
        <StyledCanvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            aria-label="Vehicle trajectory visualization"
            role="img"
        />
    );
};

// Use memo to prevent unnecessary re-renders
export default memo(Canvas);