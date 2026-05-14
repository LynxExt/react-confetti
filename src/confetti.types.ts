import type { CSSProperties } from "react";

interface CommonProps {
	particleCount?: number;
	shapeSize?: number;
	colors?: string[];
	className?: string;
	style?: CSSProperties;
}

export interface BoomProps extends CommonProps {
	mode?: "boom";
	x?: number;
	y?: number;
	deg?: number;
	spreadDeg?: number;
	effectInterval?: number;
	effectCount?: number;
	launchSpeed?: number;
	opacityDeltaMultiplier?: number;
}

export interface FallProps extends CommonProps {
	mode: "fall";
	fadeOutHeight?: number;
}

export type ConfettiProps = BoomProps | FallProps;
