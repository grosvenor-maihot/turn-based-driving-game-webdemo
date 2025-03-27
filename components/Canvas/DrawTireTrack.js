/**
 * Configuration for tire track appearance
 */
const TIRE_TRACK_CONFIG = {
  color: 'rgba(0, 0, 0, 0.1)',
  widthRatio: 0.3,
  lengthRatio: 0.7
};

/**
 * Draw a tire track mark on the canvas
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position of the vehicle center
 * @param {number} y - Y position of the vehicle center
 * @param {number} yaw - Yaw angle of the vehicle in radians
 * @param {number} wheelX - X offset of the wheel from vehicle center
 * @param {number} wheelY - Y offset of the wheel from vehicle center
 * @param {number} scale - Scale factor for the track size
 */
export const drawTireTrack = (ctx, x, y, yaw, wheelX, wheelY, scale) => {
  // Save the current canvas state
  ctx.save();
  
  // Position and rotate to match the vehicle orientation
  ctx.translate(x, y);
  ctx.rotate(-yaw);
  
  // Position at the wheel location
  ctx.translate(wheelX * scale, wheelY * scale);

  // Draw the tire track mark
  ctx.fillStyle = TIRE_TRACK_CONFIG.color;
  ctx.beginPath();
  ctx.ellipse(
    0, 0,
    TIRE_TRACK_CONFIG.widthRatio * scale,
    TIRE_TRACK_CONFIG.lengthRatio * scale,
    0, 0, 2 * Math.PI
  );
  ctx.fill();

  // Restore the canvas state
  ctx.restore();
};