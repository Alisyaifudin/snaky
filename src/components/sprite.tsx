import { forwardRef, useRef, useState, useImperativeHandle, useEffect } from "react";
import { extend, PixiReactElementProps, useTick } from "@pixi/react";
import { Texture } from "pixi.js";
import { Sprite as SpritePixi, Ticker } from "pixi.js";

interface Props extends PixiReactElementProps<typeof SpritePixi> {
	load: Promise<Texture>;
	tick?: (ticker: Ticker, sprite: SpritePixi) => void;
}
extend({
	Sprite: SpritePixi,
});

export const Sprite = forwardRef<SpritePixi, Props>(({ load, tick, ...props }, ref) => {
	const [texture, setTexture] = useState(Texture.EMPTY);
	const spriteRef = useRef<SpritePixi>(null);

	// 🎯 Expose the internal ref to the parent
	useImperativeHandle(ref, () => spriteRef.current!, []);

	// Preload the sprite
	useEffect(() => {
		if (texture === Texture.EMPTY) {
			load.then((result) => {
				setTexture(result);
			});
		}
	}, [texture, load]);

	useTick((e) => {
		tick?.(e, spriteRef.current!);
	});

	return <pixiSprite ref={spriteRef} texture={texture} {...props} />;
});
