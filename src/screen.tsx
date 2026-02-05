import { extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { SCREEN_SIZE } from "./constants";
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
	const root = useRef(document.getElementById("root")!);
	const ref = useRef<Container>(null);
	const scale = root.current.clientWidth / SCREEN_SIZE;
	useEffect(() => {
		function resize() {
			const scale = root.current.clientWidth / SCREEN_SIZE;
			ref.current!.scale = scale;
		}
		window.addEventListener("resize", resize);
		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);
	console.log(scale);
	return (
		<pixiContainer ref={ref} width={SCREEN_SIZE} height={SCREEN_SIZE} scale={scale}>
			{children}
		</pixiContainer>
	);
}
