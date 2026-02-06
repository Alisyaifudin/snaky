import { extend, useTick } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { SCREEN_SIZE } from "./constants";
import React, { useEffect, useRef, useState } from "react";
import { game, input } from "./Game";
import { Key } from "./Input";

extend({
	Container,
	Graphics,
});

interface Props {
	children?: React.ReactNode;
	borderColor?: number; // hex color, default 0x000000
	borderWidth?: number; // default 2
}

const transition = {
	start: "pause",
	over: "start",
	pause: "start",
} as const;

export function Screen({ children }: Props) {
	const root = useRef(document.getElementById("root")!);
	const ref = useRef<Container>(null);
	const [ready, setReady] = useState(false);
	const scale = root.current.clientWidth / SCREEN_SIZE;
	useEffect(() => {
		if (ref.current === null) return;
		setReady(true);
		game.container = ref.current;

		function resize() {
			const scale = root.current.clientWidth / SCREEN_SIZE;
			ref.current!.scale = scale;
		}
		window.addEventListener("resize", resize);
		input.addEventListener();

		return () => {
			window.removeEventListener("resize", resize);
			input.removeEventListener();
		};
	}, [ref]);
	useTick(() => {
		const keys = input.seek();
		if (keys.includes(Key.Space)) {
			input.take();
			game.status = transition[game.status];
		}
	});
	return (
		<pixiContainer ref={ref} width={SCREEN_SIZE} height={SCREEN_SIZE} scale={scale}>
			<Show when={ready}>{children}</Show>
		</pixiContainer>
	);
}

function Show({ children, when }: { children: React.ReactNode; when: boolean }) {
	if (!when) return null;
	return children;
}
