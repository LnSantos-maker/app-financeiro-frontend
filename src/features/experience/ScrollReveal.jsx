import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { easeRange } from "./choreography";

export default function ScrollReveal({
	container,
	reduced,
	className,
	id,
	children,
}) {
	const target = useRef(null);
	const { scrollYProgress } = useScroll({
		container,
		target,
		offset: ["start end", "center center"],
	});
	const y = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : (1 - easeRange(v, 0.05, 0.9)) * 70,
	);
	const opacity = useTransform(scrollYProgress, (v) =>
		reduced ? 1 : 0.25 + easeRange(v, 0, 0.7) * 0.75,
	);
	return (
		<motion.section ref={target} className={className} id={id}>
			<motion.div className="section-reveal-content" style={{ y, opacity }}>
				{children}
			</motion.div>
		</motion.section>
	);
}
