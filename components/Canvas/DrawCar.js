import { MAX_STEERING_ANGLE } from './constants';

// Car appearance configuration
const CAR_COLORS = {
  body: 'rgba(255, 0, 0, {opacity})',
  cockpit: 'rgba(50, 50, 50, {opacity})',
  wings: 'rgba(200, 0, 0, {opacity})',
  wheels: 'rgba(0, 0, 0, {opacity})'
};

// Car dimension ratios
const DIMENSION_RATIOS = {
  carWidth: 60,
  carLength: 140,
  wheelWidth: 12,
  wheelLength: 25,
  cockpitLengthRatio: 6,
  cockpitWidthRatio: 3,
  wingWidthRatio: 1.5,
  wingLengthRatio: 10,
  wheelPositionRatio: 1.3
};

/**
 * Draw a wheel at the specified position with optional steering angle
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position relative to car center
 * @param {number} y - Y position relative to car center
 * @param {number} wheelLength - Length of the wheel
 * @param {number} wheelWidth - Width of the wheel
 * @param {number} opacity - Opacity of the wheel
 * @param {number} [steeringAngle=0] - Steering angle in radians
 */
function drawWheel(ctx, x, y, wheelLength, wheelWidth, opacity, steeringAngle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-steeringAngle);
  ctx.fillStyle = CAR_COLORS.wheels.replace('{opacity}', opacity);
  ctx.beginPath();
  ctx.rect(-wheelLength/2, -wheelWidth/2, wheelLength, wheelWidth);
  ctx.fill();
  ctx.restore();
}

/**
 * Draw the car body
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} carLength - Length of the car
 * @param {number} carWidth - Width of the car
 * @param {number} opacity - Opacity of the car
 */
function drawCarBody(ctx, carLength, carWidth, opacity) {
  ctx.beginPath();
  ctx.fillStyle = CAR_COLORS.body.replace('{opacity}', opacity);
  
  // Draw car body shape
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
}

/**
 * Draw the car cockpit
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} carLength - Length of the car
 * @param {number} carWidth - Width of the car
 * @param {number} opacity - Opacity of the car
 */
function drawCockpit(ctx, carLength, carWidth, opacity) {
  ctx.fillStyle = CAR_COLORS.cockpit.replace('{opacity}', opacity);
  ctx.beginPath();
  ctx.ellipse(
    0, 0,
    carLength/DIMENSION_RATIOS.cockpitLengthRatio,
    carWidth/DIMENSION_RATIOS.cockpitWidthRatio,
    0, 0, 2 * Math.PI
  );
  ctx.fill();
}

/**
 * Draw the car wings
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} carLength - Length of the car
 * @param {number} carWidth - Width of the car
 * @param {number} opacity - Opacity of the car
 */
function drawWings(ctx, carLength, carWidth, opacity) {
  ctx.fillStyle = CAR_COLORS.wings.replace('{opacity}', opacity);
  
  // Front wing
  ctx.fillRect(
    carLength/2,
    -carWidth/DIMENSION_RATIOS.wingWidthRatio,
    carLength/DIMENSION_RATIOS.wingLengthRatio,
    carWidth*1.3
  );
  
  // Rear wing
  ctx.fillRect(
    -carLength/2,
    -carWidth/DIMENSION_RATIOS.wingWidthRatio,
    carLength/DIMENSION_RATIOS.wingLengthRatio,
    carWidth*1.3
  );
}

/**
 * Draw a car on the canvas
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position of the car center
 * @param {number} y - Y position of the car center
 * @param {number} yaw - Yaw angle of the car in radians
 * @param {number} steering - Steering value (-100 to 100)
 * @param {number} [opacity=1] - Opacity of the car (0-1)
 * @param {number} [scale=10] - Scale factor for the car size
 */
export const drawCar = (ctx, x, y, yaw, steering, opacity = 1, scale = 10) => {
  // Save the current canvas state
  ctx.save();
  
  // Position and rotate the car
  ctx.translate(x, y);
  ctx.rotate(-yaw);

  // Calculate dimensions based on scale
  const scaleFactor = scale/10;
  const carWidth = DIMENSION_RATIOS.carWidth * scaleFactor;
  const carLength = DIMENSION_RATIOS.carLength * scaleFactor;
  const wheelWidth = DIMENSION_RATIOS.wheelWidth * scaleFactor;
  const wheelLength = DIMENSION_RATIOS.wheelLength * scaleFactor;

  // Draw car components
  drawCarBody(ctx, carLength, carWidth, opacity);
  drawCockpit(ctx, carLength, carWidth, opacity);
  drawWings(ctx, carLength, carWidth, opacity);

  // Calculate steering angle
  const steeringAngle = (steering / 100) * MAX_STEERING_ANGLE;
  const wheelPositionRatio = DIMENSION_RATIOS.wheelPositionRatio;

  // Draw wheels
  drawWheel(ctx, carLength/3, carWidth/wheelPositionRatio, wheelLength, wheelWidth, opacity, steeringAngle);   // Front left
  drawWheel(ctx, carLength/3, -carWidth/wheelPositionRatio, wheelLength, wheelWidth, opacity, steeringAngle);  // Front right
  drawWheel(ctx, -carLength/3, carWidth/wheelPositionRatio, wheelLength, wheelWidth, opacity);                 // Rear left
  drawWheel(ctx, -carLength/3, -carWidth/wheelPositionRatio, wheelLength, wheelWidth, opacity);                // Rear right

  // Restore the canvas state
  ctx.restore();
};