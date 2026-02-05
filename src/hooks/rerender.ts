import { useCallback, useState } from "react";

export function useRerender() {
	const [, s] = useState(0);
	const rerender = useCallback(() => {
		s((v) => v + 1);
	}, []);
	return rerender;
}
