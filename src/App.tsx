import { PixiApp } from "./pixi-app";
import { Game } from "./Game";
import { Screen } from "./screen";

export default function App() {
	return (
		<main>
			<PixiApp>
				<Screen>
					<Snake game={game} snake={snake} food={food} />
					<Food />
				</Screen>
				<Control />
			</PixiApp>
		</main>
	);
}
