import { useRef, useState, useCallback } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import {
	motion,
	MotionConfig,
	AnimatePresence,
	useScroll,
	useTransform,
	useReducedMotion,
	useMotionValueEvent,
} from "framer-motion";
import Brand from "./ui/Brand";
import FinancialSculpture from "../features/experience/FinancialSculpture";
import BootSequence from "../features/experience/BootSequence";
import "../styles/experience.css";
import "../styles/cinematic.css";
import ProductStudy from "../features/experience/ProductStudy";
import ScrollReveal from "../features/experience/ScrollReveal";

import ScrollOptics from "../features/experience/ScrollOptics";
import { easeRange, windowOpacity } from "../features/experience/choreography";

const chapters = [
	{
		id: "01",
		name: "ENXERGAR",
		title: (
			<>
				Acompanhe
				<br />o seu mês
				<br />
				<span>sem fazer contas</span>
			</>
		),
		description:
			"Receitas, cartões, contas a pagar Coloque cada movimento no lugar e entenda quanto realmente está disponível",
		tags: ["Saldo disponível", "Extrato", "Agenda de pagamentos"],
	},
	{
		id: "02",
		name: "ESCOLHER",
		title: (
			<>
				Veja para onde
				<br />
				vai cada parte
				<br />
				<span>do seu dinheiro</span>
			</>
		),
		description:
			"Separe o essencial, o que faz parte da sua vida e o que constrói seu futuro Distribua seu dinheiro com intenção",
		tags: ["Categorias", "Orçamentos", "Benefícios"],
	},
	{
		id: "03",
		name: "CONSTRUIR",
		title: (
			<>
				Escolha uma meta
				<br />e acompanhe
				<br />
				<span>cada aporte</span>
			</>
		),
		description:
			"Uma viagem, uma reserva, um projeto seu Crie um cofre, defina um objetivo e acompanhe cada aporte",
		tags: ["Cofres", "Objetivos", "Aportes"],
	},
];

