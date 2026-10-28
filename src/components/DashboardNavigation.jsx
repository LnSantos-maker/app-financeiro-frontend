import {
	Home,
	CreditCard,
	ArrowRightLeft,
	Target,
	ShoppingBag,
	ClipboardList,
	Calculator,
	Settings,
	LogOut,
	ArrowUpRight,
} from "lucide-react";
import Brand from "./ui/Brand";

const items = [
	["home", "Visão geral", Home],
	["extrato", "Movimentações", ArrowRightLeft],
	["cartoes", "Cartões", CreditCard],
	["metas", "Cofres", Target],
	["beneficios", "Benefícios", ShoppingBag],
	["planilha", "Planejamento", ClipboardList],
	["utilitarios", "Calculadoras", Calculator],
	["configuracoes", "Configurações", Settings],
];

export default function DashboardNavigation({
	active,
	onNavigate,
	name,
	onProfile,
	onLogout,
}) {
	return (
		<aside className="dashboard-navigation">
			<a href="#conteudo" className="skip-link">
				Ir para o conteúdo
			</a>
			<div className="sidebar-brand">
				<Brand />
				<span>FINANÇAS PESSOAIS</span>
			</div>
			<p className="nav-caption">SEU ESPAÇO</p>
			<nav aria-label="Navegação principal">
				{items.map(([id, label, Icon]) => (
					<button
						key={id}
						onClick={() => onNavigate(id)}
						aria-current={active === id ? "page" : undefined}
						className={active === id ? "nav-item active" : "nav-item"}
					>
						<Icon size={19} />
						<span>{label}</span>
						{active === id && <span className="nav-indicator" />}
					</button>
				))}
			</nav>
			<div className="sidebar-note">
				<Target size={22} />
				<p>
					Cada escolha de hoje
					<br />
					financia o seu amanhã
				</p>
				<button onClick={() => onNavigate("metas")}>
					Ver meus cofres <ArrowUpRight size={15} />
				</button>
			</div>
			<div className="sidebar-account">
				<button onClick={onProfile} className="account-profile">
					<span className="account-initial">
						{(name || "N").slice(0, 1).toUpperCase()}
					</span>
					<span>
						<strong>{name || "Meu perfil"}</strong>
						<small>Editar perfil</small>
					</span>
				</button>
				<button
					onClick={onLogout}
					aria-label="Sair da conta"
					className="logout-button"
				>
					<LogOut size={18} />
				</button>
			</div>
		</aside>
	);
}
