import { food } from "@/pixi/Food/class";
import { game } from "@/pixi/Game/class";
import { snake } from "@/pixi/Snake/class";

export const transition = {
	pause: () => game.resume(),
	start: () => game.pause(),
	over: () => {
		game.reset();
		snake.reset();
		food.reset(snake);
	},
} as const;
