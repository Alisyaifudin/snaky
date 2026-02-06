import { getRandomPosition } from "@/utils/random-position";
import { CELL_NUM, CELL_SIZE, GRID_NUM } from "../../utils/constants";
import { Assets, Sprite, Texture, TextureSource } from "pixi.js";
import { Position, VelocityDirection } from "../../types";
import { getRandomDirection } from "../../utils/random-dir";
import { mod } from "../../utils/modulo";
import { Key } from "../Input";
import { FoodClass } from "../Food/class";
import { GameClass } from "../Game/class";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bodyTexture: Texture<TextureSource<any>>;

async function loadBodyTexture() {
	if (bodyTexture === undefined) {
		bodyTexture = await Assets.load("/assets/snake-body.svg");
	}
	return bodyTexture;
}

export class SnakeClass {
	buffer: Position[] = new Array(CELL_NUM);
	dir: VelocityDirection = { x: 1, y: 0 };
	headIdx = 0;
	tailIdx = 0;
	length = 1;
	refs: Sprite[] = [];
	constructor() {
		this.initialize();
	}
	initialize() {
		this.buffer[0] = getRandomPosition();
		this.dir = getRandomDirection();
		this.headIdx = 0;
		this.tailIdx = 0;
		this.length = 1;
		this.refs = this.refs.slice(0, 1);
	}
	set headRef(ref: Sprite) {
		this.refs.push(ref);
	}
	*iterBodies(): Generator<Position> {
		for (let i = 0; i < this.length; i++) {
			const idx = mod(this.headIdx - i, CELL_NUM);
			yield this.buffer[idx];
		}
	}
	collided(pos: Position): boolean {
		for (const body of this.iterBodies()) {
			if (body.x === pos.x && body.y === pos.y) return true;
		}
		return false;
	}
	body(i: number) {
		const idx = mod(this.headIdx - i, CELL_NUM);
		return this.buffer[idx];
	}
	render() {
		this.refs.forEach((ref, i) => {
			const body = this.body(i);
			ref.x = body.x * CELL_SIZE;
			ref.y = body.y * CELL_SIZE;
		});
	}
	grow(game: GameClass) {
		const sprite = new Sprite();
		loadBodyTexture().then((texture) => (sprite.texture = texture));
		const body = this.body(mod(this.headIdx - 1, CELL_NUM));
		sprite.x = body.x * CELL_SIZE;
		sprite.y = body.y * CELL_SIZE;
		sprite.width = CELL_SIZE;
		sprite.height = CELL_SIZE;
		game.addChild(sprite);
		this.length++;
		this.refs.push(sprite);
	}
	move({
		food,
		game
	}: {
		food: FoodClass;
		game: GameClass
	}) {
		if (food.position === null) return;
		const head = this.buffer[this.headIdx];
		const newHead = {
			x: mod(head.x + this.dir.x, GRID_NUM),
			y: mod(head.y + this.dir.y, GRID_NUM),
		};
		if (this.collided(newHead)) {
			game.over()
			return;
		}
		this.headIdx = mod(this.headIdx + 1, CELL_NUM);
		this.buffer[this.headIdx] = newHead;
		if (this.collided(food.position)) {
			food.spawn(this);
			this.grow(game);
		} else {
			this.tailIdx = mod(this.tailIdx + 1, CELL_NUM);
		}
		this.render();
	}
	changeDir(input: { take: () => Key[]; push: (key: Key) => void }) {
		const currentKey = dirToKey(this.dir);
		const keys = input
			.take()
			.filter((k) => k !== Key.Space)
			.filter((k) => k !== currentKey)
			.filter((k) => k !== oppositeDir(currentKey));
		if (keys.length === 0) return;
		const key = keys[0];
		const dir = keyToDir(key);
		if (dir !== null) this.dir = dir;
		const second = keys.at(1);
		if (second !== undefined) {
			input.push(second);
		}
	}
	reset() {
		this.initialize();
		this.render();
	}
}

function oppositeDir(key: Key): Key {
	switch (key) {
		case Key.Up:
			return Key.Down;
		case Key.Down:
			return Key.Up;
		case Key.Left:
			return Key.Right;
		case Key.Right:
			return Key.Left;
	}
	return key;
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

export const snake = SnakeSingleton.getInstance();
