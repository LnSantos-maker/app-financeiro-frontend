import { motion, useSpring, useTransform, useVelocity } from "framer-motion";
import { windowOpacity, easeRange } from "./choreography";

/** Velocity blur approximation, confined to the decorative scene. Never blurs controls. */
export default function ScrollOptics({ progress, reduced, children }) {
	const velocity = useVelocity(progress);
	const inertia = useSpring(velocity, {
		stiffness: 160,
		damping: 26,
		mass: 0.6,
	});
	const filter = useTransform(() => {
		const p = progress.get();
		const blur = reduced ? 0 : Math.min(3.5, Math.abs(inertia.get()) * 9);
		// Darken the physical scene only while typography occupies its centre.
		const brightness = reduced
			? 1
			: 1 - windowOpacity(p, 0.2, 0.46) * 0.6 - easeRange(p, 0.79, 0.88) * 0.62;
		return `blur(${blur}px) brightness(${brightness})`;
	});
	return (
		<motion.div className="experience-object" style={{ filter }}>
			{children}
		</motion.div>
	);
}
