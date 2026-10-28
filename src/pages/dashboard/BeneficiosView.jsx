
import { ShoppingBag, Plus, ChevronDown, Pencil, Trash2, BatteryCharging } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export default function BeneficiosView({
  beneficiosReais,
  setModalBeneficioAberto,
  abrirModalCompraBeneficio,
  abrirModalRecargaBeneficio,
  toggleExtratoBeneficio,
  beneficioExpandidoExtrato,
  abrirModalEdicaoBeneficio,
  handleExcluirBeneficio,
  handleExcluirCompraBeneficio
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-[var(--text-main)] mb-1 flex items-center gap-2">Benefícios</h1>
          <p className="text-slate-500 text-sm">Controle de Alimentação, Refeição e outros benefícios</p>
        </div>
        <button onClick={() => setModalBeneficioAberto(true)} className="bg-[var(--accent)] hover:bg-teal-400 text-[#eef1f5] font-bold px-6 py-3 rounded-2xl flex items-center gap-2 font-medium transition-all shadow-none">
          <Plus size={20} /> Cadastrar Vale
        </button>
      </header>

      {(beneficiosReais || []).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-[var(--bg-card)] border border-white/5 rounded-3xl p-8 shadow-premium backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-main)] opacity-50 z-0 pointer-events-none"></div>
          <div className="relative z-10 bg-[#eef1f5] p-6 rounded-2xl text-[var(--accent)] mb-6 border border-teal-500/20 shadow-none">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-2xl font-light tracking-tight text-[var(--text-main)] mb-4">Sem vales cadastrados</h2>
          <p className="text-slate-500 max-w-md text-sm mb-8">Nenhum cartão de benefício ativo Adicione um Vale Refeição ou Alimentação para começar a acompanhar seus gastos separados do saldo bancário</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {(beneficiosReais || []).map(beneficio => (
            <div key={beneficio.id} className="bg-[var(--bg-card)] border border-white/5 rounded-3xl p-8 shadow-premium backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent)] opacity-[0.02] rounded-full blur-3xl pointer-events-none transition-opacity group-hover:opacity-[0.05]"></div>

              <div className="flex justify-between items-center relative z-10 mb-4">
                <div className="text-slate-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Benefício Corporativo
                </div>
                <div className="flex gap-2">
                   <button onClick={() => abrirModalEdicaoBeneficio(beneficio)} className="text-slate-500 hover:text-[var(--text-main)] bg-[#eef1f5] p-2 rounded-xl transition-colors border border-white/5 shadow-inner" title="Editar"><Pencil size={16} /></button>
                   <button onClick={() => handleExcluirBeneficio(beneficio.id)} className="text-slate-500 hover:text-rose-400 bg-[#eef1f5] p-2 rounded-xl transition-colors border border-white/5 shadow-inner" title="Excluir"><Trash2 size={16} /></button>
                </div>
              </div>

              {/* Card visual */}
              <div className="w-full h-[180px] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/10 mb-8"
                style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 bg-emerald-500/10" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -ml-20 -mb-20" />

                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-2.5 rounded-xl backdrop-blur-md border border-white/10">
                       <ShoppingBag size={24} className="text-emerald-400" />
                    </div>
                    <span className="font-bold tracking-wider text-slate-200">{beneficio.nome}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">{beneficio.tipo}</span>
                </div>

                <div className="relative z-10">
                  <div className="text-xs text-slate-500 mb-1 tracking-widest uppercase">Saldo Atual</div>
                  <div className="text-4xl font-light tracking-tight text-[var(--text-main)]">
                    R$ {(beneficio.saldo_atual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-4 relative z-10">
                <button onClick={() => abrirModalCompraBeneficio(beneficio.id)} className="flex-1 bg-[#eef1f5] hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 font-medium py-3.5 rounded-2xl transition-colors text-sm border border-white/5 shadow-inner flex justify-center items-center gap-2">
                  <ShoppingBag size={16} /> Lançar Gasto
                </button>
                <button onClick={() => abrirModalRecargaBeneficio(beneficio.id)} className="flex-1 bg-[#eef1f5] hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 font-medium py-3.5 rounded-2xl transition-colors text-sm border border-white/5 shadow-inner flex justify-center items-center gap-2">
                  <BatteryCharging size={16} /> Recarregar
                </button>
              </div>

              {/* Extrato embutido */}
              <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
                <div onClick={() => toggleExtratoBeneficio(beneficio.id)} className="flex justify-between items-center cursor-pointer group/extrato py-2">
                  <span className="text-sm font-medium text-slate-500 group-hover/extrato:text-slate-300 transition-colors">Histórico de Uso</span>
                  <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${beneficioExpandidoExtrato === beneficio.id ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {beneficioExpandidoExtrato === beneficio.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 flex flex-col gap-3">
                        {(beneficio.extrato || []).map(compra => (
                          <div key={compra.id} className="flex justify-between items-center text-sm bg-[#eef1f5] p-4 rounded-2xl border border-white/5 group/item">
                            <div className="flex flex-col">
                              <span className="text-slate-300">{compra.descricao}</span>
                              <span className="text-xs text-slate-500">{compra.data}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-rose-400 font-medium">- R$ {(compra.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                              <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                <button onClick={() => handleExcluirCompraBeneficio(compra.id, beneficio.id)} className="text-slate-500 hover:text-rose-400" title="Excluir Transação"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(beneficio.extrato || []).length === 0 && <div className="text-center py-6 text-sm text-slate-500 bg-[#eef1f5] rounded-2xl border border-white/5">Nenhum gasto registrado</div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
