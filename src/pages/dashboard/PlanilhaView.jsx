import { ClipboardList, MessageCircle, Plus, CheckCircle, Trash2 } from 'lucide-react';

export default function PlanilhaView({
  planilhaReal,
  setModalPlanilhaAberto,
  handleExportarWhatsApp,
  handleAlternarStatusPlanilha,
  handleExcluirPlanilha
}) {
  return (
    <div className="animate-in fade-in duration-300">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Planejamento</h1>
          <p className="text-zinc-400 text-sm">Contas avulsas que não afetam o seu saldo livre</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportarWhatsApp} className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all border border-emerald-500/20">
            <MessageCircle size={20} /> Enviar p/ WhatsApp
          </button>
          <button onClick={() => setModalPlanilhaAberto(true)} className=" bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-none">
            <Plus size={20} /> Novo Item
          </button>
        </div>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none">
        {(planilhaReal || []).length === 0 ? (
          <div className="text-center py-10">
            <ClipboardList size={48} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-400">Sua planilha está vazia</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(planilhaReal || []).map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleAlternarStatusPlanilha(item.id, item.status)} className={`p-1 rounded-2xl border-2 transition-colors ${item.status === 'pago' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-slate-600 text-transparent hover:border-slate-400'}`}>
                    <CheckCircle size={20} />
                  </button>
                  <div>
                    <h4 className={`font-semibold ${item.status === 'pago' ? 'text-zinc-400 line-through' : 'text-zinc-100'}`}>{item.descricao}</h4>
                    <p className="text-zinc-400 text-xs">Vence em: {item.vencimento.split('-').reverse().join('/')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${item.status === 'pago' ? 'text-zinc-400' : 'text-zinc-100'}`}>R$ {(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <button onClick={() => handleExcluirPlanilha(item.id)} className="text-zinc-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
