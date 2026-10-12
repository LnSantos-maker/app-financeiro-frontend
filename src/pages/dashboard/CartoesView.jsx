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
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--text-main)] mb-1 flex items-center gap-2">Gestão de Cartões</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Controle financeiro de limites e faturas ativas</p>
        </div>
        <button onClick={() => setModalCartaoAberto(true)} className="w-full sm:w-auto bg-[var(--accent)] hover:bg-teal-400 text-[#0f1115] font-bold px-6 py-3 min-h-[44px] rounded-2xl flex items-center justify-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] text-sm">
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
            <div key={cartao.id} className="bg-[#141a1e] border border-[#233137] rounded-3xl p-5 sm:p-7 shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)] relative overflow-hidden group">
              
              {/* Header da Janela estilo Mac */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#222f36] relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f87171] shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                  <span className="text-xs font-bold text-[#e6f0ed] ml-2 tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                    <CreditCard size={14} className="text-[#a4c5c1]" /> NEXUS CARD • {cartao.instituicao !== 'Outros' ? cartao.instituicao : cartao.nome}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#95bfa6] bg-[#1a3338] px-2.5 py-0.5 rounded-full border border-[#274c53] flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#95bfa6] animate-pulse"></span> Ativo
                  </span>
                  <button onClick={() => abrirModalEdicaoCartao(cartao)} className="text-[#8baaa6] hover:text-[#e6f0ed] bg-[#102428] p-1.5 rounded-xl transition-colors border border-[#1b3d45]" title="Editar"><Pencil size={13} /></button>
                  <button onClick={() => handleExcluirCartao(cartao.id)} className="text-[#8baaa6] hover:text-[#e69894] bg-[#102428] p-1.5 rounded-xl transition-colors border border-[#1b3d45]" title="Excluir"><Trash2 size={13} /></button>
                </div>
              </div>

              {/* O Cartão 3D */}
              <CreditCard3D cartao={cartao} />

              {/* Ações do Cartão */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10">
                <button onClick={() => abrirModalCompraCartao(cartao.id)} className="flex-1 bg-[#102428] hover:bg-[#18363d] text-[#e6f0ed] font-medium py-3 rounded-2xl transition-colors text-sm border border-[#1b3d45] flex justify-center items-center gap-2 min-h-[44px]">
                  <CreditCard size={16} className="text-[#95bfa6]" /> Lançar Despesa
                </button>
                <button onClick={() => handlePagarFatura(cartao.id, cartao.fatura_atual)} className="flex-1 bg-[#102428] hover:bg-[#18363d] text-[#e6f0ed] font-medium py-3 rounded-2xl transition-colors text-sm border border-[#1b3d45] flex justify-center items-center gap-2 min-h-[44px]">
                  <Plus size={16} className="text-[#95bfa6]" /> Pagar Fatura
                </button>
              </div>

              {/* Extrato embutido com Shared Layout / AnimatePresence */}
              <div className="relative z-10 mt-6 pt-4 border-t border-[#222f36]">
                <div onClick={() => toggleExtratoCartao(cartao.id)} className="flex justify-between items-center cursor-pointer group/extrato py-2">
                  <span className="text-sm font-medium text-[#8baaa6] group-hover/extrato:text-[#e6f0ed] transition-colors">Transações Recentes da Fatura</span>
                  <ChevronDown size={18} className={`text-[#8baaa6] transition-transform duration-300 ${cartaoExpandidoExtrato === cartao.id ? 'rotate-180' : ''}`} />
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
                          <div key={compra.id} className="flex justify-between items-center text-sm bg-[#102428]/90 p-4 rounded-2xl border border-[#1b3d45] group/item">
                            <div className="flex flex-col">
                              <span className="text-[#e6f0ed]">
                                {compra.descricao}
                                {compra.parcelas && compra.parcelas > 1 ? (
                                  <span className="text-[10px] text-[#8baaa6] ml-2 bg-[#18363d] px-2 py-0.5 rounded border border-[#274c53]">Em {compra.parcelas}x (Pg: {compra.parcelas_pagas || 1})</span>
                                ) : (
                                  <span className="text-[10px] text-[#8baaa6] ml-2 bg-[#18363d] px-2 py-0.5 rounded border border-[#274c53]">À vista</span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-[#e6f0ed] font-medium block">R$ {(compra.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                {compra.parcelas && compra.parcelas > 1 && (
                                  <span className="text-[10px] text-[#8baaa6] block">R$ {(compra.valor_parcela || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>
                                )}
                              </div>
                              <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                <button onClick={() => abrirModalEditCompraCartao(compra)} className="text-[#8baaa6] hover:text-[#e6f0ed]" title="Editar Compra"><Pencil size={14} /></button>
                                <button onClick={() => handleExcluirCompraCartao(compra.id)} className="text-[#8baaa6] hover:text-[#e69894]" title="Excluir Compra"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(cartao.extrato || []).length === 0 && <div className="text-center py-6 text-sm text-[#8baaa6] bg-[#102428]/90 rounded-2xl border border-[#1b3d45]">Nenhuma compra nesta fatura.</div>}
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
