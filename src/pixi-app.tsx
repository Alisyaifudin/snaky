import { Application, ApplicationRef } from "@pixi/react";
import { useRef } from "react";

export function PixiApp() {
	const ref = useRef<HTMLDivElement>(null);
	const appRef = useRef<ApplicationRef>(null);

	return (
		<div ref={ref} className="w-full max-w-3xl aspect-square mx-auto relative">
			<Application
				ref={appRef}
				background={"#1099bb"}
				resizeTo={ref} // Let Pixi handle it
				className="absolute inset-0 w-full h-full" // Force fill
			/>
		</div>
	);
}
