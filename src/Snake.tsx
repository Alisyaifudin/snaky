import { useRef } from "react";
import { Sprite } from "./components/sprite";
import { getRandomPosition } from "./utils/random-position";
import { CELL_NUM, CELL_SIZE, GRID_NUM } from "./constants";
import { Assets, Texture, Sprite as SpritePixi, TextureSource } from "pixi.js";
import { Position } from "./types";
import { getRandomDirection } from "./utils/random-dir";
import { mod } from "./utils/modulo";
import { useTick } from "@pixi/react";
import { GameClass } from "./Game";
import { hashPos } from "./utils/hash-position";
import { FoodClass } from "./Food";
import { useRerender } from "./hooks/rerender";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bodyTexture: Texture<TextureSource<any>>;

async function loadBodyTexture() {
	if (bodyTexture === undefined) {
		bodyTexture = await Assets.load("/assets/snake-body.svg");
	}
	return bodyTexture;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let headTexture: Texture<TextureSource<any>>;

async function loadHeadTexture() {
	if (headTexture === undefined) {
		headTexture = await Assets.load("/assets/snake-head.svg");
	}
	return headTexture;
}

export class SnakeClass {
	buffer: Position[] = new Array(CELL_NUM);
	dir = getRandomDirection();
	headIdx = 0;
	tailIdx = 0;
	length = 1;
	occupancy: Set<string> = new Set();
	refs: SpritePixi[] = [];
	constructor(private game: GameClass) {
		this.buffer[0] = getRandomPosition();
		this.occupancy.add(hashPos(this.buffer[0]));
	}
	setBodyRef(i: number, ref: SpritePixi) {
		const body = this.refs.at(i);
		if (body === undefined) {
			this.refs.push(ref);
		} else {
			this.refs[i] = ref;
		}
	}
	*iterBodies(): Generator<Position> {
		for (let i = 0; i < this.length; i++) {
			const idx = mod(this.headIdx - i, CELL_NUM);
			yield this.buffer[idx];
		}
	}
	collided(pos: Position): boolean {
		return this.occupancy.has(hashPos(pos));
	}
	body(i: number) {
		const idx = mod(this.headIdx - i, CELL_NUM);
		return this.buffer[idx];
	}
	loadTexture(i: number) {
		if (i === 0) return loadHeadTexture();
		return loadBodyTexture();
	}
	update() {
		this.refs.forEach((ref, i) => {
			const body = this.body(i);
			ref.x = body.x * CELL_SIZE;
			ref.y = body.y * CELL_SIZE;
		});
	}
	move(food: FoodClass, rerender: () => void) {
		if (food.position === null) return;
		const head = this.buffer[this.headIdx];
		const newHead = {
			x: mod(head.x + this.dir.x, GRID_NUM),
			y: mod(head.y + this.dir.y, GRID_NUM),
		};
		if (this.collided(newHead)) {
			this.game.over();
			return;
		}
		this.headIdx = mod(this.headIdx + 1, CELL_NUM);
		this.buffer[this.headIdx] = newHead;
		if (this.collided(food.position)) {
			food.spawn(this);
			this.length++;
			rerender();
		} else {
			this.tailIdx = mod(this.tailIdx + 1, CELL_NUM);
			this.update();
		}
	}
}

export function Snake({
	game,
	snake,
	food,
}: {
	game: GameClass;
	snake: SnakeClass;
	food: FoodClass;
}) {
	const rerender = useRerender();
	const dt = useRef(0);
	useTick((ticker) => {
		dt.current += ticker.deltaTime;
		if (food.position === null || game.status !== "start") return;
		if (dt.current > game.interval) {
			dt.current -= game.interval;
			snake.move(food, rerender);
		}
	});
	return (
		<>
			{Array.from({ length: snake.length }).map((_, i) => {
				const pos = snake.body(i);
				return (
					<Sprite
						key={i}
						ref={(e) => snake.setBodyRef(i, e!)}
						width={CELL_SIZE}
						height={CELL_SIZE}
						x={pos.x * CELL_SIZE}
						y={pos.y * CELL_SIZE}
						load={snake.loadTexture(i)}
					/>
				);
			})}
		</>
	);
}
