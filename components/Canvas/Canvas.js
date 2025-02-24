import { useRef, useEffect } from 'react';
import { drawCar } from './DrawCar';
import { drawTireTrack } from './DrawTireTrack';
import { useCanvasDrawing } from './useCanvasDrawing';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

const Canvas = ({ positions, steering, scale = 10, previousSteps }) => {
    const canvasRef = useRef(null);
    
    useCanvasDrawing(canvasRef, positions, steering, scale, previousSteps);

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ border: '1px solid black', backgroundColor: '#f0f0f0' }}
        />
    );
};

export default Canvas;