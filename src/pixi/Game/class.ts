import { INITIAL_INTERVAL, MIN_INTERVAL } from "@/utils/constants";
import { Container, Sprite } from "pixi.js";

type Status = "start" | "pause" | "over";

type Listener = () => void;

export class GameClass {
	score = 0;
	interval = INITIAL_INTERVAL;
	private _status: Status = "pause";
	get status() {
		return this._status;
	}
	constructor() {
		this.initialize();
	}
	initialize() {
		for (const sprite of this.sprites) {
			this.container.removeChild(sprite);
		}
		this.sprites = [];
		this.interval = INITIAL_INTERVAL;
		this.score = 0;
	}
	private sprites: Sprite[] = [];
	private listeners: Listener[] = [];
	private notify = () => {
		this.listeners.forEach((listener) => listener());
	};
	clearListener() {
		this.listeners = [];
	}
	addListener(listener: Listener) {
		this.listeners.push(listener);
	}
	highscore = getHighscore();

	private _container: Container | null = null;
	get container() {
		if (this._container === null) throw new Error("No container");
		return this._container;
	}
	set container(c: Container) {
		this._container = c;
	}
	over() {
		this._status = "over";
		if (this.score > this.highscore) {
			this.highscore = this.score;
			setHighscore(this.score);
		}
		this.notify();
	}
	addChild(sprite: Sprite) {
		this.container.addChild(sprite);
		this.sprites.push(sprite);
		this.score++;
		this.interval = Math.max(MIN_INTERVAL, this.interval - 1);
		this.notify();
	}
	pause() {
		this._status = "pause";
		this.notify();
	}
	resume() {
		this._status = "start";
		this.notify();
	}
	reset() {
		this.initialize();
		this._status = "start";
		this.notify();
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

export const game = GameSingleton.getInstance();

function getHighscore() {
	const score = localStorage.getItem("SCORE");
	if (score === null) return 0;
	const num = Number(score);
	if (isNaN(num) || !isFinite(num)) {
		localStorage.removeItem("SCORE");
		return 0;
	}
	return num;
}

function setHighscore(score: number) {
	localStorage.setItem("SCORE", score.toString());
}
