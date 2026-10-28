import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { easeRange } from "./choreography";

/** A typographic hinge between the instrument and the three everyday tasks. */
export default function ChapterBridge({ container, reduced }) {
	const target = useRef(null);
	const { scrollYProgress } = useScroll({
		container,
		target,
		offset: ["start end", "end start"],
	});
	const x = useTransform(scrollYProgress, (v) =>
		reduced ? "0%" : `${22 - v * 42}%`,
	);
	const secondX = useTransform(scrollYProgress, (v) =>
		reduced ? "0%" : `${-35 + v * 40}%`,
	);
	const circleScale = useTransform(scrollYProgress, (v) =>
		reduced ? 1 : 0.5 + easeRange(v, 0.1, 0.8) * 1.2,
	);
	return (
		<section
			className="chapter-bridge"
			ref={target}
			aria-label="Receber, escolher, reservar"
		>
			<motion.div
				className="bridge-orbit"
				style={{ scale: circleScale }}
				aria-hidden="true"
			>
				<i />
				<i />
			</motion.div>
			<div aria-hidden="true" className="bridge-type">
				<motion.p style={{ x }}>
					RECEBER <em>ESCOLHER</em>
				</motion.p>
				<motion.p style={{ x: secondX }}>
					<em>RESERVAR</em> REPETIR
				</motion.p>
			</div>
			<p className="bridge-caption">
				<span>UM MÊS VÁRIOS MOVIMENTOS</span>É a relação entre eles que muda
				seus planos
			</p>
		</section>
	);
}
