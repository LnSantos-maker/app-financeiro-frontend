import { Target, Plus, Calendar, Pencil, Download, TrendingUp as Speed } from 'lucide-react';

export default function MetasView({
  totalGuardado,
  totalObjetivoGlobal,
  progressoGlobal,
  metasReais,
  setModalCofreAberto,
  abrirModalEditMeta,
  abrirModalResgate,
  abrirModalAporte
}) {
  return (
    <div className="animate-in fade-in duration-300">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Meus Cofres e Metas</h1>
          <p className="text-zinc-400 text-sm">Planeje, invista e acompanhe a realização dos seus sonhos.</p>
        </div>
        <button onClick={() => setModalCofreAberto(true)} className=" bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <Plus size={20} /> Novo Cofre
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-[#161922] to-[#090b10] border border-emerald-500/30 rounded-2xl p-6 shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-zinc-100">
            <Target size={64} />
          </div>
          <h3 className="text-zinc-400 text-sm mb-2">Total Guardado Hoje</h3>
          <p className="text-4xl font-bold text-zinc-100 mb-1">
            {totalGuardado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-zinc-100 text-xs font-medium tracking-wide uppercase mt-4">Liquidez Imediata</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none">
          <h3 className="text-zinc-400 text-sm mb-2">Meta Global</h3>
          <p className="text-3xl font-bold text-zinc-400 mb-1">
            {totalObjetivoGlobal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-zinc-400 text-xs mt-4">Soma de todos os objetivos</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none flex flex-col justify-center">
          <h3 className="text-zinc-400 text-sm mb-4">Progresso Médio Geral</h3>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-zinc-100">{progressoGlobal}%</div>
            <div className="flex-1 h-3 bg-zinc-800 rounded-2xl overflow-hidden">
              <div className="h-full  from-[#8c6b4a] to-[#d4af37] rounded-2xl transition-all duration-1000" style={{ width: `${progressoGlobal}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {(metasReais || []).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-zinc-900 border border-dashed border-zinc-700 rounded-2xl p-8 shadow-none">
          <Target size={48} className="text-zinc-400 mb-4" />
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Sua lista de sonhos está vazia!</h2>
          <p className="text-zinc-400 text-sm">Crie seu primeiro cofre para começar a guardar dinheiro de forma organizada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          {(metasReais || []).map((cofre) => (
            <div key={cofre.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none hover:border-emerald-500/30 transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-1">{cofre.titulo}</h3>
                  <p className="text-zinc-400 text-xs flex items-center gap-1">
                    <Calendar size={12} /> {cofre.dias_restantes} dias restantes para o alvo
                  </p>
                </div>
                <button onClick={() => abrirModalEditMeta(cofre)} className="text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl bg-[#0a0a0a] border border-zinc-800" title="Editar Cofre">
                  <Pencil size={16} />
                </button>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-2xl p-5 mb-6 border border-zinc-800 flex-1">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-zinc-400 text-xs mb-1 uppercase tracking-wider font-semibold">Guardado</p>
                    <p className="text-2xl font-bold text-zinc-100">R$ {(cofre.guardado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-400 text-xs mb-1 uppercase tracking-wider font-semibold">Objetivo</p>
                    <p className="text-lg font-bold text-zinc-400">R$ {(cofre.objetivo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="h-3 w-full bg-zinc-800 rounded-2xl mt-4 mb-2 overflow-hidden">
                  <div className="h-full  from-[#8c6b4a] to-[#d4af37] rounded-2xl transition-all duration-1000" style={{ width: `${cofre.progresso}%` }}></div>
                </div>
                <div className="flex justify-end">
                  <span className="text-xs font-bold text-zinc-100 bg-zinc-800 px-2 py-1 rounded">{cofre.progresso}% concluído</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => abrirModalResgate(cofre.id)} className="flex-1 bg-zinc-800 hover:bg-slate-700 text-zinc-100 font-medium py-3 rounded-2xl transition-colors text-sm flex justify-center items-center gap-2 border border-zinc-700">
                  <Download size={16} /> Resgatar
                </button>
                <button onClick={() => abrirModalAporte(cofre.id)} className="flex-1 bg-zinc-800 hover:bg-[#d4af37]/20 text-zinc-100 font-bold py-3 rounded-2xl transition-colors text-sm flex justify-center items-center gap-2 border border-emerald-500/30">
                  <Speed size={16} /> Aportar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
