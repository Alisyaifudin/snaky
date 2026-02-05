/* eslint-disable react-refresh/only-export-components */
import { Snake, SnakeClass } from "./Snake";
import { Food, FoodClass } from "./Food";

export class GameClass {
	score = 1;
	interval = 30;
	cellSize = 20;
	screenSize = 600;
	status: "start" | "pause" | "over" = "pause";
	over() {
		this.status = "over";
	}
}

export const game = new GameClass();
export const snake = new SnakeClass(game);
export const food = new FoodClass();

type Listener = () => void;
const listeners: Set<Listener> = new Set()

function subscribe(callback: Listener) {
		
}
