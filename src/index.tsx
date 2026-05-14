import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import type { BoomProps, ConfettiProps, FallProps } from "./confetti.types";
import { createParticle, drawParticle, type Particle, stepParticle } from "./particle";
import { DEFAULT_COLORS, FRAME_INTERVAL, randomBetween } from "./utils";

export type { BoomProps, ConfettiProps, FallProps } from "./confetti.types";

const CANVAS_STYLE: CSSProperties = {
	position: "absolute",
	inset: 0,
	width: "100%",
	height: "100%",
	pointerEvents: "none",
};

const FALL_MODE_OVERRIDES = {
	effectInterval: 1,
	effectCount: Infinity,
	deg: 270,
	spreadDeg: 0,
	launchSpeed: 0,
};

function Confetti({ className, style, ...rest }: ConfettiProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		const isFallMode = rest.mode === "fall";
		const { particleCount = 30, shapeSize = 12, colors = DEFAULT_COLORS } = rest;
		const {
			x = 0.5,
			y = 0.5,
			deg = 270,
			spreadDeg = 30,
			effectInterval = 3000,
			effectCount = 1,
			launchSpeed = 1,
			opacityDeltaMultiplier = 1,
		} = (isFallMode ? FALL_MODE_OVERRIDES : rest) as BoomProps;
		const { fadeOutHeight = 0.8 } = (isFallMode ? rest : {}) as FallProps;

		const canvasWidth = innerWidth;
		const canvasHeight = innerHeight;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		const spawnCount = isFallMode ? particleCount / 30 : particleCount;
		const opacityDelta = isFallMode
			? 3.4 / fadeOutHeight / canvasHeight
			: 0.004 * Math.max(0.1, opacityDeltaMultiplier);

		const particles: Particle[] = [];
		let rafHandle = 0;
		let previousFrameTime = Date.now();
		let previousEmitTime = previousFrameTime - effectInterval;
		let burstCount = 0;

		const emit = () => {
			const originX = isFallMode ? randomBetween(0, 1) : x;
			const originY = isFallMode ? randomBetween(-0.3, -0.1) : y;
			for (let i = 0; i < spawnCount; i++) {
				particles.push(
					createParticle({
						originX,
						originY,
						canvasWidth,
						canvasHeight,
						angleDeg: deg,
						spreadDeg,
						launchSpeed,
						opacityDelta,
						colors,
					}),
				);
			}
		};

		const frame = () => {
			rafHandle = requestAnimationFrame(frame);
			const now = Date.now();
			const frameDelta = now - previousFrameTime;
			if (frameDelta < FRAME_INTERVAL) return;

			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			const emitDelta = now - previousEmitTime;
			if (emitDelta > effectInterval && burstCount < effectCount) {
				emit();
				previousEmitTime = now - (emitDelta % effectInterval);
				burstCount++;
			}

			for (let i = particles.length - 1; i >= 0; i--) {
				const particle = particles[i]!;
				stepParticle(particle);
				drawParticle(ctx, particle, shapeSize);
				if (particle.opacity <= 0 || particle.y > canvasHeight) {
					particles.splice(i, 1);
				}
			}

			previousFrameTime = now - (frameDelta % FRAME_INTERVAL);
			if (burstCount >= effectCount && !particles.length) {
				cancelAnimationFrame(rafHandle);
			}
		};

		frame();
		return () => cancelAnimationFrame(rafHandle);
		// biome-ignore lint/correctness/useExhaustiveDependencies: props snapshotted on mount
	}, []);

	return <canvas ref={canvasRef} className={className} style={{ ...CANVAS_STYLE, ...style }} />;
}

export default Confetti;
