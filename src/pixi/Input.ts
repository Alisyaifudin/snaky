export enum Key {
	Up,
	Down,
	Left,
	Right,
	Space,
}

export class InputClass {
	private register: Key[] = [];
	private boundListener: ((e: KeyboardEvent) => void) | null = null;

	addEventListener() {
		if (this.boundListener) return; // Prevent duplicates

		this.boundListener = (e: KeyboardEvent) => {
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

		window.addEventListener("keydown", this.boundListener);
	}

	removeEventListener() {
		if (this.boundListener) {
			window.removeEventListener("keydown", this.boundListener);
			this.boundListener = null;
		}
	}

	push(key: Key) {
		if (this.register.includes(key)) return;
		this.register.push(key);
	}

	seek(): Key[] {
		return this.register;
	}
	take(): Key[] {
		const keys = this.register.slice();
		this.register = [];
		return keys;
	}
	filter(key: Key) {
		this.register = this.register.filter((k) => k !== key);
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
