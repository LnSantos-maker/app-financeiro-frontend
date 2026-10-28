import BrandMark from "../../components/ui/BrandMark";
import { motion, useReducedMotion } from "framer-motion";
export default function AccountArrival({ onCovered }) {
	const reduced = useReducedMotion();
	return (
		<motion.div
			className="account-arrival"
			role="status"
			aria-label="Preparando sua conta"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			onAnimationComplete={(state) => {
				if (state.opacity === 1) onCovered?.();
			}}
			exit={{ opacity: 0, scale: reduced ? 1 : 1.025 }}
			transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
		>
			<BrandMark />
			<span className="sr-only">Preparando seu espaço</span>
		</motion.div>
	);
}
