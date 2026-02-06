import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "./components/ui/button";
import { useGame } from "./pixi/Game/use-game";
import { transition } from "./utils/game-transition";
import { Key } from "./pixi/Input";
import { useEffect } from "react";

const label = {
	pause: "Start",
	start: "Pause",
	over: "Reset",
} as const;

export function Control() {
	const { game } = useGame();
	return (
		<div id="control" className="justify-between px-1 flex flex-col gap-2">
			<div className="flex justify-between items-center gap-1">
				<div className="flex  gap-2 items-center">
					<div>Score {game.score}</div>
					<div className="p-2 bg-red-500 rounded-md text-white">Highscore {game.highscore}</div>
				</div>
				<Button onClick={transition[game.status]}>{label[game.status]}</Button>
			</div>
			<Arrow></Arrow>
		</div>
	);
}

function Arrow() {
	const { input } = useGame();
	useEffect(() => {
		function resize() {
			const root = document.getElementById("root") as HTMLDivElement;
			const width = window.innerWidth;
			const height = window.innerHeight - root.clientHeight;
			const size = Math.min((width - 16) / 3, (height - 62) / 2);
			console.log("window", window.innerHeight);
			console.log("root", root.clientHeight);
			console.log({ width, height, size });
			const els = document.querySelectorAll<HTMLElement>(".btn");
			els.forEach((el) => {
				el.style.setProperty("width", size + "px");
				el.style.setProperty("height", size + "px");
			});
		}
		resize();
		window.addEventListener("resize", resize);
		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);
	return (
		<div id="arrow-btns" className="flex opacity-60 flex-1 justify-center gap-2 items-center">
			<Button
				onClick={() => {
					input.push(Key.Left);
					setTimeout(() => {
						input.press = null;
					}, 200);
				}}
				className="btn rounded-l-full"
				variant={input.press === Key.Left ? "default" : "secondary"}
			>
				<ChevronLeft className="w-full h-full aspect-square" />
			</Button>
			<div className="flex flex-col gap-2">
				<Button
					onClick={() => {
						input.push(Key.Up);
						setTimeout(() => {
							input.press = null;
						}, 200);
					}}
					className="btn rounded-t-full"
					variant={input.press === Key.Up ? "default" : "secondary"}
				>
					<ChevronUp className="w-full h-full aspect-square" />
				</Button>
				<Button
					onClick={() => {
						input.push(Key.Down);
						setTimeout(() => {
							input.press = null;
						}, 200);
					}}
					className="btn rounded-b-full"
					variant={input.press === Key.Down ? "default" : "secondary"}
				>
					<ChevronDown className="w-full h-full aspect-square" />
				</Button>
			</div>
			<Button
				onClick={() => {
					input.push(Key.Right);
					setTimeout(() => {
						input.press = null;
					}, 200);
				}}
				className="btn rounded-r-full "
				variant={input.press === Key.Right ? "default" : "secondary"}
			>
				<ChevronRight className="w-full h-full aspect-square" />
			</Button>
		</div>
	);
}
