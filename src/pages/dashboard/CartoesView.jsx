import React, { useState, useRef } from 'react';
import { CreditCard, Plus, ChevronDown, Pencil, Trash2, Wifi } from 'lucide-react';
import { TransactionIcon } from '../../components/ui/TransactionIcon';
import { motion, AnimatePresence } from 'framer-motion';

// Componente Cartão 3D
const CreditCard3D = ({ cartao }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const getBrandColors = (inst) => {
    if (!inst) return { rgb: '45,212,191', hex: '#2dd4bf' };
    const lower = inst.toLowerCase();
    if (lower.includes('nubank') || lower.includes('nu')) return { rgb: '139,44,226', hex: '#8b2ce2' };
    if (lower.includes('inter')) return { rgb: '255,122,0', hex: '#ff7a00' };
    if (lower.includes('itaú') || lower.includes('itau')) return { rgb: '236,112,0', hex: '#ec7000' };
    if (lower.includes('bradesco')) return { rgb: '204,9,47', hex: '#cc092f' };
    if (lower.includes('santander')) return { rgb: '236,0,0', hex: '#ec0000' };
    if (lower.includes('c6')) return { rgb: '200,200,200', hex: '#c8c8c8' };
    if (lower.includes('banco do brasil') || lower.includes('bb')) return { rgb: '252,223,0', hex: '#fcdf00' };
    if (lower.includes('xp')) return { rgb: '255,200,0', hex: '#ffc800' };
    if (lower.includes('caixa')) return { rgb: '0,92,169', hex: '#005ca9' };
    return { rgb: '45,212,191', hex: '#2dd4bf' };
  };

  const brandColors = getBrandColors(cartao.instituicao);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rY = ((mouseX / width) - 0.5) * 20; // max 20 deg
    const rX = ((mouseY / height) - 0.5) * -20; // max 20 deg

    setRotateX(rX);
    setRotateY(rY);
    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div style={{ perspective: '1000px' }} className="w-full relative z-10 group mt-4 mb-8">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-[220px] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10"
        style={{
          background: 'linear-gradient(135deg, #181a20 0%, #0a0c10 100%)',
          transformStyle: "preserve-3d",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
        }}
      >
        {/* Efeito Metálico / Brilho */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(${brandColors.rgb},${glare.opacity}) 0%, transparent 50%)`,
          }}
        />

        {/* Texturas do Cartão */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10" style={{ backgroundColor: `${brandColors.hex}1A` }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#0f1115]/80 rounded-full blur-2xl -ml-20 -mb-20" />

        <div className="relative z-10 flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-3">
            <div className="bg-white/5 p-2.5 rounded-xl backdrop-blur-md border border-white/10" style={{ borderColor: `${brandColors.hex}33` }}>
               <TransactionIcon categoria={cartao.instituicao !== 'Outros' ? cartao.instituicao : cartao.nome} tipo="Cartao" size={24} />
            </div>
            <span className="font-bold tracking-wider text-slate-200">{cartao.nome}</span>
          </div>
          <Wifi size={24} className="text-slate-400 rotate-90" />
        </div>

        <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
          <div className="text-xs text-slate-500 mb-1 tracking-widest uppercase">Fatura Atual</div>
          <div className="text-4xl font-light tracking-tight text-white mb-6">
            R$ {(cartao.fatura_atual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex gap-6">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Vence</div>
                <div className="text-sm font-medium text-slate-300">Dia {cartao.dia_vencimento}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Fecha</div>
                <div className="text-sm font-medium text-slate-300">Dia {cartao.dia_fechamento}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Disponível</div>
              <div className="text-sm font-bold" style={{ color: brandColors.hex }}>R$ {(cartao.limite_disponivel || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function CartoesView({
  cartoesReais,
  setModalCartaoAberto,
  abrirModalCompraCartao,
  handlePagarFatura,
  toggleExtratoCartao,
  cartaoExpandidoExtrato,
  abrirModalEdicaoCartao,
  handleExcluirCartao,
  abrirModalEditCompraCartao,
  handleExcluirCompraCartao
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-[var(--text-main)] mb-1 flex items-center gap-2">Gestão de Cartões</h1>
          <p className="text-slate-500 text-sm">Controle financeiro de limites e faturas ativas</p>
        </div>
        <button onClick={() => setModalCartaoAberto(true)} className="bg-[var(--accent)] hover:bg-teal-400 text-[#0f1115] font-bold px-6 py-3 rounded-2xl flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)]">
          <Plus size={20} /> Emitir Novo Cartão
        </button>
      </header>
      
      {(cartoesReais || []).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-[var(--bg-card)] border border-white/5 rounded-3xl p-8 shadow-premium backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-main)] opacity-50 z-0 pointer-events-none"></div>
          <div className="relative z-10 bg-[#0a0c10] p-6 rounded-2xl text-[var(--accent)] mb-6 border border-teal-500/20 shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <CreditCard size={48} />
          </div>
          <h2 className="text-2xl font-light tracking-tight text-[var(--text-main)] mb-4">Seu portfólio está vazio</h2>
          <p className="text-slate-500 max-w-md text-sm mb-8">Nenhum cartão ativo. Adicione um novo método de crédito para gerir suas faturas corporativas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {(cartoesReais || []).map(cartao => (
            <div key={cartao.id} className="bg-[var(--bg-card)] border border-white/5 rounded-3xl p-8 shadow-premium backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent)] opacity-[0.02] rounded-full blur-3xl pointer-events-none transition-opacity group-hover:opacity-[0.05]"></div>
              
              <div className="flex justify-between items-center relative z-10">
                <div className="text-slate-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  Cartão Físico
                </div>
                <div className="flex gap-2">
                   <button onClick={() => abrirModalEdicaoCartao(cartao)} className="text-slate-500 hover:text-white bg-[#0a0c10] p-2 rounded-xl transition-colors border border-white/5 shadow-inner" title="Editar"><Pencil size={16} /></button>
                   <button onClick={() => handleExcluirCartao(cartao.id)} className="text-slate-500 hover:text-rose-400 bg-[#0a0c10] p-2 rounded-xl transition-colors border border-white/5 shadow-inner" title="Excluir"><Trash2 size={16} /></button>
                </div>
              </div>

              {/* O Cartão 3D Brabo */}
              <CreditCard3D cartao={cartao} />

              {/* Ações do Cartão */}
              <div className="flex gap-4 relative z-10">
                <button onClick={() => abrirModalCompraCartao(cartao.id)} className="flex-1 bg-[#0a0c10] hover:bg-teal-500/10 hover:text-teal-400 text-slate-300 font-medium py-3.5 rounded-2xl transition-colors text-sm border border-white/5 shadow-inner flex justify-center items-center gap-2">
                  <CreditCard size={16} /> Lançar Despesa
                </button>
                <button onClick={() => handlePagarFatura(cartao.id, cartao.fatura_atual)} className="flex-1 bg-[#0a0c10] hover:bg-teal-500/10 hover:text-teal-400 text-slate-300 font-medium py-3.5 rounded-2xl transition-colors text-sm border border-white/5 shadow-inner flex justify-center items-center gap-2">
                  <Plus size={16} /> Pagar Fatura
                </button>
              </div>

              {/* Extrato embutido com Shared Layout / AnimatePresence */}
              <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
                <div onClick={() => toggleExtratoCartao(cartao.id)} className="flex justify-between items-center cursor-pointer group/extrato py-2">
                  <span className="text-sm font-medium text-slate-500 group-hover/extrato:text-slate-300 transition-colors">Transações Recentes</span>
                  <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${cartaoExpandidoExtrato === cartao.id ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {cartaoExpandidoExtrato === cartao.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 flex flex-col gap-3">
                        {(cartao.extrato || []).map(compra => (
                          <div key={compra.id} className="flex justify-between items-center text-sm bg-[#0a0c10] p-4 rounded-2xl border border-white/5 group/item">
                            <div className="flex flex-col">
                              <span className="text-slate-300">
                                {compra.descricao}
                                {compra.parcelas && compra.parcelas > 1 ? (
                                  <span className="text-[10px] text-slate-500 ml-2 bg-slate-800 px-2 py-0.5 rounded">Em {compra.parcelas}x (Pg: {compra.parcelas_pagas || 1})</span>
                                ) : (
                                  <span className="text-[10px] text-slate-500 ml-2 bg-slate-800 px-2 py-0.5 rounded">À vista</span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-white font-medium block">R$ {(compra.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                {compra.parcelas && compra.parcelas > 1 && (
                                  <span className="text-[10px] text-slate-500 block">R$ {(compra.valor_parcela || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>
                                )}
                              </div>
                              <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                <button onClick={() => abrirModalEditCompraCartao(compra)} className="text-slate-500 hover:text-white" title="Editar Compra"><Pencil size={14} /></button>
                                <button onClick={() => handleExcluirCompraCartao(compra.id)} className="text-slate-500 hover:text-rose-400" title="Excluir Compra"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(cartao.extrato || []).length === 0 && <div className="text-center py-6 text-sm text-slate-500 bg-[#0a0c10] rounded-2xl border border-white/5">Nenhuma compra nesta fatura.</div>}
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
