import { PixiApp } from "./components/pixi-app";
import { Screen } from "./Screen";
import { Control } from "./Control";
import { Game } from "./pixi/Game";

export default function App() {
	return (
		<main className="flex h-screen justify-between flex-col gap-1">
			<PixiApp>
				<Screen>
					<Game />
				</Screen>
			</PixiApp>
			<Control />
		</main>
	);
}
