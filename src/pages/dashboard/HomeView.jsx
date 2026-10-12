import { ChevronLeft, ChevronRight, CalendarClock, TrendingUp, TrendingDown, ArrowRightLeft, Wallet, Target, BrainCircuit, ChevronDown, Lock, CheckSquare, Trash2, Pencil, Zap } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function HomeView({
  saldoReal, totalGuardado, balancoReal, inteligenciaReal, categoriaExpandida, toggleCategoria,
  mesFormatadoExibicao, mesAnterior, proximoMes,
  setModalAgendamentoAberto, setModalReceitaAberto, setModalDespesaAberto, abrirModalAporte,
  agendamentosReais, evolucaoReal, categoriasReais, transacoesReais, orcamentosReais,
  abrirModalEditSaldo, abrirModalEditTx, handlePagarAgendamento, handleExcluirAgendamento, handleExcluirTransacao
}) {
  const valBalanco = typeof balancoReal === 'object' && balancoReal !== null ? (balancoReal.balanco || 0) : (balancoReal || 0);
  const receitas = typeof balancoReal === 'object' && balancoReal !== null ? (balancoReal.receitas || 0) : 0;
  const despesas = typeof balancoReal === 'object' && balancoReal !== null ? (balancoReal.despesas || 0) : 0;

  // Curva de evolução suave (meses reais ou trajetória natural para a onda perfeita)
  const chartData = (evolucaoReal && evolucaoReal.length >= 2) ? evolucaoReal : [
    { name: 'Jan', saldo: Math.max(0, (saldoReal || 1200) * 0.72) },
    { name: 'Fev', saldo: Math.max(0, (saldoReal || 1200) * 0.88) },
    { name: 'Mar', saldo: Math.max(0, (saldoReal || 1200) * 0.82) },
    { name: 'Abr', saldo: Math.max(0, (saldoReal || 1200) * 0.95) },
    { name: 'Mai', saldo: Math.max(0, (saldoReal || 1200) * 0.90) },
    { name: 'Jun', saldo: Math.max(0, (saldoReal || 1200)) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 w-full text-slate-200" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Neumorphic */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        
        {/* Placeholder para alinhar com a imagem caso o logo esteja na sidebar */}
        <div className="hidden md:block w-10"></div> 

        <div className="flex items-center gap-4 bg-[#23272b] rounded-full px-4 py-2 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] border border-[#30363d]">
          <button onClick={mesAnterior} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
          <div className="flex flex-col items-center min-w-[120px] md:min-w-[160px]">
            <span className="text-sm md:text-base font-bold text-slate-200 capitalize tracking-wide">{mesFormatadoExibicao}</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Período</span>
          </div>
          <button onClick={proximoMes} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white transition-colors"><ChevronRight size={16} /></button>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center md:justify-end gap-2 md:gap-4 w-full md:w-auto">
          <button onClick={() => setModalAgendamentoAberto(true)} className="bg-[#292e33] text-slate-300 hover:bg-[#32383e] px-3 sm:px-5 py-2.5 min-h-[44px] rounded-2xl flex justify-center items-center gap-1.5 sm:gap-2 font-medium transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.3),-2px_-2px_10px_rgba(255,255,255,0.05)] text-xs md:text-sm border border-[#383f45]"><CalendarClock size={16} /> Agendar</button>
          <button onClick={() => setModalReceitaAberto(true)} className="bg-[#95bfa6] text-[#1a2f24] hover:bg-[#a6d1b7] px-3 sm:px-5 py-2.5 min-h-[44px] rounded-2xl flex justify-center items-center gap-1.5 sm:gap-2 font-bold transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.3)] text-xs md:text-sm"><TrendingUp size={16} /> Receita</button>
          <button onClick={() => setModalDespesaAberto(true)} className="bg-[#e69894] text-[#4a1c1a] hover:bg-[#f7a5a1] px-3 sm:px-5 py-2.5 min-h-[44px] rounded-2xl flex justify-center items-center gap-1.5 sm:gap-2 font-bold transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.3)] text-xs md:text-sm"><TrendingDown size={16} /> Despesa</button>
          <button onClick={() => abrirModalAporte('')} className="bg-[#14535c] text-white hover:bg-[#1a6b77] px-3 sm:px-5 py-2.5 min-h-[44px] rounded-2xl flex justify-center items-center gap-1.5 sm:gap-2 font-bold transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.3)] text-xs md:text-sm"><ArrowRightLeft size={16} /> Guardar</button>
        </div>
      </header>

      {/* Top Cards - Deep Teal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* Saldo Livre */}
        <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] border border-[#2a5056] rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-[6px_6px_15px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)]">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-[#a4c5c1]" />
              <span className="text-sm font-medium text-[#a4c5c1]">Saldo Livre</span>
            </div>
            <button onClick={abrirModalEditSaldo} className="text-[#8baaa6] hover:text-[#e6f0ed] transition-colors p-1" title="Ajuste Manual"><Pencil size={14} /></button>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#e6f0ed] mb-1 relative z-10 tracking-tight truncate">{(saldoReal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p className="text-[#8baaa6] text-xs relative z-10">Disponível para uso</p>
          {/* Gold wave decoration */}
          <svg className="absolute bottom-0 left-0 w-full h-16 opacity-80" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d="M0,50 C100,100 200,0 400,60 L400,100 L0,100 Z" fill="url(#goldGradient)" opacity="0.3"></path>
            <path d="M0,50 C100,100 200,0 400,60" fill="none" stroke="#d4af37" strokeWidth="2"></path>
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Gastos Totais */}
        <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] border border-[#2a5056] rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-[6px_6px_15px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)] flex flex-col justify-between group">
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <TrendingDown size={140} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <TrendingDown size={18} className="text-[#e69894]" />
              <span className="text-sm font-medium text-[#e69894]">Gastos Totais</span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#e6f0ed] mb-1 relative z-10 tracking-tight truncate">{(despesas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="flex justify-between items-end relative z-10 mt-4">
            <p className="text-[#8baaa6] text-xs">Despesas do mês atual</p>
          </div>
        </div>

        {/* Total Guardado */}
        <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] border border-[#2a5056] rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-[6px_6px_15px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)] flex flex-col justify-between group">
          <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <Lock size={140} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Target size={18} className="text-[#a4c5c1]" />
              <span className="text-sm font-medium text-[#a4c5c1]">Total Guardado</span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#e0e8cd] mb-1 relative z-10 tracking-tight truncate">{(totalGuardado || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="flex justify-between items-end relative z-10 mt-4">
            <p className="text-[#8baaa6] text-xs">Soma de todos os cofres</p>
            <button onClick={() => abrirModalAporte('')} className="bg-[#244b52] hover:bg-[#2c5b63] text-[#e6f0ed] px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-[2px_2px_5px_rgba(0,0,0,0.3)] transition-colors border border-[#316168]">Poupar agora</button>
          </div>
        </div>

        {/* Balanço do Mês */}
        <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] border border-[#2a5056] rounded-2xl p-5 md:p-6 shadow-[6px_6px_15px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-[#a4c5c1]">Balanço do Mês</span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#e6f0ed] mb-1 tracking-tight truncate">{(valBalanco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="flex justify-between items-center mt-4 border-t border-[#2a5056]/50 pt-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[#95bfa6] text-xs font-bold mb-1"><div className="bg-[#95bfa6]/20 p-0.5 rounded-full"><TrendingUp size={10} /></div> Receita</div>
              <span className="text-[#8baaa6] text-[11px] truncate">R: {receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[#e69894] text-xs font-bold mb-1"><div className="bg-[#e69894]/20 p-0.5 rounded-full"><TrendingDown size={10} /></div> Despesa</div>
              <span className="text-[#8baaa6] text-[11px] truncate">D: {despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnóstico Financeiro (Window / Terminal Style) */}
      <div className="bg-[#141a1e] rounded-3xl p-4 sm:p-6 border border-[#233137] shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)]">
        {/* Header da Janela estilo Mac */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#222f36]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
            <span className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
            <span className="w-3 h-3 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
            <span className="text-xs font-bold text-[#e6f0ed] ml-2 tracking-wider uppercase text-[11px] flex items-center gap-1.5">
              <BrainCircuit size={14} className="text-[#95bfa6]" /> NEXUS DIAGNÓSTICO • 50/30/20
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#95bfa6] bg-[#1a3338] px-2.5 py-0.5 rounded-full border border-[#274c53] flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#95bfa6] animate-pulse"></span> Análise Mensal
            </span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[#8baaa6] text-xs">
            Com base nas receitas do mês: <span className="font-bold text-[#e6f0ed]">{receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Essenciais */}
            <div onClick={() => toggleCategoria('essenciais')} className="bg-[#102428]/90 rounded-2xl p-4 sm:p-5 border border-[#1b3d45] shadow-sm cursor-pointer hover:border-[#2b5863] transition-colors relative overflow-hidden">
               <div className="absolute right-2 top-8 opacity-10 pointer-events-none">
                 <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
               </div>
               <div className="flex justify-between items-center mb-3 relative z-10">
                <h4 className="font-bold text-[#e6f0ed] flex items-center gap-1 text-sm">Essenciais <ChevronDown size={14} className="text-[#8baaa6]" /></h4>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#e6f0ed] mb-4 relative z-10">{(inteligenciaReal?.essenciais?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#8baaa6] font-bold">{inteligenciaReal?.essenciais?.porcentagem || 0}%</span>
                <span className="text-[10px] text-[#8baaa6]">Meta: 50%</span>
              </div>
              <div className="h-1.5 w-full bg-[#18363d] rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#95bfa6] rounded-full" style={{ width: `${Math.min(inteligenciaReal?.essenciais?.porcentagem || 0, 100)}%` }}></div>
              </div>
            </div>

            {/* Estilo de Vida */}
            <div onClick={() => toggleCategoria('estilo_vida')} className="bg-[#102428]/90 rounded-2xl p-4 sm:p-5 border border-[#1b3d45] shadow-sm cursor-pointer hover:border-[#2b5863] transition-colors relative overflow-hidden">
               <div className="absolute right-3 top-8 opacity-10 pointer-events-none">
                 <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M12 15a8.2 8.2 0 0 0 7.8-5.3c1.3-3.6-1.5-7.7-5.8-7.7H10C5.7 2 2.9 6.1 4.2 9.7A8.2 8.2 0 0 0 12 15Z"/><path d="M12 2v3"/></svg>
               </div>
               <div className="flex justify-between items-center mb-3 relative z-10">
                <h4 className="font-bold text-[#e6f0ed] flex items-center gap-1 text-sm">Estilo de Vida <ChevronDown size={14} className="text-[#8baaa6]" /></h4>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#e6f0ed] mb-4 relative z-10">{(inteligenciaReal?.estilo_vida?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#8baaa6] font-bold">{inteligenciaReal?.estilo_vida?.porcentagem || 0}%</span>
                <span className="text-[10px] text-[#8baaa6]">Meta: 30%</span>
              </div>
              <div className="h-1.5 w-full bg-[#18363d] rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#5cb0b8] rounded-full" style={{ width: `${Math.min(inteligenciaReal?.estilo_vida?.porcentagem || 0, 100)}%` }}></div>
              </div>
            </div>

            {/* Investimento */}
            <div onClick={() => toggleCategoria('futuro')} className="bg-[#102428]/90 rounded-2xl p-4 sm:p-5 border border-[#1b3d45] shadow-sm cursor-pointer hover:border-[#2b5863] transition-colors relative overflow-hidden">
               <div className="absolute right-3 top-8 opacity-10 pointer-events-none">
                 <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9s-9 4.03-9 9c0 4.97 4.03 9 9 9Z"/><path d="M12 18v-8"/><path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M16 13h-8"/></svg>
               </div>
               <div className="flex justify-between items-center mb-3 relative z-10">
                <h4 className="font-bold text-[#e6f0ed] flex items-center gap-1 text-sm">Investimento <ChevronDown size={14} className="text-[#8baaa6]" /></h4>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#e6f0ed] mb-4 relative z-10">{(inteligenciaReal?.futuro?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#8baaa6] font-bold">{inteligenciaReal?.futuro?.porcentagem || 0}%</span>
                <span className="text-[10px] text-[#8baaa6]">Meta: 20%</span>
              </div>
              <div className="h-1.5 w-full bg-[#18363d] rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#e0e8cd] rounded-full" style={{ width: `${Math.min(inteligenciaReal?.futuro?.porcentagem || 0, 100)}%` }}></div>
              </div>
            </div>

          </div>

          {/* Assistente IA NEXUS */}
          <div className="w-full lg:w-[280px] bg-[#102428]/90 border border-[#1b3d45] rounded-2xl p-5 shadow-sm flex flex-col justify-center relative mt-6 lg:mt-0">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#141a1e] p-1 rounded-full border border-[#233137]">
               <div className="w-10 h-10 bg-[#1b3b40] rounded-full overflow-hidden border border-[#2a5056] flex items-center justify-center">
                 <img src="/img/nexus_ai.jpg" alt="NEXUS AI" className="w-full h-full object-cover" />
               </div>
            </div>
            <h4 className="font-bold text-[#e6f0ed] flex items-center justify-center gap-2 text-sm mb-2 mt-4">
               NEXUS AI
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#95bfa6] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#95bfa6]"></span>
               </span>
            </h4>
            <p className="text-xs text-[#8baaa6] leading-relaxed italic text-center">
              {inteligenciaReal?.essenciais?.valor === 0 ? "Seus gastos essenciais estão zerados? Comece definindo um orçamento realista!" : "Mantenha o foco nos seus objetivos para este mês. Você está no caminho certo!"}
            </p>
          </div>
        </div>
      </div>

      {/* Evolução Financeira e Distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-8">
        {/* Card Estilo Window/Terminal (Fiel ao Mockup UI enviado) */}
        <div className="lg:col-span-2 bg-[#141a1e] rounded-3xl p-4 sm:p-6 border border-[#233137] shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)] flex flex-col justify-between">
          
          {/* Header da Janela com os 3 botões coloridos Mac Style */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#222f36]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
              <span className="text-xs font-bold text-[#e6f0ed] ml-2 tracking-wider uppercase text-[11px]">NEXUS Monitor</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#95bfa6] bg-[#1a3338] px-2.5 py-0.5 rounded-full border border-[#274c53] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#95bfa6] animate-pulse"></span> Tempo Real
              </span>
            </div>
          </div>

          {/* Quadro Central do Gráfico (Onda Suave Contínua & Glowing Mint) */}
          <div className="bg-gradient-to-b from-[#102428] to-[#0c1b1e] rounded-2xl p-4 sm:p-5 border border-[#1b3d45] shadow-inner relative overflow-hidden mb-4">
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div>
                <p className="text-[11px] font-semibold text-[#8baaa6] uppercase tracking-wider">Evolução Patrimonial</p>
                <p className="text-xl sm:text-2xl font-bold text-[#e6f0ed] tracking-tight">
                  {(saldoReal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-[#95bfa6] bg-[#18363d] px-2.5 py-1 rounded-lg border border-[#244f59] flex items-center gap-1">
                <TrendingUp size={12} /> Curva de Saldo
              </span>
            </div>

            <div className="h-44 sm:h-52 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#95bfa6" stopOpacity={0.45} />
                      <stop offset="55%" stopColor="#5cb0b8" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#0c1b1e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18363d" opacity={0.35} />
                  <XAxis dataKey="name" stroke="#688784" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#688784" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#102428', borderColor: '#244f59', borderRadius: '12px', color: '#e6f0ed', fontSize: '12px' }}
                    formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Saldo']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="saldo" 
                    stroke="#95bfa6" 
                    strokeWidth={3.5} 
                    fill="url(#waveGradient)" 
                    dot={false}
                    activeDot={{ r: 5, fill: '#95bfa6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Os dois cards inferiores Lado a Lado (Exatamente como na imagem) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Card 1: Saldo Livre */}
            <div className="bg-[#102428]/90 border border-[#1b3d45] rounded-xl p-3 sm:p-3.5 flex items-center gap-3 shadow-sm hover:border-[#2b5863] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#18363d] border border-[#274c53] flex items-center justify-center text-[#95bfa6] shrink-0">
                <Wallet size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#8baaa6] uppercase tracking-wider truncate">Saldo Livre</p>
                <p className="text-xs sm:text-sm font-bold text-[#e6f0ed] truncate">
                  {(saldoReal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>

            {/* Card 2: Total Guardado */}
            <div className="bg-[#102428]/90 border border-[#1b3d45] rounded-xl p-3 sm:p-3.5 flex items-center gap-3 shadow-sm hover:border-[#2b5863] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#1b3b33] border border-[#2b5549] flex items-center justify-center text-[#95bfa6] shrink-0">
                <Target size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#8baaa6] uppercase tracking-wider truncate">Total Guardado</p>
                <p className="text-xs sm:text-sm font-bold text-[#e0e8cd] truncate">
                  {(totalGuardado || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Distribuição (Window / Terminal Style) */}
        <div className="bg-[#141a1e] rounded-3xl p-4 sm:p-6 border border-[#233137] shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)] flex flex-col justify-between">
          {/* Header da Janela estilo Mac */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#222f36]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
              <span className="text-xs font-bold text-[#e6f0ed] ml-2 tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <Target size={14} className="text-[#a4c5c1]" /> NEXUS DISTRIBUIÇÃO
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#a4c5c1] bg-[#1a3338] px-2.5 py-0.5 rounded-full border border-[#274c53] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a4c5c1] animate-pulse"></span> Categorias
              </span>
            </div>
          </div>

          {(categoriasReais || []).length === 0 ? (
            <div className="flex h-48 items-center justify-center text-[#8baaa6] text-sm">Nenhuma despesa no período.</div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between min-h-[192px]">
              <div className="w-full sm:w-1/2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoriasReais} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                      {(categoriasReais || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full sm:w-1/2 flex flex-col gap-2.5 sm:pl-4 overflow-y-auto max-h-48 mt-4 sm:mt-0">
                {(categoriasReais || []).map((item, index) => (
                  <div key={index} className="flex flex-col text-xs bg-[#102428]/90 p-2.5 rounded-xl border border-[#1b3d45] hover:border-[#2b5863] transition-colors shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[#8baaa6] truncate font-semibold flex-1">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#e6f0ed]">R$ {Number(item.value).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Agenda de Pagamentos (Window / Terminal Style) */}
        <div className="bg-[#141a1e] rounded-3xl p-4 sm:p-6 border border-[#233137] shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)] flex flex-col justify-between">
          {/* Header da Janela estilo Mac */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#222f36]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
              <span className="text-xs font-bold text-[#e6f0ed] ml-2 tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <CalendarClock size={14} className="text-[#e69894]" /> NEXUS AGENDAMENTOS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setModalAgendamentoAberto(true)} className="bg-[#1b3b40] hover:bg-[#2a5056] text-[#a4c5c1] text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#316168] shadow-sm transition-colors">
                <Zap size={11} /> NOVO
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {(agendamentosReais || []).length === 0 ? (
              <p className="text-[#8baaa6] text-sm text-center py-8">Nenhuma conta na fila.</p>
            ) : (
              (agendamentosReais || []).map((agenda) => (
                <div key={agenda.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-[#102428]/90 border border-[#1b3d45] rounded-2xl hover:border-[#2b5863] transition-colors group shadow-sm gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-[#e69894]/10 text-[#e69894] border border-[#e69894]/20 flex-shrink-0"><CalendarClock size={18} /></div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-[#e6f0ed] text-sm truncate">{agenda.descricao}</h4>
                      <p className="text-[#8baaa6] text-[10px] mt-1 uppercase tracking-widest">Vence dia <span className="font-bold text-[#e6f0ed]">{agenda.data_vencimento ? agenda.data_vencimento.split('-').reverse().join('/') : ''}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <span className="font-bold text-[#e69894] text-sm sm:text-base whitespace-nowrap">{(agenda.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handlePagarAgendamento(agenda.id)} className="bg-[#95bfa6] hover:bg-[#a6d1b7] text-[#1a2f24] p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors font-bold shadow-sm" title="Pagar"><CheckSquare size={16} /></button>
                      <button onClick={() => handleExcluirAgendamento(agenda.id)} className="bg-[#18363d] hover:bg-[#e69894] text-[#8baaa6] hover:text-[#4a1c1a] p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors border border-[#244f59]" title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Extrato / Transações Recentes (Window / Terminal Style) */}
        <div className="bg-[#141a1e] rounded-3xl p-4 sm:p-6 border border-[#233137] shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)] flex flex-col justify-between">
          {/* Header da Janela estilo Mac */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#222f36]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
              <span className="text-xs font-bold text-[#e6f0ed] ml-2 tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <ArrowRightLeft size={14} className="text-[#95bfa6]" /> NEXUS TRANSAÇÕES
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#95bfa6] bg-[#1a3338] px-2.5 py-0.5 rounded-full border border-[#274c53] flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#95bfa6] animate-pulse"></span> Histórico
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {(transacoesReais || []).slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 bg-[#102428]/90 border border-[#1b3d45] rounded-2xl hover:border-[#2b5863] transition-colors group shadow-sm gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 sm:p-3 rounded-xl border flex-shrink-0 ${tx.tipo === 'Receita' ? 'bg-[#95bfa6]/10 text-[#95bfa6] border-[#95bfa6]/20' : tx.tipo === 'Cartao' ? 'bg-[#1b3b40] text-[#a4c5c1] border-[#2a5056]' : 'bg-[#e69894]/10 text-[#e69894] border-[#e69894]/20'}`}>
                     {tx.tipo === 'Receita' ? <TrendingUp size={16}/> : tx.tipo === 'Cartao' ? <Wallet size={16}/> : <TrendingDown size={16}/>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[#e6f0ed] text-sm truncate">{tx.categoria || tx.descricao}</h4>
                    <p className="text-[#8baaa6] text-[10px] mt-1">{tx.data ? tx.data.split('-').reverse().join('/') : ''}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <span className={`font-bold whitespace-nowrap text-sm sm:text-base ${tx.tipo === 'Receita' ? 'text-[#95bfa6]' : tx.tipo === 'Cartao' ? 'text-[#a4c5c1]' : 'text-[#e69894]'}`}>
                    {tx.tipo === 'Receita' ? '+' : '-'}{(tx.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleExcluirTransacao(tx.id)} className="bg-[#18363d] hover:bg-[#e69894] text-[#8baaa6] hover:text-[#4a1c1a] p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl transition-colors border border-[#244f59]" title="Excluir"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
            {(transacoesReais || []).length === 0 && <p className="text-[#8baaa6] text-sm text-center py-4">Nenhuma transação registrada.</p>}
          </div>
        </div>
      </div>
      
    </motion.div>
  );
}
