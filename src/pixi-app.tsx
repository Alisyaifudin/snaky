import { Application } from "@pixi/react";
import { useRef } from "react";

export function PixiApp({ children }: { children: React.ReactNode }) {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<div id="root" ref={ref} className="w-full max-w-3xl aspect-square mx-auto relative">
			<Application
				background={"#1099bb"}
				resizeTo={ref} // Let Pixi handle it
				className="absolute inset-0 w-full h-full" // Force fill
			>
				{children}
			</Application>
		</div>
	);
}
