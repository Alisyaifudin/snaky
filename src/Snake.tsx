import { useRef } from "react";
import { Sprite } from "./components/sprite";
import { getRandomPosition } from "./utils/random-position";
import { CELL_NUM, CELL_SIZE, GRID_NUM } from "./constants";
import { Assets, Texture, Sprite as SpritePixi, TextureSource } from "pixi.js";
import { Position, VelocityDirection } from "./types";
import { getRandomDirection } from "./utils/random-dir";
import { mod } from "./utils/modulo";
import { useTick } from "@pixi/react";
import { hashPos } from "./utils/hash-position";
import { FoodClass } from "./Food";
import { food, game, GameClass, GameSingleton, snake } from "./Game";
import { InputClass, InputSingleton, Key } from "./Input";

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
	game: GameClass;
	input: InputClass;
	constructor() {
		this.game = GameSingleton.getInstance();
		this.input = InputSingleton.getInstance();
		this.buffer[0] = getRandomPosition();
		this.occupancy.add(hashPos(this.buffer[0]));
	}
	set headRef(ref: SpritePixi) {
		this.refs.push(ref);
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
	grow() {
		const sprite = new SpritePixi();
		loadBodyTexture().then((texture) => (sprite.texture = texture));
		const body = this.body(mod(this.headIdx - 1, CELL_NUM));
		sprite.x = body.x * CELL_SIZE;
		sprite.y = body.y * CELL_SIZE;
		sprite.width = CELL_SIZE;
		sprite.height = CELL_SIZE;
		this.game.addChild(sprite);
		this.length++;
		this.refs.push(sprite);
	}
	move(food: FoodClass) {
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
		this.occupancy.add(hashPos(newHead));
		if (this.collided(food.position)) {
			food.spawn(this);
			this.grow();
		} else {
			this.occupancy.delete(hashPos(this.buffer[this.tailIdx]));
			this.tailIdx = mod(this.tailIdx + 1, CELL_NUM);
		}
		this.update();
	}
	changeDir() {
		const keys = this.input.take().filter((k) => k !== dirToKey(this.dir) && k !== Key.Space);
		if (keys.length === 0) return;
		const key = keys[0];
		const dir = keyToDir(key);
		if (dir !== null) this.dir = dir;
		const second = keys.at(1);
		if (second !== undefined) {
			this.input.push(second);
		}
	}
}

function dirToKey(dir: VelocityDirection): Key {
	if (dir.x === 1) return Key.Right;
	if (dir.x === -1) return Key.Left;
	if (dir.y === 1) return Key.Down;
	return Key.Up;
}
function keyToDir(key: Key): VelocityDirection | null {
	switch (key) {
		case Key.Down:
			return { x: 0, y: 1 };
		case Key.Up:
			return { x: 0, y: -1 };
		case Key.Left:
			return { x: -1, y: 0 };
		case Key.Right:
			return { x: 1, y: 0 };
	}
	return null;
}

export class SnakeSingleton {
	private static snake: SnakeClass | null = null;
	static getInstance() {
		if (this.snake === null) {
			this.snake = new SnakeClass();
		}
		return this.snake;
	}
}

export function Snake() {
	const dt = useRef(0);
	const head = snake.body(0);
	useTick((ticker) => {
		if (food.position === null || game.status !== "start") return;
		dt.current += ticker.deltaTime;
		if (dt.current > game.interval) {
			dt.current -= game.interval;
			snake.changeDir();
			snake.move(food);
		}
	});
	return (
		<Sprite
			ref={(e) => {
				snake.headRef = e!;
			}}
			width={CELL_SIZE}
			height={CELL_SIZE}
			x={head.x * CELL_SIZE}
			y={head.y * CELL_SIZE}
			load={loadHeadTexture()}
		/>
	);
}
