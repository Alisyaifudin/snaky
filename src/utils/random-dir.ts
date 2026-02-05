import { VelocityDirection } from "../types";

export function getRandomDirection(): VelocityDirection {
	const random = Math.random() * 4;
	if (random < 1) return { x: 1, y: 0 };
	if (random < 2) return { x: 0, y: 1 };
	if (random < 3) return { x: -1, y: 0 };
	return { x: 0, y: -1 };
}
