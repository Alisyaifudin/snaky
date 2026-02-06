import { Button } from "./components/ui/button";
import { useGame } from "./pixi/Game/use-game";
import { transition } from "./utils/game-transition";

const label = {
	pause: "Start",
	start: "Pause",
	over: "Reset",
} as const;

export function Control() {
	const { game } = useGame();
	return (
		<div id="control">
			<div className="flex justify-between items-center gap-1">
				<Button onClick={transition[game.status]}>{label[game.status]}</Button>
				<div className="flex  gap-2 items-center">
					<div className="p-2 bg-cyan-500">Skor Terbaik {game.highscore}</div>
					<span>Skor {game.score}</span>
				</div>
			</div>
		</div>
	);
}
