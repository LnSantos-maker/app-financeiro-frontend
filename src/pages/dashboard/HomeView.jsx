import { ChevronLeft, ChevronRight, CalendarClock, TrendingUp, TrendingDown, ArrowRightLeft, Wallet, Pencil, Target, BrainCircuit, ChevronDown, Calendar, CheckSquare, Trash2, Zap, CreditCard, ShoppingBag, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function HomeView({
  // Variáveis
  // Variáveis
  saldoReal,
  totalGuardado,
  balancoReal,
  inteligenciaReal,
  categoriaExpandida,
  agendamentosReais,
  evolucaoReal,
  categoriasReais,
  transacoesReais,
  
  // Funções Gerais
  mesFormatadoExibicao,
  mesAnterior,
  proximoMes,
  toggleCategoria,

  // Abertura de Modais
  setModalAgendamentoAberto,
  setModalReceitaAberto,
  setModalDespesaAberto,
  abrirModalAporte,
  abrirModalEditSaldo,
  abrirModalEditTx,

  // Ações de Transação / Agendamento
  handlePagarAgendamento,
  handleExcluirAgendamento,
  handleExcluirTransacao
}) {
  return (
    <div className="animate-in fade-in duration-300">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 shadow-none">
          <button onClick={mesAnterior} className="p-1 hover:bg-zinc-800 hover:text-zinc-100 rounded-xl transition-colors text-zinc-400"><ChevronLeft size={24} /></button>
          <div className="flex flex-col items-center min-w-[140px]">
            <span className="text-xl font-bold text-zinc-100 capitalize">{mesFormatadoExibicao}</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Período Selecionado</span>
          </div>
          <button onClick={proximoMes} className="p-1 hover:bg-zinc-800 hover:text-zinc-100 rounded-xl transition-colors text-zinc-400"><ChevronRight size={24} /></button>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setModalAgendamentoAberto(true)} className="bg-emerald-500/10 text-white hover:bg-emerald-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all border border-indigo-500/20"><CalendarClock size={18} /> Agendar</button>
          <button onClick={() => setModalReceitaAberto(true)} className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all border border-emerald-500/20"><TrendingUp size={18} /> Receita</button>
          <button onClick={() => setModalDespesaAberto(true)} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all border border-rose-500/20"><TrendingDown size={18} /> Despesa</button>
          <button onClick={() => abrirModalAporte('')} className=" bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-none"><ArrowRightLeft size={18} /> Guardar</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:border-emerald-500/30 group shadow-none">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-zinc-800 p-2 rounded-xl text-zinc-100"><Wallet size={20} /></div>
            <div className="flex gap-2">
              <button onClick={abrirModalEditSaldo} className="text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md hover:bg-zinc-800" title="Editar Saldo Manualmente"><Pencil size={18} /></button>
            </div>
          </div>
          <h3 className="text-zinc-400 text-sm mb-1">Saldo Livre</h3>
          <p className="text-3xl font-mono text-zinc-100 mb-1">{(saldoReal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p className="text-zinc-400 text-xs">Disponível para uso</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:border-emerald-500/30 shadow-none">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400"><Target size={20} /></div>
          </div>
          <h3 className="text-zinc-400 text-sm mb-1">Total Guardado</h3>
          <p className="text-3xl font-mono text-emerald-400 mb-1">{(totalGuardado || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p className="text-zinc-400 text-xs">Soma de todos os cofres</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:border-emerald-500/30 shadow-none">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-zinc-800/50 p-2 rounded-xl text-zinc-400"><ArrowRightLeft size={20} /></div>
          </div>
          <h3 className="text-zinc-400 text-sm mb-1">Balanço do Mês</h3>
          <p className={`text-3xl font-mono mb-1 ${(balancoReal?.balanco || 0) >= 0 ? 'text-zinc-100' : 'text-rose-400'}`}>{(balancoReal?.balanco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p className="text-zinc-400 text-xs">R: {(balancoReal?.receitas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} · D: {(balancoReal?.despesas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-none">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-zinc-800 p-2 rounded-xl text-zinc-100"><BrainCircuit size={24} /></div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 mb-1">Diagnóstico Financeiro (50/30/20)</h2>
            <p className="text-zinc-400 text-sm">Com base nas receitas do mês selecionado: {(inteligenciaReal?.total_receitas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => toggleCategoria('essenciais')} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:bg-black/40 transition-colors group">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-zinc-100 flex items-center gap-1 group-hover:text-zinc-400 transition-colors">Essenciais <ChevronDown size={14} className={`transition-transform ${categoriaExpandida === 'essenciais' ? 'rotate-180' : ''}`} /></h4>
              <span className={`text-xs font-bold px-2 py-1 rounded ${(inteligenciaReal?.essenciais?.porcentagem || 0) > 50 ? 'bg-rose-500/20 text-rose-400' : 'bg-zinc-800 text-zinc-300'}`}>{inteligenciaReal?.essenciais?.porcentagem || 0}% (Ideal: 50%)</span>
            </div>
            <p className="text-3xl font-bold text-zinc-100 mb-3">{(inteligenciaReal?.essenciais?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <div className="h-2 w-full bg-zinc-800 rounded-2xl overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${(inteligenciaReal?.essenciais?.porcentagem || 0) > 50 ? 'bg-rose-500' : 'bg-slate-500'}`} style={{ width: `${Math.min(inteligenciaReal?.essenciais?.porcentagem || 0, 100)}%` }}></div>
            </div>
            {categoriaExpandida === 'essenciais' && (
              <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                {(inteligenciaReal?.essenciais?.itens || []).map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 capitalize">{item.nome}</span>
                    <span className="text-zinc-400 font-medium">{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                ))}
                {(inteligenciaReal?.essenciais?.itens || []).length === 0 && <span className="text-xs text-zinc-400 italic">Nenhum gasto essencial registrado.</span>}
              </div>
            )}
          </div>

          <div onClick={() => toggleCategoria('estilo_vida')} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:bg-black/40 transition-colors group">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-zinc-100 flex items-center gap-1 group-hover:text-zinc-100 transition-colors">Estilo de Vida <ChevronDown size={14} className={`transition-transform ${categoriaExpandida === 'estilo_vida' ? 'rotate-180' : ''}`} /></h4>
              <span className={`text-xs font-bold px-2 py-1 rounded ${(inteligenciaReal?.estilo_vida?.porcentagem || 0) > 30 ? 'bg-rose-500/20 text-rose-400' : 'bg-[#d4af37]/20 text-zinc-100'}`}>{inteligenciaReal?.estilo_vida?.porcentagem || 0}% (Ideal: 30%)</span>
            </div>
            <p className="text-3xl font-bold text-zinc-100 mb-3">{(inteligenciaReal?.estilo_vida?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <div className="h-2 w-full bg-zinc-800 rounded-2xl overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${(inteligenciaReal?.estilo_vida?.porcentagem || 0) > 30 ? 'bg-rose-500' : 'bg-[#d4af37]'}`} style={{ width: `${Math.min(inteligenciaReal?.estilo_vida?.porcentagem || 0, 100)}%` }}></div>
            </div>
            {categoriaExpandida === 'estilo_vida' && (
              <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                {(inteligenciaReal?.estilo_vida?.itens || []).map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 capitalize">{item.nome}</span>
                    <span className="text-zinc-400 font-medium">{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                ))}
                {(inteligenciaReal?.estilo_vida?.itens || []).length === 0 && <span className="text-xs text-zinc-400 italic">Nenhum gasto de lazer registrado.</span>}
              </div>
            )}
          </div>

          <div onClick={() => toggleCategoria('futuro')} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:bg-black/40 transition-colors group">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-zinc-100 flex items-center gap-1 group-hover:text-zinc-100 transition-colors">Investimento <ChevronDown size={14} className={`transition-transform ${categoriaExpandida === 'futuro' ? 'rotate-180' : ''}`} /></h4>
              <span className={`text-xs font-bold px-2 py-1 rounded ${(inteligenciaReal?.futuro?.porcentagem || 0) >= 20 ? 'bg-[#d4af37]/20 text-zinc-100' : 'bg-zinc-800 text-zinc-300'}`}>{inteligenciaReal?.futuro?.porcentagem || 0}% (Ideal: 20%)</span>
            </div>
            <p className="text-3xl font-bold text-zinc-100 mb-3">{(inteligenciaReal?.futuro?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <div className="h-2 w-full bg-zinc-800 rounded-2xl overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${(inteligenciaReal?.futuro?.porcentagem || 0) >= 20 ? 'bg-[#d4af37]' : 'bg-slate-500'}`} style={{ width: `${Math.min(inteligenciaReal?.futuro?.porcentagem || 0, 100)}%` }}></div>
            </div>
            {categoriaExpandida === 'futuro' && (
              <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                {(inteligenciaReal?.futuro?.itens || []).map((item, index) => (
                  <div key={index} className={`flex justify-between items-center text-sm ${item.valor < 0 ? 'text-amber-400' : ''}`}>
                    <span className="capitalize">{item.nome}</span>
                    <span className="font-medium">{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                ))}
                {(inteligenciaReal?.futuro?.itens || []).length === 0 && <span className="text-xs text-zinc-400 italic">Nenhum aporte realizado este mês.</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2"><CalendarClock className="text-zinc-100" /> Agenda de Pagamentos</h2>
          <button onClick={() => setModalAgendamentoAberto(true)} className="text-zinc-100 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors"><Plus size={16} /> Nova Conta</button>
        </div>
        <div className="flex flex-col gap-4">
          {(agendamentosReais || []).length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-4">Nenhuma conta agendada para este mês.</p>
          ) : (
            (agendamentosReais || []).map((agenda) => (
              <div key={agenda.id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-zinc-800 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-white"><Calendar size={20} /></div>
                  <div>
                    <h4 className="font-semibold text-zinc-100">{agenda.categoria}: {agenda.descricao}</h4>
                    <p className="text-zinc-400 text-xs flex items-center gap-1 mt-1">Vence dia: <span className="text-indigo-300 font-bold">{agenda.data_vencimento.split('-').reverse().join('/')}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-rose-400 text-lg">{(agenda.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handlePagarAgendamento(agenda.id)} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold px-4 py-2 rounded-xl flex items-center gap-1 transition-colors text-sm border border-emerald-500/20"><CheckSquare size={16} /> Pagar</button>
                    <button onClick={() => handleExcluirAgendamento(agenda.id)} className="text-zinc-400 hover:text-rose-500 p-2 rounded transition-colors" title="Cancelar Agendamento"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-zinc-100 mb-1">Evolução Financeira (Últimos 6 Meses)</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={(evolucaoReal || [])} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#090b10', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#d4af37' }} />
                <Line type="monotone" dataKey="saldo" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f3cd57', stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none">
          <h2 className="text-lg font-bold text-zinc-100 mb-1">Gastos por Categoria</h2>
          {(categoriasReais || []).length === 0 ? (
            <div className="flex h-48 items-center justify-center text-zinc-400 text-sm">Nenhuma despesa no período.</div>
          ) : (
            <div className="flex items-center justify-between h-48 mt-4">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoriasReais} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                      {(categoriasReais || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 flex flex-col gap-3 pl-4">
                {(categoriasReais || []).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-2xl" style={{ backgroundColor: item.color }}></div>
                      <span className="text-zinc-400 truncate w-16">{item.name}</span>
                    </div>
                    <span className="font-medium text-zinc-100">R$ {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none pb-10">
        <h2 className="text-lg font-bold text-zinc-100 mb-6">Transações do Mês (Extrato)</h2>
        <div className="flex flex-col gap-4">
          {(transacoesReais || []).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-800 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${tx.tipo === 'Receita' ? 'bg-emerald-500/10 text-emerald-400' : tx.tipo === 'Cartao' ? 'bg-zinc-800 text-zinc-100' : 'bg-rose-500/10 text-rose-400'}`}>
                  {tx.tipo === 'Receita' ? <Zap size={20} /> : tx.tipo === 'Cartao' ? <CreditCard size={20} /> : <ShoppingBag size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-100">{tx.categoria}</h4>
                  <p className="text-zinc-400 text-xs">{tx.tipo === 'Cartao' ? 'Cartão de Crédito' : tx.tipo} · {tx.data.split('-').reverse().join('/')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-bold ${tx.tipo === 'Receita' ? 'text-emerald-400' : tx.tipo === 'Cartao' ? 'text-zinc-100' : 'text-rose-400'}`}>
                  {tx.tipo === 'Receita' ? '+' : '-'}{(tx.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <div className="flex gap-1">
                  {tx.tipo !== 'Cartao' && (
                    <button onClick={() => abrirModalEditTx(tx)} className="text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-all p-1" title="Editar transação"><Pencil size={18} /></button>
                  )}
                  <button onClick={() => handleExcluirTransacao(tx.id)} className="text-zinc-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1" title="Apagar transação"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
          {(transacoesReais || []).length === 0 && <p className="text-zinc-400 text-sm text-center py-4">Nenhuma transação registrada neste mês.</p>}
        </div>
      </div>
    </div>
  );
}
