import { useState, useMemo } from 'react';
import { Search, Filter, Pencil, Trash2, TrendingUp, TrendingDown, Clock, MousePointerClick } from 'lucide-react';
import { TransactionIcon } from '../../components/ui/TransactionIcon';
import { motion } from 'framer-motion';
import { useFinanceStore } from '../../store/useFinanceStore';

export default function ExtratoView({
  transacoesReais,
  abrirModalEditTx,
  handleExcluirTransacao
}) {
  const [buscaExtrato, setBuscaExtrato] = useState('');
  const [filtroTipoExtrato, setFiltroTipoExtrato] = useState('Todos'); 

  const transacoesFiltradas = useMemo(() => {
    return (transacoesReais || []).filter(tx => {
      const bateuBusca = tx.categoria.toLowerCase().includes(buscaExtrato.toLowerCase());
      const bateuTipo = filtroTipoExtrato === 'Todos' || tx.tipo === filtroTipoExtrato;
      return bateuBusca && bateuTipo;
    }).sort((a, b) => new Date(b.data) - new Date(a.data));
  }, [transacoesReais, buscaExtrato, filtroTipoExtrato]);

  const totalReceitas = transacoesFiltradas.filter(t => t.tipo === 'Receita').reduce((a, b) => a + parseFloat(b.valor), 0);
  const totalDespesas = transacoesFiltradas.filter(t => t.tipo === 'Despesa' || t.tipo === 'Cartao').reduce((a, b) => a + parseFloat(b.valor), 0);

  const transacoesAgrupadas = transacoesFiltradas.reduce((acc, tx) => {
    const dataObj = new Date(tx.data);
    dataObj.setMinutes(dataObj.getMinutes() + dataObj.getTimezoneOffset());
    const hoje = new Date();
    let dataLabel = tx.data.split('-').reverse().join('/');
    
    if (dataObj.toDateString() === hoje.toDateString()) {
      dataLabel = "Hoje";
    } else {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      if (dataObj.toDateString() === ontem.toDateString()) dataLabel = "Ontem";
    }

    if (!acc[dataLabel]) acc[dataLabel] = [];
    acc[dataLabel].push(tx);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col min-h-screen pb-24 md:h-[calc(100vh-100px)] md:pb-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6 sm:mb-8 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--text-main)] mb-1 flex items-center gap-2">Extrato</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Histórico completo de movimentos e fluxo de caixa</p>
        </div>

        <div className="hidden md:flex gap-6 bg-[#0a0c10] border border-white/5 p-4 rounded-2xl shadow-inner">
           <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1"><TrendingUp size={12} className="text-teal-500"/> Entradas</span>
              <span className="text-teal-400 font-medium">R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           </div>
           <div className="w-[1px] bg-white/5"></div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1"><TrendingDown size={12} className="text-rose-500"/> Saídas</span>
              <span className="text-rose-400 font-medium">R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
           </div>
        </div>
      </header>

      <div className="bg-[var(--bg-card)] border border-white/5 rounded-3xl p-3 mb-6 flex flex-col md:flex-row gap-3 shadow-premium shrink-0 backdrop-blur-md">
        <div className="flex-1 bg-[#0a0c10] border border-white/5 rounded-2xl px-4 py-3 flex gap-3 items-center focus-within:border-teal-500/50 transition-colors shadow-inner">
          <Search className="text-slate-500 shrink-0" size={20} />
          <input type="text" value={buscaExtrato} onChange={(e) => setBuscaExtrato(e.target.value)} placeholder="Pesquisar por transação, categoria..." className="bg-transparent text-white text-sm outline-none w-full placeholder:text-slate-500" />
        </div>
        <div className="md:w-64 bg-[#0a0c10] border border-white/5 rounded-2xl px-4 py-3 flex gap-3 items-center focus-within:border-teal-500/50 transition-colors shadow-inner">
          <Filter className="text-slate-500 shrink-0" size={20} />
          <select value={filtroTipoExtrato} onChange={(e) => setFiltroTipoExtrato(e.target.value)} className="bg-transparent text-slate-300 text-sm outline-none w-full cursor-pointer appearance-none">
            <option value="Todos" className="bg-[#0a0c10]">Todos os Movimentos</option>
            <option value="Receita" className="bg-[#0a0c10]">Apenas Entradas</option>
            <option value="Despesa" className="bg-[#0a0c10]">Apenas Saídas</option>
            <option value="Cartao" className="bg-[#0a0c10]">Cartão de Crédito</option>
          </select>
        </div>
      </div>
      
      <div className="bg-[var(--bg-card)] border border-white/5 rounded-3xl flex-1 overflow-hidden flex flex-col shadow-premium backdrop-blur-md relative">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#0a0c10]/80 to-transparent z-10 pointer-events-none"></div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin relative z-0">
          {transacoesFiltradas.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 relative">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-main)] opacity-50 z-0 pointer-events-none"></div>
               <div className="relative z-10 bg-[#0a0c10] p-6 rounded-3xl mb-6 border border-teal-500/20 shadow-[0_0_30px_rgba(45,212,191,0.1)]">
                 <MousePointerClick size={48} className="text-teal-500 opacity-80" />
               </div>
               <h3 className="text-xl font-light text-white mb-2 relative z-10">Filtro sem resultados</h3>
               <p className="max-w-xs text-center text-sm relative z-10">Pressione <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 mx-1 font-mono">Ctrl+K</kbd> para lançar uma nova transação agora mesmo.</p>
            </div>
          ) : (
            <div className="flex flex-col p-4 pb-20 pt-6">
              {Object.keys(transacoesAgrupadas).map(data => (
                <div key={data} className="mb-8">
                   <div className="flex items-center gap-3 mb-4 px-2">
                     <Clock size={14} className="text-slate-500" />
                     <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{data}</h3>
                     <div className="flex-1 h-[1px] bg-gradient-to-r from-white/5 to-transparent"></div>
                   </div>

                   <div className="flex flex-col gap-2">
                     {transacoesAgrupadas[data].map((tx, idx) => (
                       <motion.div 
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: idx * 0.03, type: "spring", stiffness: 300, damping: 30 }}
                         key={tx.id} 
                         className="group flex flex-col md:flex-row items-center justify-between p-4 bg-[#0a0c10] border border-white/5 rounded-2xl hover:bg-[#111318] transition-all hover:shadow-[0_0_20px_rgba(45,212,191,0.05)] hover:border-teal-500/20 cursor-pointer"
                       >
                         <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                           <div className={`p-3 rounded-xl shrink-0 flex items-center justify-center shadow-inner border border-white/5 ${tx.tipo === 'Receita' ? 'bg-teal-500/10 text-teal-400' : tx.tipo === 'Cartao' ? 'bg-purple-500/10 text-purple-400' : 'bg-rose-500/10 text-rose-400'}`}>
                             <TransactionIcon categoria={tx.categoria} tipo={tx.tipo} size={20} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-slate-200 font-medium text-base leading-tight">{tx.categoria.split(':')[0]}</span>
                             {tx.categoria.includes(':') && <span className="text-slate-500 text-sm mt-0.5">{tx.categoria.split(':')[1]}</span>}
                           </div>
                         </div>
                         
                         <div className="flex items-center justify-between w-full md:w-auto gap-8">
                           <div className="flex justify-center shrink-0">
                             <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest ${tx.tipo === 'Receita' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : tx.tipo === 'Cartao' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                               {tx.tipo === 'Cartao' ? 'Crédito' : tx.tipo}
                             </span>
                           </div>

                           <div className={`text-right font-medium text-lg w-32 shrink-0 ${tx.tipo === 'Receita' ? 'text-teal-400' : tx.tipo === 'Cartao' ? 'text-slate-300' : 'text-rose-400'}`}>
                             {tx.tipo === 'Receita' ? '+' : '-'}{(tx.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                           </div>
                           
                           <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity w-20 shrink-0">
                             {tx.tipo !== 'Cartao' && (
                               <button onClick={(e) => { e.stopPropagation(); abrirModalEditTx(tx); }} className="text-slate-500 hover:text-white bg-white/5 hover:bg-teal-500/20 p-2 rounded-xl transition-colors border border-white/5" title="Editar"><Pencil size={16} /></button>
                             )}
                             <button onClick={(e) => { e.stopPropagation(); handleExcluirTransacao(tx.id); }} className="text-slate-500 hover:text-rose-400 bg-white/5 hover:bg-rose-500/20 p-2 rounded-xl transition-colors border border-white/5" title="Excluir"><Trash2 size={16} /></button>
                           </div>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
