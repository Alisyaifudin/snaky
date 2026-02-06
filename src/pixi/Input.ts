import { Listener } from "@/types";

export enum Key {
	Up,
	Down,
	Left,
	Right,
	Space,
}

export class InputClass {
	private register: Key[] = [];
	private keydownListener: ((e: KeyboardEvent) => void) | null = null;
	private keyupListener: ((e: KeyboardEvent) => void) | null = null;

	private listeners: Listener[] = [];
	private notify = () => {
		this.listeners.forEach((listener) => listener());
	};
	clearListener() {
		this.listeners = [];
	}
	addListener(listener: Listener) {
		this.listeners.push(listener);
	}
	private _press: null | Key = null;
	get press() {
		return this._press;
	}
	set press(p: Key | null) {
		this._press = p;
		this.notify();
	}
	private addKeyup() {
		if (this.keyupListener) return; // Prevent duplicates
		this.keyupListener = () => {
			this.press = null;
		};
		window.addEventListener("keyup", this.keyupListener);
	}
	private addKeydown() {
		if (this.keydownListener) return; // Prevent duplicates

		this.keydownListener = (e: KeyboardEvent) => {
			let k: Key | undefined;
			switch (e.key) {
				case "ArrowUp":
					k = Key.Up;
					break;
				case "ArrowDown":
					k = Key.Down;
					break;
				case "ArrowLeft":
					k = Key.Left;
					break;
				case "ArrowRight":
					k = Key.Right;
					break;
				case " ":
					k = Key.Space;
					break;
			}
			if (k !== undefined) {
				this.push(k);
			}
		};

		window.addEventListener("keydown", this.keydownListener);
	}
	addEventListener() {
		this.addKeydown();
		this.addKeyup();
	}

	removeEventListener() {
		if (this.keydownListener) {
			window.removeEventListener("keydown", this.keydownListener);
			this.keydownListener = null;
		}
		if (this.keyupListener) {
			window.removeEventListener("keydown", this.keyupListener);
			this.keyupListener = null;
		}
	}

	push(key: Key) {
		if (this.register.includes(key)) return;
		this.press = key;
		this.register.push(key);
		this.notify();
	}

	seek(): Key[] {
		return this.register;
	}
	take(): Key[] {
		const keys = this.register.slice();
		this.register = [];
		return keys;
	}
}

export class InputSingleton {
	private static input: null | InputClass = null;
	static getInstance() {
		if (this.input === null) {
			this.input = new InputClass();
		}
		return this.input;
	}
}

export const input = InputSingleton.getInstance();
