import { PixiApp } from "./pixi-app";
import { Screen } from "./Screen";
import { Control } from "./Control";
import { Snake } from "./Snake";
import { Food } from "./Food";

export default function App() {
	return (
		<main className="flex flex-col gap-1">
			<PixiApp>
				<Screen>
					<Snake />
					<Food />
				</Screen>
			</PixiApp>
			<Control />
		</main>
	);
}
