import { useEffect, useRef } from "react";
import { Sprite } from "./components/sprite";
import { CELL_SIZE, GRID_NUM } from "./constants";
import { Assets, Texture, Sprite as SpritePixi, TextureSource } from "pixi.js";
import { Position } from "./types";
import { SnakeClass } from "./Snake";
import { food, snake } from "./Game";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let foodTexture: Texture<TextureSource<any>>;

async function loadFoodTexture() {
	if (foodTexture === undefined) {
		foodTexture = await Assets.load("/assets/food.svg");
	}
	return foodTexture;
}

export class FoodClass {
	ref: SpritePixi | null = null;
	position: Position | null = null;
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

export function Food() {
	const ref = useRef(null);
	useEffect(() => {
		if (ref.current === null) return;
		food.ref = ref.current;
		food.spawn(snake);
	}, [ref]);
	return (
		<Sprite ref={ref} width={CELL_SIZE} height={CELL_SIZE} x={-1} y={-1} load={loadFoodTexture()} />
	);
}
