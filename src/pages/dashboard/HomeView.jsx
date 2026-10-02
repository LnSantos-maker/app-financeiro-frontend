import { ChevronLeft, ChevronRight, CalendarClock, TrendingUp, TrendingDown, ArrowRightLeft, Wallet, Target, BrainCircuit, ChevronDown, Lock, CheckSquare, Trash2, Pencil, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 w-full text-slate-200" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Neumorphic */}
      <header className="flex justify-between items-center mb-8">
        
        {/* Placeholder para alinhar com a imagem caso o logo esteja na sidebar */}
        <div className="w-10"></div> 

        <div className="flex items-center gap-4 bg-[#23272b] rounded-full px-4 py-2 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] border border-[#30363d]">
          <button onClick={mesAnterior} className="p-1 text-slate-400 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
          <div className="flex flex-col items-center min-w-[160px]">
            <span className="text-base font-bold text-slate-200 capitalize tracking-wide">{mesFormatadoExibicao}</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Período Selecionado</span>
          </div>
          <button onClick={proximoMes} className="p-1 text-slate-400 hover:text-white transition-colors"><ChevronRight size={16} /></button>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setModalAgendamentoAberto(true)} className="bg-[#292e33] text-slate-300 hover:bg-[#32383e] px-5 py-2.5 rounded-2xl flex items-center gap-2 font-medium transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.3),-2px_-2px_10px_rgba(255,255,255,0.05)] text-sm border border-[#383f45]"><CalendarClock size={16} /> Agendar</button>
          <button onClick={() => setModalReceitaAberto(true)} className="bg-[#95bfa6] text-[#1a2f24] hover:bg-[#a6d1b7] px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.3)] text-sm"><TrendingUp size={16} /> Receita</button>
          <button onClick={() => setModalDespesaAberto(true)} className="bg-[#e69894] text-[#4a1c1a] hover:bg-[#f7a5a1] px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.3)] text-sm"><TrendingDown size={16} /> Despesa</button>
          <button onClick={() => abrirModalAporte('')} className="bg-[#14535c] text-white hover:bg-[#1a6b77] px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.3)] text-sm"><ArrowRightLeft size={16} /> Guardar</button>
        </div>
      </header>

      {/* Top Cards - Deep Teal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Saldo Livre */}
        <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] border border-[#2a5056] rounded-2xl p-6 relative overflow-hidden shadow-[6px_6px_15px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)]">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-[#a4c5c1]" />
              <span className="text-sm font-medium text-[#a4c5c1]">Saldo Livre</span>
            </div>
            <button onClick={abrirModalEditSaldo} className="text-[#8baaa6] hover:text-[#e6f0ed] transition-colors p-1" title="Ajuste Manual"><Pencil size={14} /></button>
          </div>
          <p className="text-[34px] font-bold text-[#e6f0ed] mb-1 relative z-10 tracking-tight">{(saldoReal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
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
        <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] border border-[#2a5056] rounded-2xl p-6 relative overflow-hidden shadow-[6px_6px_15px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)] flex flex-col justify-between group">
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <TrendingDown size={140} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <TrendingDown size={18} className="text-[#e69894]" />
              <span className="text-sm font-medium text-[#e69894]">Gastos Totais</span>
            </div>
            <p className="text-[34px] font-bold text-[#e6f0ed] mb-1 relative z-10 tracking-tight">{(despesas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="flex justify-between items-end relative z-10 mt-4">
            <p className="text-[#8baaa6] text-xs">Despesas do mês atual</p>
          </div>
        </div>

        {/* Total Guardado */}
        <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] border border-[#2a5056] rounded-2xl p-6 relative overflow-hidden shadow-[6px_6px_15px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)] flex flex-col justify-between group">
          <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <Lock size={140} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Target size={18} className="text-[#a4c5c1]" />
              <span className="text-sm font-medium text-[#a4c5c1]">Total Guardado</span>
            </div>
            <p className="text-[34px] font-bold text-[#e0e8cd] mb-1 relative z-10 tracking-tight">{(totalGuardado || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="flex justify-between items-end relative z-10 mt-4">
            <p className="text-[#8baaa6] text-xs">Soma de todos os cofres</p>
            <button onClick={() => abrirModalAporte('')} className="bg-[#244b52] hover:bg-[#2c5b63] text-[#e6f0ed] px-4 py-1.5 rounded-lg text-xs font-semibold shadow-[2px_2px_5px_rgba(0,0,0,0.3)] transition-colors border border-[#316168]">Poupar agora</button>
          </div>
        </div>

        {/* Balanço do Mês */}
        <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] border border-[#2a5056] rounded-2xl p-6 shadow-[6px_6px_15px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-[#a4c5c1]">Balanço do Mês</span>
            </div>
            <p className="text-[34px] font-bold text-[#e6f0ed] mb-1 tracking-tight">{(valBalanco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="flex justify-between items-center mt-4 border-t border-[#2a5056]/50 pt-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[#95bfa6] text-xs font-bold mb-1"><div className="bg-[#95bfa6]/20 p-0.5 rounded-full"><TrendingUp size={10} /></div> Receita</div>
              <span className="text-[#8baaa6] text-[11px]">R: {receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[#e69894] text-xs font-bold mb-1"><div className="bg-[#e69894]/20 p-0.5 rounded-full"><TrendingDown size={10} /></div> Despesa</div>
              <span className="text-[#8baaa6] text-[11px]">D: {despesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnóstico Financeiro (Neumorphic Panel) */}
      <div className="bg-[#2a2e33] rounded-3xl p-6 border border-[#353a40] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.02),8px_8px_20px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 mb-8">
          <BrainCircuit size={32} className="text-[#8e98a3]" strokeWidth={1.5} />
          <div>
            <h2 className="text-lg font-bold text-[#e2e8f0]">Diagnóstico Financeiro (50/30/20)</h2>
            <p className="text-[#8e98a3] text-sm">Com base nas receitas do mês selecionado: {receitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 grid grid-cols-3 gap-6">
            
            {/* Essenciais */}
            <div onClick={() => toggleCategoria('essenciais')} className="bg-[#2a2e33] rounded-2xl p-5 border border-[#353a40] shadow-[6px_6px_12px_rgba(0,0,0,0.3),-4px_-4px_10px_rgba(255,255,255,0.03)] cursor-pointer hover:bg-[#2d3238] transition-colors relative overflow-hidden">
               <div className="absolute right-2 top-10 opacity-10 pointer-events-none">
                 <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
               </div>
               <div className="flex justify-between items-center mb-4 relative z-10">
                <h4 className="font-bold text-[#e2e8f0] flex items-center gap-1 text-sm">Essenciais <ChevronDown size={14} className="text-slate-500" /></h4>
              </div>
              <p className="text-2xl font-bold text-[#e2e8f0] mb-6 relative z-10">{(inteligenciaReal?.essenciais?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-bold">{inteligenciaReal?.essenciais?.porcentagem || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1e2226] rounded-full overflow-hidden shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${Math.min(inteligenciaReal?.essenciais?.porcentagem || 0, 100)}%` }}></div>
              </div>
            </div>

            {/* Estilo de Vida */}
            <div onClick={() => toggleCategoria('estilo_vida')} className="bg-[#2a2e33] rounded-2xl p-5 border border-[#353a40] shadow-[6px_6px_12px_rgba(0,0,0,0.3),-4px_-4px_10px_rgba(255,255,255,0.03)] cursor-pointer hover:bg-[#2d3238] transition-colors relative overflow-hidden">
               <div className="absolute right-4 top-10 opacity-10 pointer-events-none">
                 <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M12 15a8.2 8.2 0 0 0 7.8-5.3c1.3-3.6-1.5-7.7-5.8-7.7H10C5.7 2 2.9 6.1 4.2 9.7A8.2 8.2 0 0 0 12 15Z"/><path d="M12 2v3"/></svg>
               </div>
               <div className="flex justify-between items-center mb-4 relative z-10">
                <h4 className="font-bold text-[#e2e8f0] flex items-center gap-1 text-sm">Estilo de Vida <ChevronDown size={14} className="text-slate-500" /></h4>
              </div>
              <p className="text-2xl font-bold text-[#e2e8f0] mb-6 relative z-10">{(inteligenciaReal?.estilo_vida?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-bold">{inteligenciaReal?.estilo_vida?.porcentagem || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1e2226] rounded-full overflow-hidden shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${Math.min(inteligenciaReal?.estilo_vida?.porcentagem || 0, 100)}%` }}></div>
              </div>
            </div>

            {/* Investimento */}
            <div onClick={() => toggleCategoria('futuro')} className="bg-[#2a2e33] rounded-2xl p-5 border border-[#353a40] shadow-[6px_6px_12px_rgba(0,0,0,0.3),-4px_-4px_10px_rgba(255,255,255,0.03)] cursor-pointer hover:bg-[#2d3238] transition-colors relative overflow-hidden">
               <div className="absolute right-4 top-10 opacity-10 pointer-events-none">
                 <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9s-9 4.03-9 9c0 4.97 4.03 9 9 9Z"/><path d="M12 18v-8"/><path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M16 13h-8"/></svg>
               </div>
               <div className="flex justify-between items-center mb-4 relative z-10">
                <h4 className="font-bold text-[#e2e8f0] flex items-center gap-1 text-sm">Investimento <ChevronDown size={14} className="text-slate-500" /></h4>
              </div>
              <p className="text-2xl font-bold text-[#e2e8f0] mb-6 relative z-10">{(inteligenciaReal?.futuro?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-bold">{inteligenciaReal?.futuro?.porcentagem || 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1e2226] rounded-full overflow-hidden shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${Math.min(inteligenciaReal?.futuro?.porcentagem || 0, 100)}%` }}></div>
              </div>
            </div>

          </div>

          {/* Assistente IA NEXUS */}
          <div className="w-[280px] bg-[#24282c] border border-[#30363d] rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.02),4px_4px_10px_rgba(0,0,0,0.2)] flex flex-col justify-center relative mt-6">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#343a40] p-1 rounded-full shadow-[0_4px_15px_rgba(149,191,166,0.3)]">
               <div className="w-12 h-12 bg-[#1b3b40] rounded-full overflow-hidden border-2 border-[#2a5056] flex items-center justify-center">
                 <img src="/img/nexus_ai.jpg" alt="NEXUS AI" className="w-full h-full object-cover" />
               </div>
            </div>
            <h4 className="font-bold text-[#e6f0ed] flex items-center gap-2 text-sm mb-2 mt-4">
               NEXUS AI
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#95bfa6] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#95bfa6]"></span>
               </span>
            </h4>
            <p className="text-xs text-[#8baaa6] leading-relaxed italic">
              {inteligenciaReal?.essenciais?.valor === 0 ? "Seus gastos essenciais estão zerados? Comece definindo um orçamento realista!" : "Mantenha o foco nos seus objetivos para este mês. Você está no caminho certo!"}
            </p>
          </div>
        </div>
      </div>

      {/* Evolução Financeira e Distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-8">
        <div className="lg:col-span-2 bg-[#2a2e33] rounded-3xl p-6 border border-[#353a40] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.02),8px_8px_20px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#e2e8f0] flex items-center gap-2"><TrendingUp size={18} className="text-[#a4c5c1]" /> Evolução Financeira (6 Meses)</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={(evolucaoReal || [])} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#353a40" />
                <XAxis dataKey="name" stroke="#8e98a3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8e98a3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#2a2e33', borderColor: '#353a40', borderRadius: '16px', color: '#fff' }} />
                <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f3cd57', stroke: '#fff' }} />
                <Line type="monotone" dataKey="despesas" name="Despesas" stroke="#e69894" strokeWidth={3} dot={{ fill: '#e69894', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f7a5a1', stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-[#2a2e33] rounded-3xl p-6 border border-[#353a40] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.02),8px_8px_20px_rgba(0,0,0,0.4)]">
          <h2 className="text-lg font-bold text-[#e2e8f0] mb-6 flex items-center gap-2"><Target size={18} className="text-[#a4c5c1]" /> Distribuição</h2>
          {(categoriasReais || []).length === 0 ? (
            <div className="flex h-48 items-center justify-center text-[#8e98a3] text-sm">Nenhuma despesa no período.</div>
          ) : (
            <div className="flex items-center justify-between h-48">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoriasReais} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                      {(categoriasReais || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 flex flex-col gap-3 pl-4 overflow-y-auto max-h-48">
                {(categoriasReais || []).map((item, index) => (
                  <div key={index} className="flex flex-col text-xs bg-[#24282c] p-2 rounded-xl border border-[#30363d]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-2xl" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[#8e98a3] truncate w-16 font-semibold">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#e2e8f0]">R$ {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Agenda */}
        <div className="bg-[#2a2e33] rounded-3xl p-6 border border-[#353a40] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.02),8px_8px_20px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#e2e8f0] flex items-center gap-2"><CalendarClock className="text-[#a4c5c1]" size={18}/> Agenda de Pagamentos</h2>
            <button onClick={() => setModalAgendamentoAberto(true)} className="bg-[#1b3b40] hover:bg-[#2a5056] text-[#a4c5c1] text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#316168] shadow-[2px_2px_5px_rgba(0,0,0,0.2)] transition-colors">
              <Zap size={12} /> NOVO
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {(agendamentosReais || []).length === 0 ? (
              <p className="text-[#8e98a3] text-sm text-center py-8">Nenhuma conta na fila.</p>
            ) : (
              (agendamentosReais || []).map((agenda) => (
                <div key={agenda.id} className="flex items-center justify-between p-4 bg-[#24282c] border border-[#30363d] rounded-2xl hover:bg-[#2d3238] transition-colors group shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#e69894]/10 text-[#e69894] border border-[#e69894]/20"><CalendarClock size={18} /></div>
                    <div>
                      <h4 className="font-bold text-[#e2e8f0] text-sm">{agenda.descricao}</h4>
                      <p className="text-[#8e98a3] text-[10px] mt-1 uppercase tracking-widest">Vence dia <span className="font-bold">{agenda.data_vencimento.split('-').reverse().join('/')}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#e69894]">{(agenda.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handlePagarAgendamento(agenda.id)} className="bg-[#95bfa6] hover:bg-[#a6d1b7] text-[#1a2f24] p-2 rounded-xl transition-colors font-bold shadow-[2px_2px_5px_rgba(0,0,0,0.3)]" title="Pagar"><CheckSquare size={16} /></button>
                      <button onClick={() => handleExcluirAgendamento(agenda.id)} className="bg-[#30363d] hover:bg-[#e69894] text-[#8e98a3] hover:text-[#4a1c1a] p-2 rounded-xl transition-colors shadow-[2px_2px_5px_rgba(0,0,0,0.3)]" title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Extrato */}
        <div className="bg-[#2a2e33] rounded-3xl p-6 border border-[#353a40] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.02),8px_8px_20px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#e2e8f0] flex items-center gap-2"><ArrowRightLeft className="text-[#a4c5c1]" size={18}/> Transações Recentes</h2>
          </div>
          <div className="flex flex-col gap-3">
            {(transacoesReais || []).slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-[#24282c] border border-[#30363d] rounded-2xl hover:bg-[#2d3238] transition-colors group shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${tx.tipo === 'Receita' ? 'bg-[#95bfa6]/10 text-[#95bfa6] border-[#95bfa6]/20' : tx.tipo === 'Cartao' ? 'bg-[#1b3b40] text-[#a4c5c1] border-[#2a5056]' : 'bg-[#e69894]/10 text-[#e69894] border-[#e69894]/20'}`}>
                     {tx.tipo === 'Receita' ? <TrendingUp size={16}/> : tx.tipo === 'Cartao' ? <Wallet size={16}/> : <TrendingDown size={16}/>}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#e2e8f0] text-sm">{tx.categoria}</h4>
                    <p className="text-[#8e98a3] text-[10px] mt-1">{tx.data.split('-').reverse().join('/')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${tx.tipo === 'Receita' ? 'text-[#95bfa6]' : tx.tipo === 'Cartao' ? 'text-[#a4c5c1]' : 'text-[#e69894]'}`}>
                    {tx.tipo === 'Receita' ? '+' : '-'}{(tx.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleExcluirTransacao(tx.id)} className="bg-[#30363d] hover:bg-[#e69894] text-[#8e98a3] hover:text-[#4a1c1a] p-2 rounded-xl transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
            {(transacoesReais || []).length === 0 && <p className="text-[#8e98a3] text-sm text-center py-4">Nenhuma transação registrada.</p>}
          </div>
        </div>
      </div>
      
    </motion.div>
  );
}
