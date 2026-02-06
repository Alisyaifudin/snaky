import { Position } from "@/types";
import { Sprite } from "pixi.js";
import { CELL_SIZE, GRID_NUM } from "@/utils/constants";
import { SnakeClass } from "../Snake/class";

export class FoodClass {
	ref: Sprite | null = null;
	position: Position | null = null;
	constructor() {}
	spawn(snake: SnakeClass) {
		let count = 0;
		for (let x = 0; x < GRID_NUM; x++) {
			for (let y = 0; y < GRID_NUM; y++) {
				if (snake.collided({ x, y })) {
					continue;
				}
				count++;
				if (Math.random() < 1 / count) {
					this.position = { x, y };
				}
			}
		}
		this.render();
	}
	reset(snake: SnakeClass) {
		this.spawn(snake);
		this.render();
	}
	render() {
		const ref = this.ref;
		const pos = this.position;
		if (ref === null || pos === null) return;
		ref.x = pos.x * CELL_SIZE;
		ref.y = pos.y * CELL_SIZE;
	}
}

export class FoodSingleton {
	private static food: FoodClass | null = null;
	static getInstance() {
		if (this.food === null) {
			this.food = new FoodClass();
		}
		return this.food;
	}
}

export const food = FoodSingleton.getInstance();
