import { BRAND_PATH } from "../../components/ui/brandGeometry";
import { useEffect, useRef } from "react";

export function VaultFallback() {
	return (
		<svg className="vault-fallback" viewBox="0 0 600 600" aria-hidden="true">
			<defs>
				<linearGradient id="vaultMetal" x1="0" y1="0" x2="1" y2="1">
					<stop stopColor="#f7faff" />
					<stop offset=".3" stopColor="#778ca8" />
					<stop offset=".5" stopColor="#dce6f3" />
					<stop offset="1" stopColor="#2c3849" />
				</linearGradient>
				<linearGradient id="vaultGlass">
					<stop stopColor="#d0e3f2" stopOpacity=".9" />
					<stop offset="1" stopColor="#9cb5d2" stopOpacity=".3" />
				</linearGradient>
			</defs>
			<g transform="translate(300 300) rotate(-12) skewY(10)">
				<rect
					x="-125"
					y="-180"
					width="260"
					height="330"
					rx="27"
					fill="#1a2230"
					stroke="#5a6c84"
					strokeWidth="8"
				/>
				<rect
					x="-85"
					y="-135"
					width="175"
					height="235"
					rx="10"
					fill="none"
					stroke="#f5532b"
					strokeWidth="9"
				/>
				<path
					d={BRAND_PATH} transform="translate(-135 -140) scale(5)"
					fill="#c9d5e4"
				/>
				<rect
					x="-155"
					y="-150"
					width="265"
					height="330"
					rx="27"
					fill="none"
					stroke="url(#vaultMetal)"
					strokeWidth="27"
				/>
				<rect
					x="-190"
					y="-115"
					width="270"
					height="330"
					rx="25"
					fill="none"
					stroke="url(#vaultGlass)"
					strokeWidth="30"
				/>
			</g>
		</svg>
	);
}

export default function FinancialSculpture({
	progress,
	pointer,
	reduced,
	enabled,
	paused = false,
	onReady,
	onPhase,
}) {
	const host = useRef(null);
	const pausedState = useRef(paused);
	useEffect(() => {
		pausedState.current = paused;
	}, [paused]);
	useEffect(() => {
		if (!enabled) {
			onReady();
			return;
		}
		let cancelled = false,
			dispose;
		onPhase("Carregando a cena");
		import("./createVaultScene")
			.then(({ createVaultScene }) => {
				if (cancelled) return;
				return createVaultScene(host.current, {
					progress,
					pointer,
					reduced,
					onPhase,
					paused: pausedState,
				});
			})
			.then((cleanup) => {
				if (cancelled) cleanup?.();
				else {
					dispose = cleanup;
					onReady();
				}
			})
			.catch(() => {
				if (!cancelled) {
					host.current.dataset.failed = "true";
					onReady();
				}
			});
		return () => {
			cancelled = true;
			dispose?.();
		};
	}, [enabled, progress, pointer, reduced, onReady, onPhase]);
	return (
		<div
			ref={host}
			className={`financial-sculpture ${enabled ? "" : "scene-static"}`}
		>
			<VaultFallback />
		</div>
	);
}
