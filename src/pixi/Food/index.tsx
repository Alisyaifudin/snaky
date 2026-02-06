import { useEffect, useRef } from "react";
import { Sprite } from "../../components/sprite";
import { CELL_SIZE } from "../../utils/constants";
import { Assets, Texture, TextureSource } from "pixi.js";
import { food } from "./class";
import { snake } from "../Snake/class";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let foodTexture: Texture<TextureSource<any>>;

async function loadFoodTexture() {
	if (foodTexture === undefined) {
		foodTexture = await Assets.load("/assets/food.svg");
	}
	return foodTexture;
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
