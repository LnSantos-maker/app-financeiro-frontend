import AccountArrival from "./features/experience/AccountArrival";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useState, lazy, Suspense } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { DashboardSkeleton } from "./components/ui/Skeleton";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

export default function App() {
	const [isAutenticado, setIsAutenticado] = useState(
		() => localStorage.getItem("isAutenticado") === "true",
	);
	const [arrival, setArrival] = useState(false);
	const [emailLogin, setEmailLogin] = useState(
		() => localStorage.getItem("emailLogin") || "",
	);
	const [toast, setToast] = useState({
		visivel: false,
		mensagem: "",
		tipo: "sucesso",
	});

	const mostrarNotificacao = (mensagem, tipo = "sucesso") => {
		setToast({ visivel: true, mensagem, tipo });
		setTimeout(
			() => setToast({ visivel: false, mensagem: "", tipo: "sucesso" }),
			3500,
		);
	};

	return (
		<MotionConfig reducedMotion="user">
			<div className="app-root flex w-full h-screen bg-[#090b10] text-white font-sans overflow-hidden relative">
				{toast.visivel && (
					<div
						className={`fixed top-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all z-[100] animate-in slide-in-from-top-5 fade-in duration-300 ${toast.tipo === "sucesso" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}
					>
						{toast.tipo === "sucesso" ? (
							<CheckCircle size={20} />
						) : (
							<AlertCircle size={20} />
						)}
						<span className="font-medium text-sm">{toast.mensagem}</span>
					</div>
				)}

				<Suspense fallback={<DashboardSkeleton />}>
					{!isAutenticado ? (
						<Login
							onLoginSuccess={(email) => {
								setArrival(true);
								setEmailLogin(email);
								// Keep login visible until the cover completes its entrance.
								localStorage.setItem("emailLogin", email);
								localStorage.setItem("isAutenticado", "true");
							}}
							mostrarNotificacao={mostrarNotificacao}
						/>
					) : (
						<Dashboard
							emailLogin={emailLogin}
							onInitialReady={() => setArrival(false)}
							onLogout={() => {
								setIsAutenticado(false);
								setEmailLogin("");
								localStorage.removeItem("emailLogin");
								localStorage.removeItem("isAutenticado");
							}}
							mostrarNotificacao={mostrarNotificacao}
						/>
					)}
				</Suspense>
				<AnimatePresence>
					{arrival && (
						<AccountArrival
							key="account-arrival"
							onCovered={() => setIsAutenticado(true)}
						/>
					)}
				</AnimatePresence>
			</div>
		</MotionConfig>
	);
}
