import { GRID_NUM } from "../constants";
import { Position } from "../types";

export function getRandomPosition(): Position {
	const x = Math.floor(Math.random() * GRID_NUM);
	const y = Math.floor(Math.random() * GRID_NUM);
	return { x, y };
}
