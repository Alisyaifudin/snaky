// const BunnySprite = () => {
// 	const { app } = useApplication();

import { PixiApp } from "./pixi-app";

// 	return (
// 		<Sprite
// 			x={app.screen.width / 2}
// 			y={app.screen.height / 2}
// 			anchor={0.5}
// 			load={Assets.load("/assets/bunny.png")}
// 			tick={(ticker, ref) => {
// 				ref.rotation += 0.1 * ticker.deltaTime;
// 			}}
// 		/>
// 	);
// };

export default function App() {
	return (
		<main>
			<PixiApp />
			<button>uwu</button>
		</main>
	);
}
