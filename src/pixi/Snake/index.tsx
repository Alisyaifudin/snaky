import { useRef } from "react";
import { Sprite } from "../../components/sprite";
import { CELL_SIZE } from "../../utils/constants";
import { Assets, Texture, TextureSource } from "pixi.js";
import { useTick } from "@pixi/react";
import { snake } from "./class";
import { food } from "../Food/class";
import { game } from "../Game/class";
import { input } from "../Input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let headTexture: Texture<TextureSource<any>>;

async function loadHeadTexture() {
	if (headTexture === undefined) {
		headTexture = await Assets.load("/assets/snake-head.svg");
	}
	return headTexture;
}

export function Snake() {
	const dt = useRef(0);
	const head = snake.body(0);
	useTick((ticker) => {
		if (food.position === null || game.status !== "start") return;
		dt.current += ticker.deltaTime;
		if (dt.current > game.interval) {
			dt.current -= game.interval;
			snake.changeDir(input);
			snake.move({
				food,
				game,
			});
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
