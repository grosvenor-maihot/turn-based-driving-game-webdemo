import { useEffect, useCallback } from 'react';
import { drawCar } from './DrawCar';
import { drawTireTrack } from './DrawTireTrack';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_START_X, CANVAS_START_Y, CAR_WIDTH, CAR_LENGTH } from './constants';

/**
 * Custom hook for handling canvas drawing operations
 *
 * @param {React.RefObject} canvasRef - Reference to the canvas element
 * @param {Array} positions - Array of position objects with x, y, yaw properties
 * @param {number} steering - Current steering angle
 * @param {number} scale - Scale factor for rendering
 * @param {Array} previousSteps - Previous trajectory steps
 */
export const useCanvasDrawing = (canvasRef, positions, steering, scale, previousSteps) => {
    /**
     * Transforms a simulation coordinate to canvas coordinate
     * @param {number} x - Simulation x coordinate
     * @param {number} y - Simulation y coordinate
     * @returns {Object} - Canvas coordinates {x, y}
     */
    const transformCoordinates = useCallback((x, y) => ({
        x: CANVAS_START_X + x * scale,
        y: CANVAS_START_Y - y * scale
    }), [scale]);

    /**
     * Draws tire tracks for a vehicle at the specified position
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} position - Position object with x, y, yaw properties
     */
    const drawTireTracks = useCallback((ctx, position) => {
        const { x, y } = transformCoordinates(position.x, position.y);
        
        // Draw tracks for all four wheels
        drawTireTrack(ctx, x, y, position.yaw, CAR_LENGTH *  .5, CAR_WIDTH *  .5, scale);
        drawTireTrack(ctx, x, y, position.yaw, CAR_LENGTH *  .5, CAR_WIDTH * -.5, scale);
        drawTireTrack(ctx, x, y, position.yaw, CAR_LENGTH * -.5, CAR_WIDTH *  .5, scale);
        drawTireTrack(ctx, x, y, position.yaw, CAR_LENGTH * -.5, CAR_WIDTH * -.5, scale);
    }, [scale, transformCoordinates]);

    /**
     * Draws a trajectory path on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Array} positionArray - Array of position objects
     * @param {string} strokeStyle - CSS color for the stroke
     * @param {number} lineWidth - Width of the line
     */
    const drawTrajectory = useCallback((ctx, positionArray, strokeStyle, lineWidth) => {
        if (!positionArray || positionArray.length === 0) return;
        
        ctx.beginPath();
        positionArray.forEach((pos, index) => {
            const { x, y } = transformCoordinates(pos.x, pos.y);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }, [transformCoordinates]);

    useEffect(() => {
        if (!positions || positions.length === 0 || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw tire tracks for current positions
        positions.forEach(pos => drawTireTracks(ctx, pos));

        // Draw previous trajectories
        if (previousSteps) {
            previousSteps.forEach((step, stepIndex) => {
                const opacity = Math.max(0.05, 0.3 - stepIndex * 0.05);
                drawTrajectory(
                    ctx,
                    step.positions,
                    `rgba(150, 150, 150, ${opacity})`,
                    2 * scale/10
                );
            });
        }

        // Draw current trajectory
        drawTrajectory(ctx, positions, 'rgba(0, 0, 255, 0.3)', 2 * scale/10);

        // Draw car at the last position
        if (positions.length > 0) {
            const lastPos = positions[positions.length - 1];
            const { x, y } = transformCoordinates(lastPos.x, lastPos.y);
            
            drawCar(ctx, x, y, lastPos.yaw, steering, 1.0, scale);
        }
    }, [positions, steering, scale, previousSteps, drawTireTracks, drawTrajectory, transformCoordinates]);
};
