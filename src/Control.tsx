import { Button } from "./components/ui/button";
import { useGame } from "./Game";

const label = {
	pause: "Pause",
	start: "Start",
	over: "Reset",
} as const;

const transition = {
	pause: "start",
	start: "pause",
	over: "start",
} as const;

export function Control() {
	const { game } = useGame();
	return (
		<div id="control">
			<div className="flex items-center gap-1">
				<Button
					onClick={() => {
						game.status = transition[game.status];
					}}
				>
					{label[game.status]}
				</Button>
				<span>Skor {game.score}</span>
			</div>
		</div>
	);
}
