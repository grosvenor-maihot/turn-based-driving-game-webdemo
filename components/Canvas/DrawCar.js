import { MAX_STEERING_ANGLE } from './constants';

export const drawCar = (ctx, x, y, yaw, steering, opacity = 1, scale) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-yaw);

        // Dimensions ajustées selon l'échelle
        const carWidth = 60 * scale/10;
        const carLength = 140 * scale/10;
        const wheelWidth = 12 * scale/10;
        const wheelLength = 25 * scale/10;

        // Le reste du code de drawCar reste le même, mais avec les dimensions ajustées
        // Corps principal
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
        ctx.moveTo(-carLength/2, -carWidth/4);
        ctx.lineTo(-carLength/3, -carWidth/2);
        ctx.lineTo(carLength/3, -carWidth/2);
        ctx.lineTo(carLength/2, -carWidth/4);
        ctx.lineTo(carLength/2, carWidth/4);
        ctx.lineTo(carLength/3, carWidth/2);
        ctx.lineTo(-carLength/3, carWidth/2);
        ctx.lineTo(-carLength/2, carWidth/4);
        ctx.closePath();
        ctx.fill();

    // Cockpit
    ctx.fillStyle = `rgba(50, 50, 50, ${opacity})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, carLength/6, carWidth/3, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Aileron avant
    ctx.fillStyle = `rgba(200, 0, 0, ${opacity})`;
    ctx.fillRect(carLength/2, -carWidth/1.5, carLength/10, carWidth*1.3);

    // Aileron arrière
    ctx.fillRect(-carLength/2, -carWidth/1.5, carLength/10, carWidth*1.3);

    // Fonction pour dessiner une roue
    const drawWheel = (x, y, steering = 0) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-steering);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.beginPath();
        ctx.rect(-wheelLength/2, -wheelWidth/2, wheelLength, wheelWidth);
        ctx.fill();
        ctx.restore();
    };

    // Calculer l'angle des roues avant
    const steeringAngle = (steering / 100) * MAX_STEERING_ANGLE;

    // Dessiner les roues
    drawWheel(carLength/3, carWidth/1.3, steeringAngle);   // Avant gauche
    drawWheel(carLength/3, -carWidth/1.3, steeringAngle);  // Avant droite
    drawWheel(-carLength/3, carWidth/1.3);                 // Arrière gauche
    drawWheel(-carLength/3, -carWidth/1.3);                // Arrière droite

    ctx.restore();
};