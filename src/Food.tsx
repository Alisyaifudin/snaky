import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sprite } from "./components/sprite";
import { CELL_SIZE, GRID_NUM } from "./constants";
import { Assets, Texture, TextureSource } from "pixi.js";
import { Position } from "./types";
import { SnakeClass } from "./Snake";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let foodTexture: Texture<TextureSource<any>>;

async function loadFoodTexture() {
	if (foodTexture === undefined) {
		foodTexture = await Assets.load("/assets/food.svg");
	}
	return foodTexture;
}

export class FoodClass {
	position: Position | null = null;
	setPosition: null | Dispatch<SetStateAction<Position | null>> = null;
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
		this.setPosition?.(this.position);
	}
}

export function Food({ food, snake }: { food: FoodClass; snake: SnakeClass }) {
	const [position, setPosition] = useState<null | Position>(null);
	useEffect(() => {
		food.setPosition = setPosition;
		food.spawn(snake);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (position === null) return;
	return (
		<Sprite
			width={CELL_SIZE}
			height={CELL_SIZE}
			x={position.x * CELL_SIZE}
			y={position.y * CELL_SIZE}
			load={loadFoodTexture()}
		/>
	);
}
