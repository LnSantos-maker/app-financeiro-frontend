import { Target, Plus, Calendar, Pencil, Download, TrendingUp as Speed, ArrowUpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-[var(--text-main)] mb-1 flex items-center gap-2">Cofres Inteligentes</h1>
          <p className="text-slate-500 text-sm">Proteja o seu patrimônio e acelere a realização dos seus sonhos.</p>
        </div>
        <button onClick={() => setModalCofreAberto(true)} className="bg-[var(--accent)] hover:bg-teal-400 text-[#0f1115] font-bold px-6 py-3 rounded-2xl flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)]">
          <Plus size={20} /> Novo Objetivo
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[var(--bg-card)] border border-teal-500/20 rounded-3xl p-8 shadow-premium relative overflow-hidden group hover:border-teal-500/40 transition-colors">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all duration-500"></div>
          <div className="absolute top-6 right-6 opacity-20 text-teal-500">
            <Target size={48} />
          </div>
          <h3 className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-4">Total Acumulado</h3>
          <p className="text-4xl font-light text-white mb-2">
            {totalGuardado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-slate-500 text-xs mt-2">Patrimônio protegido e alocado</p>
        </div>
        
        <div className="bg-[var(--bg-card)] border border-white/5 rounded-3xl p-8 shadow-premium">
          <h3 className="text-slate-500 text-xs font-semibold tracking-widest uppercase mb-4">Meta Global</h3>
          <p className="text-3xl font-light text-slate-300 mb-2">
            {totalObjetivoGlobal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-slate-500 text-xs mt-2">Soma do alvo de todos os cofres</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-white/5 rounded-3xl p-8 shadow-premium flex flex-col justify-center">
          <h3 className="text-slate-500 text-xs font-semibold tracking-widest uppercase mb-4">Jornada Concluída</h3>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-light text-teal-400">{progressoGlobal}%</div>
            <div className="flex-1 h-3 bg-[#0a0c10] rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressoGlobal}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-teal-500 rounded-full relative overflow-hidden"
              >
                 <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {(metasReais || []).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-center bg-[var(--bg-card)] border border-white/5 rounded-3xl p-8 shadow-premium backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-main)] opacity-50 z-0 pointer-events-none"></div>
          <div className="relative z-10 bg-[#0a0c10] p-6 rounded-2xl text-teal-500 mb-6 border border-teal-500/20 shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <ArrowUpCircle size={48} />
          </div>
          <h2 className="text-2xl font-light tracking-tight text-white mb-2 relative z-10">Você ainda não definiu um norte.</h2>
          <p className="text-slate-500 max-w-sm text-sm mb-8 relative z-10">Pressione <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 mx-1 font-mono text-xs">Ctrl+K</kbd> e pesquise "Novo Cofre" para construir a sua Reserva de Emergência.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(metasReais || []).map((cofre, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={cofre.id} 
              className="bg-[var(--bg-card)] border border-white/5 rounded-3xl p-6 shadow-premium hover:border-teal-500/20 transition-all group flex flex-col relative overflow-hidden"
            >
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-colors"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">{cofre.titulo}</h3>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <Calendar size={12} /> {cofre.dias_restantes} dias para a meta
                  </p>
                </div>
                <button onClick={() => abrirModalEditMeta(cofre)} className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl bg-[#0a0c10] border border-white/5 shadow-inner" title="Editar Cofre">
                  <Pencil size={16} />
                </button>
              </div>
              
              <div className="bg-[#0a0c10] rounded-2xl p-5 mb-6 border border-white/5 flex-1 relative z-10 shadow-inner">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold mb-1">Acumulado</p>
                    <p className="text-2xl font-light text-teal-400">R$ {(cofre.guardado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold mb-1">Alvo final</p>
                    <p className="text-sm font-medium text-slate-300">R$ {(cofre.objetivo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                {/* Barra de Progresso Líquida */}
                <div className="h-4 w-full bg-[#111318] rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cofre.progresso}%` }}
                    transition={{ duration: 1.5, type: "spring" }}
                    className="h-full bg-teal-500 rounded-full relative overflow-hidden"
                  >
                     <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)" }}></div>
                     <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                  </motion.div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest">PROGRESSO</span>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-md border border-teal-500/20">{cofre.progresso}% concluído</span>
                </div>
              </div>
              
              <div className="flex gap-3 relative z-10">
                <button onClick={() => abrirModalResgate(cofre.id)} className="flex-1 bg-[#0a0c10] hover:bg-[#111318] text-slate-300 hover:text-white font-medium py-3 rounded-2xl transition-colors text-sm flex justify-center items-center gap-2 border border-white/5 shadow-inner group/btn">
                  <Download size={16} className="text-slate-500 group-hover/btn:text-white transition-colors" /> Resgatar
                </button>
                <button onClick={() => abrirModalAporte(cofre.id)} className="flex-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-medium py-3 rounded-2xl transition-colors text-sm flex justify-center items-center gap-2 border border-teal-500/20 shadow-inner group/btn">
                  <Speed size={16} className="text-teal-400 group-hover/btn:scale-110 transition-transform" /> Aportar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
