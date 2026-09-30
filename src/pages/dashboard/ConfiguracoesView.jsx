import { User, Pencil, ShieldCheck, AlertCircle, Trash2, LogOut } from 'lucide-react';

export default function ConfiguracoesView({
  nomeUsuario,
  emailLogin,

  setEditNomeUsuario,
  setModalPerfilAberto,
  mostrarNotificacao,
  handleReset2FA,
  handleZerarSaldo,
  onLogout
}) {
  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-10">
        <h1 className="text-2xl font-bold mb-1">Configurações</h1>
        <p className="text-zinc-400 text-sm">Gerencie sua conta, segurança e dados.</p>
      </header>
      <div className="max-w-3xl flex flex-col gap-6">
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none">
          <h2 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
            <User className="text-zinc-100"/> Meu Perfil
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#0a0a0a] border border-zinc-800 rounded-2xl flex items-center justify-center text-3xl font-bold text-zinc-100 uppercase">
              {nomeUsuario.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-zinc-100 font-bold text-xl capitalize">{nomeUsuario}</p>
              <p className="text-zinc-400 text-sm">{emailLogin}</p>
            </div>
            <button onClick={() => { setEditNomeUsuario(nomeUsuario); setModalPerfilAberto(true); }} className="bg-zinc-800 hover:bg-slate-700 text-zinc-100 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors border border-zinc-700 flex items-center gap-2">
              <Pencil size={16} /> Editar Perfil
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none">
          <h2 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
            <ShieldCheck className="text-zinc-100"/> Segurança
          </h2>
          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <div>
              <p className="text-zinc-100 font-medium">Autenticação de Dois Fatores (2FA)</p>
              <p className="text-zinc-400 text-sm">Protegendo sua conta através do Google Authenticator.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-2xl font-bold border border-emerald-500/20">Ativado</span>
              <button onClick={handleReset2FA} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs px-3 py-1 rounded-xl font-bold border border-amber-500/20 transition-colors">Resetar</button>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-zinc-100 font-medium">Palavra-passe de Acesso</p>
              <p className="text-zinc-400 text-sm">Proteção ativa no banco de dados da nuvem.</p>
            </div>
            <button onClick={() => mostrarNotificacao("Troca de palavra-passe pelo painel Web ativada!", "sucesso")} className="bg-zinc-800 hover:bg-slate-700 text-zinc-100 px-4 py-2 rounded-xl text-sm transition-colors border border-zinc-700">Alterar Palavra-passe</button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-none border-l-4 border-l-rose-500">
          <h2 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2"><AlertCircle /> Zona de Perigo</h2>
          <p className="text-zinc-400 text-sm mb-4">Ações irreversíveis para a sua conta e seus dados financeiros. Proceda com extrema cautela.</p>
          <div className="flex gap-4">
            <button onClick={handleZerarSaldo} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-3 rounded-2xl text-sm font-bold border border-rose-500/20 transition-colors flex items-center gap-2 shadow-none"><Trash2 size={16} /> Formatar e Zerar Conta</button>
          </div>
        </div>
        
        <button onClick={onLogout} className="w-full bg-[#0a0a0a] hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 font-bold py-4 rounded-2xl mt-2 transition-all border border-zinc-800 hover:border-rose-500/30 flex justify-center items-center gap-2">
          Sair do Aplicativo <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
