import { Position } from "../types";

export function hashPos(pos: Position) {
	return `x:${pos.x};y:${pos.y}`;
}
