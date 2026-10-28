import { useEffect, useRef, useState } from "react";
export default function PhysicalArtifact({
	index,
	progress,
	reduced,
	children,
}) {
	const host = useRef(null);
	const [ready, setReady] = useState(false);
	useEffect(() => {
		let cancelled = false,
			dispose;
		import("./artifactScene")
			.then((m) =>
				cancelled
					? null
					: m.createArtifact(host.current, { index, progress, reduced }),
			)
			.then((clean) => {
				if (cancelled) clean?.();
				else if (clean) {
					dispose = clean;
					setReady(true);
				}
			})
			.catch(() => {});
		return () => {
			cancelled = true;
			dispose?.();
		};
	}, [index, progress, reduced]);
	return (
		<div className="physical-artifact" data-ready={ready}>
			<div
				className="artifact-render"
				ref={host}
				tabIndex={0}
				role="img"
				aria-label="Peça tridimensional Arraste horizontalmente ou use as setas para girar"
			/>
			<div className="artifact-poster" aria-hidden="true">
				{children}
			</div>
			<span className="artifact-hint">
				ARRASTE PARA GIRAR <span>↔</span>
			</span>
		</div>
	);
}
