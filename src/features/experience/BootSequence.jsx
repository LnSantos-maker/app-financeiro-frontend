import { motion } from "framer-motion";
import BrandMark from "../../components/ui/BrandMark";
export default function BootSequence({
	phase,
	ready,
	onPresented,
	onSkip,
	reduced,
}) {
	return (
		<motion.div
			className="experience-boot brand-boot"
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: reduced ? 0.1 : 0.55 }}
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: reduced ? 0 : 0.3 }}
				onAnimationComplete={onPresented}
			>
				<BrandMark />
			</motion.div>
			<div className="brand-readiness" data-ready={ready} />
			<span role="status">{ready ? "Pronto" : phase}</span>
			<button onClick={onSkip}>Continuar</button>
		</motion.div>
	);
}
