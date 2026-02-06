import { useSyncExternalStore } from "react";
import { game } from "./class";
import { snake } from "../Snake/class";
import { food } from "../Food/class";
import { input } from "../Input";
import { Listener } from "@/types";

let snapshot = {
	game,
	snake,
	food,
	input,
};

const listeners: Set<Listener> = new Set();

const store = {
	getSnapshot() {
		return snapshot;
	},
	subscribe(callback: Listener) {
		listeners.add(callback);
		return () => {
			listeners.delete(callback);
		};
	},
	notify() {
		snapshot = { game, input, food, snake };
		for (const listener of listeners.values()) {
			listener();
		}
	},
};

game.addListener(store.notify);
input.addListener(store.notify);

export function useGame() {
	const s = useSyncExternalStore(store.subscribe, store.getSnapshot);
	return s;
}