export default function LandingPage({
	onLogin,
	onRegister,
	scenePaused = false,
}) {
	const container = useRef(null),
		journey = useRef(null),
		pointer = useRef({ x: 0, y: 0 });
	const prefersReduced = useReducedMotion();
	const [motionPreference, setMotionPreference] = useState(() => {
			try {
				return localStorage.getItem("nexus.motion") || "system";
			} catch {
				return "system";
			}
		}),
		[prepared, setPrepared] = useState(false),
		[phase, setPhase] = useState("Preparando sua perspectiva");
	const enabled = motionPreference !== "reduced";
	const reduced =
		!enabled || (motionPreference !== "full" && Boolean(prefersReduced));
	const [introFinished, setIntroFinished] = useState(
		() => sessionStorage.getItem("nexus.opened") === "true",
	);
	const presented = prepared && (reduced || introFinished);
	const setMotion = (preference) => {
		setMotionPreference(preference);
		try {
			localStorage.setItem("nexus.motion", preference);
		} catch {
			/* Private mode can deny storage. */
		}
	};
	const replay = () => {
		setMotion("full");
		setIntroFinished(false);
		container.current?.scrollTo({ top: 0, behavior: "instant" });
	};
	const { scrollYProgress } = useScroll({
		container,
		target: journey,
		offset: ["start start", "end end"],
	});
	// Function mapping keeps the text on the same JS progress clock as the 3D scene.
	const heroOpacity = useTransform(scrollYProgress, (value) =>
		reduced ? 1 : Math.max(0, Math.min(1, (0.2 - value) / 0.12)),
	);
	const heroY = useTransform(
		scrollYProgress,
		[0, 0.22],
		[0, reduced ? 0 : -180],
	);
	const secondOpacity = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : windowOpacity(v, 0.46, 0.78),
	);
	const secondY = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : (1 - easeRange(v, 0.46, 0.57)) * 100,
	);
	const wordY = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : -easeRange(v, 0, 0.3) * 240,
	);
	const wordScale = useTransform(scrollYProgress, (v) =>
		reduced ? 1 : 1 + easeRange(v, 0, 0.3) * 0.65,
	);
	const wordOpacity = useTransform(scrollYProgress, (v) =>
		reduced ? 1 : 1 - easeRange(v, 0.12, 0.28),
	);
	const passageOpacity = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : windowOpacity(v, 0.2, 0.46),
	);
	const passageScale = useTransform(scrollYProgress, (v) =>
		reduced ? 1 : 0.75 + easeRange(v, 0.2, 0.46) * 0.5,
	);
	const resolveOpacity = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : easeRange(v, 0.79, 0.88),
	);
	const resolveScale = useTransform(scrollYProgress, (v) =>
		reduced ? 1 : 0.8 + easeRange(v, 0.78, 1) * 0.2,
	);
	const stageOpacity = useTransform(scrollYProgress, (v) =>
		reduced ? 1 : 1 - easeRange(v, 0.94, 1),
	);
	const stageY = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : -easeRange(v, 0.88, 1) * 70,
	);
	const [act, setAct] = useState(0);
	const actRef = useRef(0);
	const [heroActive, setHeroActive] = useState(true);
	const heroActiveRef = useRef(true);
	useMotionValueEvent(scrollYProgress, "change", (value) => {
		const active = value < 0.22;
		const next = value < 0.2 ? 0 : value < 0.46 ? 1 : value < 0.79 ? 2 : 3;
		if (next !== actRef.current) {
			actRef.current = next;
			setAct(next);
		}
		if (active !== heroActiveRef.current) {
			heroActiveRef.current = active;
			setHeroActive(active);
		}
	});
	const ready = useCallback(() => {
		document.fonts
			.load("500 16px Archivo")
			.catch(() => {})
			.finally(() => setPrepared(true));
	}, []);
	const changePhase = useCallback((text) => setPhase(text), []);
	const skip = () => {
		if (!prepared) {
			setMotion("reduced");
			setPrepared(true);
		}
		setIntroFinished(true);
	};
	const updatePointer = (event) => {
		if (reduced) return;
		const rect = event.currentTarget.getBoundingClientRect();
		pointer.current = {
			x: (event.clientX - rect.left) / rect.width - 0.5,
			y: (event.clientY - rect.top) / rect.height - 0.5,
		};
	};
	return (
		<MotionConfig
			reducedMotion={motionPreference === "full" ? "never" : "user"}
		>
			<div
				className="experience-scroll"
				ref={container}
				data-prepared={prepared}
				data-motion={enabled && !reduced ? "full" : "reduced"}
				data-act={act}
				data-presented={presented}
				onPointerMove={updatePointer}
				onPointerLeave={() => {
					pointer.current = { x: 0, y: 0 };
				}}
			>
				<header className="experience-nav">
					<a href="#inicio" aria-label="NEXUS — início">
						<Brand />
					</a>
					<a className="experience-nav-link" href="#perspectivas">
						Uma nova perspectiva <span>↘</span>
					</a>

					<button onClick={onLogin} className="experience-login">
						Acessar conta <ArrowUpRight size={16} />
					</button>
				</header>
				<main>
					<section className="experience-journey" ref={journey} id="inicio">
						<motion.div
							className="experience-stage"
							style={{ opacity: stageOpacity, y: stageY }}
						>
							<div className="stage-grid" aria-hidden="true" />
							<motion.div
								className="experience-word"
								style={{ y: wordY, scale: wordScale, opacity: wordOpacity }}
								aria-hidden="true"
							>
								NEXUS
							</motion.div>
							<ScrollOptics
								progress={scrollYProgress}
								reduced={Boolean(reduced) || !enabled}
							>
								<FinancialSculpture
									progress={scrollYProgress}
									pointer={pointer}
									reduced={Boolean(reduced) || !enabled}
									enabled={enabled}
									paused={scenePaused}
									onReady={ready}
									onPhase={changePhase}
								/>
							</ScrollOptics>
							<motion.div
								className="experience-hero-copy"
								inert={!heroActive && !reduced}
								style={{ opacity: heroOpacity, y: heroY }}
							>
								<span className="experience-kicker">
									<span /> FINANÇAS PESSOAIS
								</span>
								<h1 aria-label="Seu próximo movimento">
									<span className="type-mask" aria-hidden="true">
										<motion.span
											initial={{ y: "110%", rotate: 4 }}
											animate={presented ? { y: 0, rotate: 0 } : {}}
											transition={{
												duration: reduced ? 0 : 1,
												ease: [0.22, 1, 0.36, 1],
											}}
										>
											Seu próximo
										</motion.span>
									</span>
									<span className="type-mask" aria-hidden="true">
										<motion.em
											initial={{ y: "110%", rotate: 4 }}
											animate={presented ? { y: 0, rotate: 0 } : {}}
											transition={{
												duration: reduced ? 0 : 1.2,
												delay: reduced ? 0 : 0.1,
												ease: [0.22, 1, 0.36, 1],
											}}
										>
											movimento
										</motion.em>
									</span>
								</h1>
								<p>
									Contas, cartões e metas em um só lugar
									<br />
									<strong>
										Acompanhe seu saldo e planeje os próximos meses
									</strong>
								</p>
								<button className="experience-cta" onClick={onRegister}>
									Organizar minhas finanças <ArrowUpRight size={19} />
								</button>
							</motion.div>
							<motion.div
								className="experience-second-copy"
								style={{ opacity: secondOpacity, y: secondY }}
							>
								<span className="experience-kicker">ENTENDA SEUS GASTOS</span>
								<h2>
									Por trás de
									<br />
									cada número,
									<br />
									<em>uma escolha</em>
								</h2>
								<p>
									A NEXUS conecta o dinheiro de hoje
									<br />
									aos planos que merecem sair do papel
								</p>
							</motion.div>
							<motion.div
								className="passage-copy"
								style={{ opacity: passageOpacity, scale: passageScale }}
								aria-hidden="true"
							>
								<span>01 / ENTRE NO SEU PLANEJAMENTO</span>
								<strong>
									CADA
									<br />
									<em>ESCOLHA</em>
								</strong>
								<small>move o todo</small>
							</motion.div>
							<motion.div
								className="resolve-copy"
								style={{ opacity: resolveOpacity, scale: resolveScale }}
								aria-hidden="true"
							>
								<span>03 / ENCONTRE SUA DIREÇÃO</span>
								<strong>
									O AGORA
									<br />
									<em>O DEPOIS</em>
								</strong>
								<p>Conectados por você</p>
							</motion.div>
							<div className="scene-coordinate" aria-hidden="true">
								<span>N / {["01", "02", "03", "04"][act]}</span>
								<span>
									{
										[
											"VISÃO GERAL",
											"CADA ESCOLHA",
											"CADA CAMADA",
											"UMA DIREÇÃO",
										][act]
									}
								</span>
							</div>
							<div className="scene-reticle" aria-hidden="true">
								<i />
								<i />
								<i />
								<i />
							</div>
							<div className="object-annotation" aria-hidden="true">
								<span className="annotation-cross">+</span>
								<span>
									NXS—001
									<br />
									RECEITAS / ESCOLHAS / OBJETIVOS
								</span>
								<i />
							</div>
							<div className="experience-stage-footer">
								<a href="#perspectivas">
									<ArrowDown size={16} /> Role para explorar
								</a>
								<button
									onClick={() => {
										if (reduced) replay();
										else setMotion("reduced");
										setPrepared(true);
									}}
									aria-pressed={!reduced}
								>
									{reduced
										? "Ativar experiência completa"
										: "Reduzir movimento"}{" "}
									<span
										className={!reduced ? "motion-dot enabled" : "motion-dot"}
									/>
								</button>
								<span>PLANEJAMENTO / SEM PONTAS SOLTAS</span>
							</div>
							<AnimatePresence>
								{!presented && (
									<BootSequence
										phase={phase}
										ready={prepared}
										onPresented={() => {
											setIntroFinished(true);
											sessionStorage.setItem("nexus.opened", "true");
										}}
										onSkip={skip}
										reduced={reduced}
									/>
								)}
							</AnimatePresence>
							<motion.div
								className="journey-progress"
								style={{ scaleX: scrollYProgress }}
							/>
						</motion.div>
					</section>

					<ScrollReveal
						className="perspective-intro"
						id="perspectivas"
						container={container}
						reduced={reduced}
					>
						<span className="experience-kicker">COMO FUNCIONA / 01—03</span>
						<h2>
							Todas as suas contas
							<br />
							<span>na mesma visão</span>
						</h2>
						<p>
							Consulte saldos, pagamentos e cartões
							<br />
							sem alternar entre várias planilhas
						</p>
					</ScrollReveal>
					<div className="perspective-chapters">
						{chapters.map((chapter, index) => (
							<Chapter
								key={chapter.id}
								chapter={chapter}
								index={index}
								container={container}
								reduced={reduced}
							/>
						))}
					</div>
					<ScrollReveal
						className="experience-finale"
						container={container}
						reduced={reduced}
					>
						<span className="experience-kicker">SUA CONTA NEXUS</span>
						<h2>
							Comece pelo
							<br />
							<em>seu mês</em>
							<ArrowUpRight aria-hidden="true" />
						</h2>
						<div>
							<p>
								Crie sua conta e registre seus primeiros movimentos
								<br />
								Acompanhe receitas, despesas e metas no mesmo painel
							</p>
							<button className="experience-cta" onClick={onRegister}>
								Criar minha conta <ArrowUpRight size={20} />
							</button>
						</div>
					</ScrollReveal>
				</main>
				<footer className="experience-footer">
					<Brand />
					<span>Seu controle financeiro</span>
					<a href="#inicio">Voltar ao início ↑</a>
				</footer>
			</div>
		</MotionConfig>
	);
}

