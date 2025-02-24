import { useEffect } from 'react';
import { drawCar } from './DrawCar';
import { drawTireTrack } from './DrawTireTrack';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_START_X, CANVAS_START_Y, CAR_WIDTH, CAR_LENGTH } from './constants';

export const useCanvasDrawing = (canvasRef, positions, steering, scale, previousSteps) => {
    useEffect(() => {
        if (positions && positions.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const width = CANVAS_WIDTH;
            const height = CANVAS_HEIGHT;

            ctx.clearRect(0, 0, width, height);

            // Dessiner les traces de pneus
            positions.forEach((pos) => {
                const x = CANVAS_START_X + pos.x * scale;
                const y = CANVAS_START_Y - pos.y * scale;

                drawTireTrack(ctx, x, y, pos.yaw, CAR_LENGTH *  .5, CAR_WIDTH *  .5, scale);
                drawTireTrack(ctx, x, y, pos.yaw, CAR_LENGTH *  .5, CAR_WIDTH * -.5, scale);
                drawTireTrack(ctx, x, y, pos.yaw, CAR_LENGTH * -.5, CAR_WIDTH *  .5, scale);
                drawTireTrack(ctx, x, y, pos.yaw, CAR_LENGTH * -.5, CAR_WIDTH * -.5, scale);
            });

            // Dessiner les trajectoires et les voitures des étapes précédentes
            if (previousSteps) {
                previousSteps.forEach((step, stepIndex) => {
                    // Dessiner la trajectoire précédente en gris plus clair
                    ctx.beginPath();
                    step.positions.forEach((pos, index) => {
                        const x = CANVAS_START_X + pos.x * scale;
                        const y = CANVAS_START_Y - pos.y * scale;
                        if (index === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    });
                    ctx.strokeStyle = `rgba(150, 150, 150, ${0.3 - stepIndex * 0.05})`;
                    ctx.lineWidth = 2 * scale/10;
                    ctx.stroke();
                });
            }

            // Dessiner la trajectoire
            ctx.beginPath();
            positions.forEach((pos, index) => {
                const x = CANVAS_START_X + pos.x * scale;
                const y = CANVAS_START_Y - pos.y * scale;
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
            ctx.lineWidth = 2 * scale/10;
            ctx.stroke();

            drawCar(
                ctx,
                CANVAS_START_X + positions[positions.length - 1].x * scale,
                CANVAS_START_Y - positions[positions.length - 1].y * scale,
                positions[positions.length - 1].yaw,
                steering,
                1.0,
                scale
            );
        }
    }, [positions, steering, scale, previousSteps]);
};
