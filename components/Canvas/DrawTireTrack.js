export const drawTireTrack = (ctx, x, y, yaw, wheelX, wheelY, scale) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-yaw);
        ctx.translate(wheelX * scale, wheelY * scale);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.ellipse(0, 0, .3 * scale, .7 * scale, 0, 0, 2 * Math.PI); // Ajuster l'échelle
        ctx.fill();

        ctx.restore();
};