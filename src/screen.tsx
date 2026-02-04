import { extend, useTick } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { COLORS, SCREEN_SIZE } from "./constants";
import { useEffect, useRef } from "react";

extend({
	Container,
	Graphics,
});

interface Props {
	children?: React.ReactNode;
	borderColor?: number; // hex color, default 0x000000
	borderWidth?: number; // default 2
}

export function Screen({ children }: Props) {
	const ref = useRef<Graphics>(null);
	const width = Math.min(SCREEN_SIZE, window.innerWidth);
	const ratio = width / SCREEN_SIZE;
	useEffect(() => {
		function resize() {
			const width = Math.min(SCREEN_SIZE, window.innerWidth);
			const ratio = width / SCREEN_SIZE;
			ref.current!.scale = ratio;
		}
		window.addEventListener("resize", resize);
	}, []);
	return (
		<pixiGraphics
			width={SCREEN_SIZE}
			height={SCREEN_SIZE}
			ref={ref}
			// draw={(g) => {
			// 	if (ref.current === null) return;
			// 	g.clear();

			// 	g.rect(0, 0, ref.current!.width, ref.current!.height).fill({ color: COLORS.SCREEN });
			// }}
		>
			{children}
		</pixiGraphics>
	);
}
