import { useTick } from "@pixi/react";
import { transition } from "@/utils/game-transition";
import { Snake } from "../Snake";
import { Food } from "../Food";
import { input, Key } from "../Input";
import { game } from "./class";
import { useEffect } from "react";

export function Game() {
	useTick(() => {
		const keys = input.seek();
		if (keys.includes(Key.Space)) {
			input.take();
			transition[game.status]();
		}
	});
	useEffect(() => {
		input.addEventListener();
		return () => {
			input.removeEventListener();
		};
	}, []);
	return (
		<>
			<Snake />
			<Food />
		</>
	);
}
