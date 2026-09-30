import { CreditCard, Plus, ChevronDown } from 'lucide-react';

export default function CartoesView({
  cartoesReais,
  setModalCartaoAberto,
  abrirModalCompraCartao,
  handlePagarFatura,
  toggleExtratoCartao,
  cartaoExpandidoExtrato
}) {
  return (
    <div className="animate-in fade-in duration-300">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Meus Cartões</h1>
          <p className="text-slate-400 text-sm">Controle de limites e faturas</p>
        </div>
        <button onClick={() => setModalCartaoAberto(true)} className="bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <Plus size={20} /> Adicionar Cartão
        </button>
      </header>
      {(cartoesReais || []).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-[#161922] border border-slate-800/60 rounded-2xl p-8 shadow-lg">
          <div className="bg-[#d4af37]/10 p-6 rounded-full text-[#d4af37] mb-6 border border-[#d4af37]/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <CreditCard size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Nenhum cartão cadastrado</h2>
          <p className="text-slate-400 max-w-md text-sm mb-8">Adicione o seu primeiro cartão de crédito para começar a controlar faturas e limites.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(cartoesReais || []).map(cartao => (
            <div key={cartao.id} className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 transition-transform hover:-translate-y-1 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#d4af37]/10 p-3 rounded-xl text-[#d4af37] border border-[#d4af37]/20">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{cartao.nome}</h3>
                    <p className="text-slate-500 text-xs">Vence dia {cartao.dia_vencimento} • Fecha dia {cartao.dia_fechamento}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#090b10] rounded-xl p-5 mb-4 border border-slate-800/50">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Fatura Atual</p>
                    <p className="text-2xl font-bold text-white">R$ {(cartao.fatura_atual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8c6b4a] to-[#d4af37] rounded-full transition-all duration-1000" style={{ width: `${cartao.progresso_limite || 0}%` }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400">Disponível: R$ {(cartao.limite_disponivel || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span className="text-slate-500">Limite: R$ {(cartao.limite_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => abrirModalCompraCartao(cartao.id)} className="flex-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] font-medium py-2 rounded-lg transition-colors text-sm border border-[#d4af37]/20">Lançar Compra</button>
                <button onClick={() => handlePagarFatura(cartao.id, cartao.fatura_atual)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-colors text-sm border border-slate-700">Pagar Fatura</button>
              </div>
              <div onClick={() => toggleExtratoCartao(cartao.id)} className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800/50 cursor-pointer group">
                <span className="text-sm text-slate-400 group-hover:text-[#d4af37] transition-colors">Ver compras desta fatura</span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${cartaoExpandidoExtrato === cartao.id ? 'rotate-180' : ''}`} />
              </div>
              {cartaoExpandidoExtrato === cartao.id && (
                <div className="mt-4 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                  {(cartao.extrato || []).map(compra => (
                    <div key={compra.id} className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-300">{compra.descricao}</span>
                      <span className="text-white font-medium">R$ {(compra.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  {(cartao.extrato || []).length === 0 && <span className="text-xs text-slate-500 italic">Nenhuma compra nesta fatura.</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
