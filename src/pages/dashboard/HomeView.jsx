import { VaultFallback } from "../../features/experience/FinancialSculpture";
import {
	ChevronLeft,
	ChevronRight,
	Plus,
	ArrowDownLeft,
	ArrowUpRight,
	Target,
	Pencil,
	Trash2,
	Check,
	CalendarClock,
	ChevronDown,
} from "lucide-react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { money } from "../../utils/format";

function EmptyState({ children }) {
	return (
		<div className="empty-state">
			<span aria-hidden="true">↗</span>
			<p>{children}</p>
		</div>
	);
}
function Panel({ title, detail, action, children, className = "" }) {
	return (
		<section className={`finance-panel ${className}`}>
			<header className="panel-heading">
				<div>
					<h2>{title}</h2>
					{detail && <p>{detail}</p>}
				</div>
				{action}
			</header>
			{children}
		</section>
	);
}

export default function HomeView({
	saldoReal,
	totalGuardado,
	balancoReal,
	inteligenciaReal,
	categoriaExpandida,
	toggleCategoria,
	mesFormatadoExibicao,
	mesAnterior,
	proximoMes,
	setModalAgendamentoAberto,
	setModalReceitaAberto,
	setModalDespesaAberto,
	abrirModalAporte,
	agendamentosReais = [],
	evolucaoReal = [],
	categoriasReais = [],
	transacoesReais = [],
	orcamentosReais = [],
	abrirModalEditSaldo,
	abrirModalEditTx,
	handlePagarAgendamento,
	handleExcluirAgendamento,
	handleExcluirTransacao,
}) {
	const receitas = Number(balancoReal?.receitas || 0);
	const despesas = Number(balancoReal?.despesas || 0);
	const balanco =
		typeof balancoReal === "object"
			? Number(balancoReal?.balanco || 0)
			: Number(balancoReal || 0);
	const distributionTotal = categoriasReais.reduce(
		(sum, item) => sum + Number(item.value || 0),
		0,
	);
	const allocations = [
		["essenciais", "Essenciais", 50],
		["estilo_vida", "Estilo de vida", 30],
		["futuro", "Futuro", 20],
	];
	return (
		<div className="overview-page">
			<header className="overview-header">
				<div>
					<span className="eyebrow">NXS / SUA PERSPECTIVA FINANCEIRA</span>
					<h1>
						O agora<span className="brand-dot"></span>
					</h1>
					<p>Disponível, comprometido e reservado Cada parte no seu lugar</p>
				</div>
				<div className="period-control">
					<button aria-label="Mês anterior" onClick={mesAnterior}>
						<ChevronLeft size={18} />
					</button>
					<span>{mesFormatadoExibicao}</span>
					<button aria-label="Próximo mês" onClick={proximoMes}>
						<ChevronRight size={18} />
					</button>
				</div>
			</header>
			<div className="overview-top">
				<section className="balance-panel">
					<span className="eyebrow">SALDO DISPONÍVEL</span>
					<div className="balance-value">
						<strong>{money(saldoReal)}</strong>
						<button aria-label="Ajustar saldo" onClick={abrirModalEditSaldo}>
							<Pencil size={17} />
						</button>
					</div>
					<p>Para os seus próximos movimentos</p>
					<div className="balance-actions">
						<button onClick={() => setModalReceitaAberto(true)}>
							<Plus size={17} /> Receita
						</button>
						<button onClick={() => setModalDespesaAberto(true)}>
							<ArrowUpRight size={17} /> Despesa
						</button>
					</div>
					<div className="balance-art" aria-hidden="true">
						<VaultFallback />
					</div>
				</section>
				<div className="month-summary">
					<div>
						<span>
							<ArrowDownLeft size={17} /> Entradas do mês
						</span>
						<strong className="positive">{money(receitas)}</strong>
					</div>
					<div>
						<span>
							<ArrowUpRight size={17} /> Saídas do mês
						</span>
						<strong className="negative">{money(despesas)}</strong>
					</div>
					<div>
						<span>
							<Target size={17} /> Reservado em cofres
						</span>
						<strong>{money(totalGuardado)}</strong>
						<button onClick={() => abrirModalAporte("")}>
							Guardar dinheiro <ArrowUpRight size={14} />
						</button>
					</div>
				</div>
			</div>
			<div className="overview-charts">
				<Panel
					title="Como seu saldo se move"
					detail="Evolução registrada no período"
					action={
						<span className={`balance-tag ${balanco < 0 ? "negative" : ""}`}>
							{money(balanco)} no mês
						</span>
					}
				>
					{evolucaoReal.length > 0 ? (
						<div
							className="evolution-chart"
							role="img"
							aria-label="Gráfico de evolução do saldo"
						>
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={evolucaoReal}
									margin={{ top: 20, right: 10, left: 4, bottom: 0 }}
								>
									<defs>
										<linearGradient
											id="balanceFill"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="0%"
												stopColor="#526c8e"
												stopOpacity={0.25}
											/>
											<stop offset="100%" stopColor="#526c8e" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid
										vertical={false}
										stroke="#e2e8f0"
										strokeDasharray="3 6"
									/>
									<XAxis
										dataKey="name"
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#5c6d83", fontSize: 11 }}
										dy={10}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#5c6d83", fontSize: 10 }}
										tickFormatter={(value) =>
											new Intl.NumberFormat("pt-BR", {
												notation: "compact",
											}).format(value)
										}
										width={48}
									/>
									<Tooltip
										formatter={(value) => [money(value), "Saldo"]}
										contentStyle={{
											background: "#ffffff",
											border: "1px solid #414a39",
											borderRadius: 12,
											color: "#172333",
										}}
									/>
									<Area
										type="monotone"
										dataKey="saldo"
										stroke="#526c8e"
										strokeWidth={2}
										fill="url(#balanceFill)"
										isAnimationActive={false}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					) : (
						<EmptyState>
							Seu histórico começa no primeiro registro Adicione uma receita ou
							despesa para acompanhar a evolução
						</EmptyState>
					)}
				</Panel>
				<Panel title="Para onde foi" detail="Despesas por categoria">
					<div className="category-distribution">
						{categoriasReais.length ? (
							categoriasReais.map((item, i) => (
								<div className="category-line" key={`${item.name}-${i}`}>
									<div>
										<span>{item.name}</span>
										<strong>{money(item.value)}</strong>
									</div>
									<div className="progress-track">
										<span
											style={{
												width: `${distributionTotal > 0 ? (Number(item.value || 0) / distributionTotal) * 100 : 0}%`,
												background: [
													"#526c8e",
													"#d78d71",
													"#7c9db0",
													"#b3a0bd",
												][i % 4],
											}}
										/>
									</div>
								</div>
							))
						) : (
							<EmptyState>
								Nenhuma despesa neste período Suas categorias aparecerão aqui
							</EmptyState>
						)}
					</div>
				</Panel>
			</div>
			<Panel
				title="Um plano para cada parte"
				detail="Referência 50 / 30 / 20 · ajuste à sua realidade"
				className="allocation-panel"
				action={<span className="eyebrow">BASE: {money(receitas)}</span>}
			>
				<div className="allocation-grid">
					{allocations.map(([key, title, reference]) => {
						const data = inteligenciaReal?.[key];
						const percent = Number(data?.porcentagem || 0);
						return (
							<div key={key} className="allocation-item">
								<button
									onClick={() => toggleCategoria(key)}
									aria-expanded={categoriaExpandida === key}
								>
									<span>{title}</span>
									<ChevronDown size={16} />
								</button>
								<div className="allocation-value">
									<strong>{money(data?.valor)}</strong>
									<span>{percent.toFixed(1)}%</span>
								</div>
								<div className="progress-track">
									<span
										style={{ width: `${Math.max(0, Math.min(percent, 100))}%` }}
									/>
								</div>
								<small>Referência de distribuição: {reference}%</small>
								{categoriaExpandida === key && (
									<div className="allocation-details">
										{data?.itens?.length ? (
											data.itens.map((item, index) => (
												<p key={index}>
													<span>
														{item.descricao ||
															item.categoria ||
															item.titulo ||
															"Movimentação"}
													</span>
													<strong>{money(item.valor)}</strong>
												</p>
											))
										) : (
											<p>Nenhum movimento nesta classificação</p>
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
				{orcamentosReais.length > 0 && (
					<p className="budget-note">
						{orcamentosReais.length} orçamento(s) definido(s) para acompanhar
						seus limites
					</p>
				)}
			</Panel>
			<div className="overview-lists">
				<Panel
					title="Próximos compromissos"
					detail="Suas contas agendadas"
					action={
						<button
							className="text-action"
							onClick={() => setModalAgendamentoAberto(true)}
						>
							<Plus size={16} /> Agendar
						</button>
					}
				>
					{agendamentosReais.length ? (
						agendamentosReais.map((item) => (
							<div className="finance-row" key={item.id}>
								<span className="row-icon">
									<CalendarClock size={18} />
								</span>
								<div className="row-description">
									<strong>{item.descricao}</strong>
									<small>
										{item.data_vencimento?.split("-").reverse().join("/")}
									</small>
								</div>
								<strong>{money(item.valor)}</strong>
								<div className="row-actions">
									<button
										onClick={() => handlePagarAgendamento(item.id)}
										aria-label={`Pagar ${item.descricao}`}
									>
										<Check size={16} />
									</button>
									<button
										onClick={() => handleExcluirAgendamento(item.id)}
										aria-label={`Excluir ${item.descricao}`}
									>
										<Trash2 size={15} />
									</button>
								</div>
							</div>
						))
					) : (
						<EmptyState>
							Sem contas na fila Agende os próximos pagamentos para se
							antecipar
						</EmptyState>
					)}
				</Panel>
				<Panel
					title="Últimos movimentos"
					detail="Os cinco registros mais recentes"
				>
					{transacoesReais.length ? (
						transacoesReais.slice(0, 5).map((item) => (
							<div className="finance-row" key={item.id}>
								<span
									className={`row-icon ${item.tipo === "Receita" ? "positive" : "negative"}`}
								>
									{item.tipo === "Receita" ? (
										<ArrowDownLeft size={18} />
									) : (
										<ArrowUpRight size={18} />
									)}
								</span>
								<div className="row-description">
									<strong>{item.categoria || item.descricao}</strong>
									<small>{item.data?.split("-").reverse().join("/")}</small>
								</div>
								<strong
									className={item.tipo === "Receita" ? "positive" : "negative"}
								>
									{item.tipo === "Receita" ? "+" : "−"}
									{money(item.valor)}
								</strong>
								<div className="row-actions">
									{item.tipo !== "Cartao" && (
										<button
											onClick={() => abrirModalEditTx(item)}
											aria-label={`Editar ${item.categoria || item.descricao}`}
										>
											<Pencil size={15} />
										</button>
									)}
									<button
										onClick={() => handleExcluirTransacao(item.id)}
										aria-label={`Excluir ${item.categoria || item.descricao}`}
									>
										<Trash2 size={15} />
									</button>
								</div>
							</div>
						))
					) : (
						<EmptyState>
							Você ainda não registrou movimentos Comece pelo que entrou ou
							saiu hoje
						</EmptyState>
					)}
				</Panel>
			</div>
			<footer className="overview-footer">
				<span>NEXUS / SEU DINHEIRO EM PERSPECTIVA</span>
				<span>Um movimento de cada vez</span>
			</footer>
		</div>
	);
}
