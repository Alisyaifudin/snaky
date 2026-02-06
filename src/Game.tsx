import { SnakeSingleton } from "./Snake";
import { FoodSingleton } from "./Food";
import { useSyncExternalStore } from "react";
import { Container, Sprite } from "pixi.js";
import { InputSingleton } from "./Input";

type Status = "start" | "pause" | "over";

export class GameClass {
	score = 1;
	interval = 30;
	cellSize = 20;
	screenSize = 600;
	private _status: Status = "pause";
	get status() {
		return this._status;
	}
	set status(s: Status) {
		this._status = s;
		notify();
	}

	private _container: Container | null = null;
	get container() {
		if (this._container === null) throw new Error("No container");
		return this._container;
	}
	set container(c: Container) {
		this._container = c;
	}
	over() {
		this.status = "over";
	}
	addChild(sprite: Sprite) {
		this.container.addChild(sprite);
		this.score++;
		this.interval = Math.max(10, this.interval * 0.9);
		notify();
	}
}

export class GameSingleton {
	private static game: GameClass | null = null;
	static getInstance() {
		if (this.game === null) {
			this.game = new GameClass();
		}
		return this.game;
	}
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
	snapshot = {
		game,
		snake,
		food,
		input,
	};
	for (const listener of listeners.values()) {
		listener();
	}
}

function subscribe(callback: Listener) {
	listeners.add(callback);
	return () => {
		listeners.delete(callback);
	};
}

export const game = GameSingleton.getInstance();
export const snake = SnakeSingleton.getInstance();
export const food = FoodSingleton.getInstance();
export const input = InputSingleton.getInstance();

let snapshot = {
	game,
	snake,
	food,
	input,
};

function getSnapshot() {
	return snapshot;
}

export function useGame() {
	const store = useSyncExternalStore(subscribe, getSnapshot);
	return store;
}
