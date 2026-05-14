import { DEG_TO_RAD, ROT_SCALE, randomBetween, TAU } from "./utils";

export interface Particle {
	x: number;
	y: number;
	velocityX: number;
	velocityY: number;
	gravity: number;
	opacity: number;
	opacityDelta: number;
	rotation: number;
	rotationDelta: number;
	widthDelta: number;
	heightDelta: number;
	swingOffset: number;
	swingSpeed: number;
	swingAmplitude: number;
	isSquare: boolean;
	color: string;
}

export interface ParticleSpawn {
	originX: number;
	originY: number;
	canvasWidth: number;
	canvasHeight: number;
	angleDeg: number;
	spreadDeg: number;
	launchSpeed: number;
	opacityDelta: number;
	colors: string[];
}

export const createParticle = ({
	originX,
	originY,
	canvasWidth,
	canvasHeight,
	angleDeg,
	spreadDeg,
	launchSpeed,
	opacityDelta,
	colors,
}: ParticleSpawn): Particle => {
	const theta = DEG_TO_RAD * randomBetween(angleDeg - spreadDeg, angleDeg + spreadDeg);
	const radius = randomBetween(20 * launchSpeed, 70 * launchSpeed);
	return {
		x: originX * canvasWidth,
		y: originY * canvasHeight,
		velocityX: radius * Math.cos(theta),
		velocityY: radius * Math.sin(theta),
		gravity: randomBetween(0.5, 0.6),
		opacity: 1,
		opacityDelta,
		rotation: randomBetween(0, 360),
		rotationDelta: randomBetween(-1, 1),
		widthDelta: randomBetween(0, 360),
		heightDelta: randomBetween(0, 360),
		swingOffset: randomBetween(0, TAU),
		swingSpeed: Math.random() * 0.05 + 0.01,
		swingAmplitude: randomBetween(0.1, 0.2),
		isSquare: Math.random() < 0.5,
		color: colors[Math.floor(Math.random() * colors.length)] as string,
	};
};

export const stepParticle = (p: Particle) => {
	p.velocityX *= 0.9;
	p.velocityY = p.velocityY * 0.87 + p.gravity;
	p.velocityX += Math.sin(p.swingOffset) * p.swingAmplitude;
	p.x += p.velocityX;
	p.y += p.velocityY;
	p.opacity -= p.opacityDelta;
	p.widthDelta += 2;
	p.heightDelta += 2;
	p.rotation += p.rotationDelta;
	p.swingOffset += p.swingSpeed;
};

export const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle, shapeSize: number) => {
	const offset = shapeSize * 1.3;
	const anchorX = p.x + offset;
	const anchorY = p.y + offset;
	ctx.translate(anchorX, anchorY);
	ctx.rotate(ROT_SCALE * p.rotation);
	ctx.translate(-anchorX, -anchorY);
	ctx.globalAlpha = p.opacity;
	ctx.fillStyle = p.color;
	const width = shapeSize * Math.cos(DEG_TO_RAD * p.widthDelta);
	const height = shapeSize * Math.sin(DEG_TO_RAD * p.heightDelta);
	if (p.isSquare) {
		ctx.fillRect(p.x, p.y, width, height);
	} else {
		ctx.beginPath();
		ctx.ellipse(p.x, p.y, Math.abs(width) / 2, Math.abs(height) / 2, 0, 0, TAU);
		ctx.fill();
	}
	ctx.resetTransform();
};
