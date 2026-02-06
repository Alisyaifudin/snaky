import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "./components/ui/button";
import { useGame } from "./pixi/Game/use-game";
import { transition } from "./utils/game-transition";
import { Key } from "./pixi/Input";

const label = {
	pause: "Start",
	start: "Pause",
	over: "Reset",
} as const;

export function Control() {
	const { game, input } = useGame();
	return (
		<div id="control" className="flex flex-col gap-2">
			<div className="flex justify-between items-center gap-1">
				<Button onClick={transition[game.status]}>{label[game.status]}</Button>
				<div className="flex  gap-2 items-center">
					<div className="p-2 bg-cyan-500">Skor Terbaik {game.highscore}</div>
					<span>Skor {game.score}</span>
				</div>
			</div>
			<div className="flex justify-center gap-1 items-center">
				<Button
					onClick={() => {
						input.push(Key.Left);
						setTimeout(() => {
							input.press = null;
						}, 200);
					}}
					size="icon"
					variant={input.press === Key.Left ? "default" : "secondary"}
				>
					<ChevronLeft />
				</Button>
				<div className="flex flex-col gap-1">
					<Button
						onClick={() => {
							input.push(Key.Up);
							setTimeout(() => {
								input.press = null;
							}, 200);
						}}
						className="h-12 w-9"
						variant={input.press === Key.Up ? "default" : "secondary"}
					>
						<ChevronUp />
					</Button>
					<Button
						onClick={() => {
							input.push(Key.Down);
							setTimeout(() => {
								input.press = null;
							}, 200);
						}}
						className="h-12 w-9"
						variant={input.press === Key.Down ? "default" : "secondary"}
					>
						<ChevronDown />
					</Button>
				</div>
				<Button
					onClick={() => {
						input.push(Key.Right);
						setTimeout(() => {
							input.press = null;
						}, 200);
					}}
					size="icon"
					variant={input.press === Key.Right ? "default" : "secondary"}
				>
					<ChevronRight />
				</Button>
			</div>
		</div>
	);
}