function Chapter({ chapter, index, container, reduced }) {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		container,
		target: ref,
		offset: ["start end", "end start"],
	});
	const assembly = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : 1 - easeRange(v, 0.12, 0.48),
	);
	const scale = useTransform(scrollYProgress, (v) =>
		reduced ? 1 : 0.82 + easeRange(v, 0.08, 0.5) * 0.18,
	);
	const clipPath = useTransform(scrollYProgress, (v) =>
		reduced
			? "inset(0%)"
			: `inset(${(1 - easeRange(v, 0.04, 0.38)) * 16}% ${(1 - easeRange(v, 0.04, 0.4)) * 8}% 0%)`,
	);
	const copyY = useTransform(scrollYProgress, (v) =>
		reduced ? 0 : (1 - easeRange(v, 0.08, 0.4)) * 140,
	);
	const y = useTransform(
		scrollYProgress,
		[0, 1],
		[reduced ? 0 : 100, reduced ? 0 : -60],
	);
	return (
		<section ref={ref} className={`perspective-chapter chapter-${index}`}>
			<div className="chapter-index">
				<span>{chapter.id}</span>
				<span>{chapter.name}</span>
			</div>
			<motion.div className="chapter-content" style={{ y: copyY }}>
				<h3>{chapter.title}</h3>
				<p>{chapter.description}</p>
				<div className="chapter-tags">
					{chapter.tags.map((tag) => (
						<span key={tag}>{tag}</span>
					))}
				</div>
			</motion.div>
			<motion.div
				className="chapter-art"
				style={{ y, scale, clipPath, "--assembly": assembly }}
			>
				<ProductStudy
					index={index}
					progress={scrollYProgress}
					reduced={reduced}
				/>
			</motion.div>
		</section>
	);
}
