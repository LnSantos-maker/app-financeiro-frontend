import { useEffect, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { easeRange } from "./choreography";
function Count({ progress, value, money = false }) {
	const ref = useRef(null);
	useEffect(() => {
		const update = (v) => {
			if (ref.current)
				ref.current.textContent = money
					? currency(value * v)
					: String(Math.round(value * v));
		};
		update(progress.get());
		return progress.on("change", update);
	}, [progress, value, money]);
	return (
		<span aria-label={money ? currency(value) : String(value)}>
			<span ref={ref} aria-hidden="true" />
		</span>
	);
}
function Entry({ progress, order = 0, children, className }) {
	const opacity = useTransform(progress, (v) =>
		easeRange(v, order * 0.12, order * 0.12 + 0.45),
	);
	const y = useTransform(opacity, (v) => (1 - v) * 90);
	const scale = useTransform(opacity, (v) => 0.92 + 0.08 * v);
	return (
		<motion.div className={className} style={{ opacity, y, scale }}>
			{children}
		</motion.div>
	);
}
const currency = (value) =>
	value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export default function ProductStudy({ index, progress, reduced }) {
	const reveal = useTransform(progress, (v) =>
		reduced ? 1 : easeRange(v, 0.28, 0.62),
	);
	const ring = useTransform(reveal, (v) => `${v * 60} 100`);
	return (
		<div className="product-study">
			<div className="study-header">
				<span>NEXUS</span>
			</div>
			{index === 0 ? (
				<>
					<Entry progress={reveal}>
						<span className="study-label">Disponível neste mês</span>
						<strong className="study-total">
							<Count progress={reveal} value={2450} money />
						</strong>
					</Entry>
					<Entry progress={reveal} order={1} className="study-flow">
						<div>
							<span>Entrou</span>
							<b>
								<Count progress={reveal} value={6200} money />
							</b>
						</div>
						<div>
							<span>Saiu</span>
							<b>
								<Count progress={reveal} value={3750} money />
							</b>
						</div>
					</Entry>
					<div className="study-list">
						{[
							["Salário", "+ R$ 6.200"],
							["Moradia", "− R$ 1.800"],
							["Mercado", "− R$ 650"],
						].map(([label, value], order) => (
							<Entry key={label} progress={reveal} order={order + 2}>
								<span>{label}</span>
								<b>{value}</b>
							</Entry>
						))}
					</div>
				</>
			) : index === 1 ? (
				<>
					<Entry progress={reveal}>
						<span className="study-label">Distribuição do mês</span>
						<strong className="study-total">Cada gasto no lugar</strong>
					</Entry>
					{[
						["Essencial", 50],
						["Estilo de vida", 30],
						["Reserva", 20],
					].map(([name, value], order) => (
						<Entry
							progress={reveal}
							order={order + 1}
							className="study-budget"
							key={name}
						>
							<div>
								<span>{name}</span>
								<b>{value}%</b>
							</div>
							<div className="study-track">
								<motion.i
									style={{
										width: `${value}%`,
										scaleX: reveal,
										transformOrigin: "left",
									}}
								/>
							</div>
						</Entry>
					))}
				</>
			) : (
				<>
					<Entry progress={reveal}>
						<span className="study-label">Minha reserva</span>
						<strong className="study-total">
							<Count progress={reveal} value={6000} money />
							<span> de R$ 10.000</span>
						</strong>
					</Entry>
					<Entry progress={reveal} order={1} className="study-goal">
						<svg viewBox="0 0 200 200" aria-hidden="true">
							<circle cx="100" cy="100" r="82" />
							<motion.circle
								cx="100"
								cy="100"
								r="82"
								pathLength="100"
								style={{ strokeDasharray: ring }}
							/>
						</svg>
						<strong>
							<Count progress={reveal} value={60} />
							<span>%</span>
						</strong>
					</Entry>
					<div className="study-list">
						<Entry progress={reveal} order={3}>
							<span>Último aporte</span>
							<b>R$ 500</b>
						</Entry>
						<Entry progress={reveal} order={4}>
							<span>Faltam</span>
							<b>R$ 4.000</b>
						</Entry>
					</div>
				</>
			)}
		</div>
	);
}
