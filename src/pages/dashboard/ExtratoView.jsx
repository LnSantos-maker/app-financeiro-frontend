import { useState } from 'react';
import { Search, Filter, Zap, CreditCard, ShoppingBag, Pencil, Trash2 } from 'lucide-react';

export default function ExtratoView({
  transacoesReais,
  abrirModalEditTx,
  handleExcluirTransacao
}) {
  const [buscaExtrato, setBuscaExtrato] = useState('');
  const [filtroTipoExtrato, setFiltroTipoExtrato] = useState('Todos'); 

  const transacoesFiltradas = (transacoesReais || []).filter(tx => {
    const bateuBusca = tx.categoria.toLowerCase().includes(buscaExtrato.toLowerCase());
    const bateuTipo = filtroTipoExtrato === 'Todos' || tx.tipo === filtroTipoExtrato;
    return bateuBusca && bateuTipo;
  });

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100vh-80px)]">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Extrato Completo</h1>
          <p className="text-slate-400 text-sm">Busque, filtre e analise todo o seu histórico financeiro.</p>
        </div>
      </header>

      <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-5 mb-6 flex flex-col md:flex-row gap-4 shadow-lg shrink-0">
        <div className="flex-1 bg-[#090b10] border border-slate-800 rounded-xl px-4 py-3 flex gap-3 items-center focus-within:border-[#d4af37] transition-colors">
          <Search className="text-slate-500 shrink-0" size={20} />
          <input type="text" value={buscaExtrato} onChange={(e) => setBuscaExtrato(e.target.value)} placeholder="Buscar por nome da transação, mercado, faculdade..." className="bg-transparent text-white text-sm outline-none w-full placeholder:text-slate-600" />
        </div>
        <div className="md:w-64 bg-[#090b10] border border-slate-800 rounded-xl px-4 py-3 flex gap-3 items-center focus-within:border-[#d4af37] transition-colors">
          <Filter className="text-slate-500 shrink-0" size={20} />
          <select value={filtroTipoExtrato} onChange={(e) => setFiltroTipoExtrato(e.target.value)} className="bg-transparent text-white text-sm outline-none w-full cursor-pointer">
            <option value="Todos" className="bg-[#090b10]">Todas as Transações</option>
            <option value="Receita" className="bg-[#090b10]">Apenas Receitas</option>
            <option value="Despesa" className="bg-[#090b10]">Apenas Despesas</option>
            <option value="Cartao" className="bg-[#090b10]">Apenas Cartão de Crédito</option>
          </select>
        </div>
      </div>
      
      <div className="bg-[#161922] border border-slate-800/60 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-lg">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800/60 bg-black/20 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <div className="col-span-2">Data</div>
          <div className="col-span-5">Descrição</div>
          <div className="col-span-2 text-center">Tipo</div>
          <div className="col-span-2 text-right">Valor</div>
          <div className="col-span-1 text-center">Ações</div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {transacoesFiltradas.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Search size={48} className="mb-4 text-slate-700 opacity-50" />
              <p>Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {transacoesFiltradas.map((tx) => (
                <div key={tx.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-[#090b10] rounded-xl transition-colors group">
                  <div className="col-span-2 text-sm text-slate-400">{tx.data.split('-').reverse().join('/')}</div>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${tx.tipo === 'Receita' ? 'bg-emerald-500/10 text-emerald-400' : tx.tipo === 'Cartao' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-rose-500/10 text-rose-400'}`}>
                      {tx.tipo === 'Receita' ? <Zap size={16} /> : tx.tipo === 'Cartao' ? <CreditCard size={16} /> : <ShoppingBag size={16} />}
                    </div>
                    <span className="text-white font-medium truncate">{tx.categoria}</span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${tx.tipo === 'Receita' ? 'bg-emerald-500/20 text-emerald-400' : tx.tipo === 'Cartao' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-rose-500/20 text-rose-400'}`}>
                      {tx.tipo === 'Cartao' ? 'Cartão' : tx.tipo}
                    </span>
                  </div>
                  <div className={`col-span-2 text-right font-bold ${tx.tipo === 'Receita' ? 'text-emerald-400' : tx.tipo === 'Cartao' ? 'text-[#d4af37]' : 'text-rose-400'}`}>
                    {tx.tipo === 'Receita' ? '+' : '-'}{(tx.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div className="col-span-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {tx.tipo !== 'Cartao' && (
                      <button onClick={() => abrirModalEditTx(tx)} className="text-slate-600 hover:text-[#d4af37] p-1 rounded transition-colors" title="Editar"><Pencil size={16} /></button>
                    )}
                    <button onClick={() => handleExcluirTransacao(tx.id)} className="text-slate-600 hover:text-rose-500 p-1 rounded transition-colors" title="Excluir"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
