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
        <p className="text-[var(--text-sec)] text-sm">Gerencie sua conta, segurança e dados.</p>
      </header>
      <div className="max-w-3xl flex flex-col gap-6">
        
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-6 shadow-premium">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <User className="text-[var(--text-main)]"/> Meu Perfil
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[var(--bg-main)] border border-[var(--border-card)] rounded-[12px] flex items-center justify-center text-3xl font-bold text-[var(--text-main)] uppercase">
              {nomeUsuario.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-[var(--text-main)] font-bold text-xl capitalize">{nomeUsuario}</p>
              <p className="text-[var(--text-sec)] text-sm">{emailLogin}</p>
            </div>
            <button onClick={() => { setEditNomeUsuario(nomeUsuario); setModalPerfilAberto(true); }} className="bg-[#101e22] hover:bg-slate-700 text-[var(--text-main)] px-5 py-2.5 rounded-[12px] text-sm font-medium transition-colors border border-[var(--border-card)] flex items-center gap-2">
              <Pencil size={16} /> Editar Perfil
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-6 shadow-premium">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <ShieldCheck className="text-[var(--text-main)]"/> Segurança
          </h2>
          <div className="flex items-center justify-between py-3 border-b border-[var(--border-card)]">
            <div>
              <p className="text-[var(--text-main)] font-medium">Autenticação de Dois Fatores (2FA)</p>
              <p className="text-[var(--text-sec)] text-sm">Protegendo sua conta através do Google Authenticator.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[var(--accent)]/10 text-[var(--accent)] text-xs px-3 py-1 rounded-[12px] font-bold border border-emerald-500/20">Ativado</span>
              <button onClick={handleReset2FA} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs px-3 py-1 rounded-[12px] font-bold border border-amber-500/20 transition-colors">Resetar</button>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[var(--text-main)] font-medium">Palavra-passe de Acesso</p>
              <p className="text-[var(--text-sec)] text-sm">Proteção ativa no banco de dados da nuvem.</p>
            </div>
            <button onClick={() => mostrarNotificacao("Troca de palavra-passe pelo painel Web ativada!", "sucesso")} className="bg-[#101e22] hover:bg-slate-700 text-[var(--text-main)] px-4 py-2 rounded-[12px] text-sm transition-colors border border-[var(--border-card)]">Alterar Palavra-passe</button>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-rose-500/50 rounded-[12px] p-6 shadow-[0_0_30px_rgba(225,29,72,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-rose-500/5 blur-[50px] pointer-events-none group-hover:bg-rose-500/10 transition-colors"></div>
          <h2 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2 relative z-10"><AlertCircle /> Zona de Perigo</h2>
          <p className="text-[var(--text-sec)] text-sm mb-4">Ações irreversíveis para a sua conta e seus dados financeiros. Proceda com extrema cautela.</p>
          <div className="flex gap-4">
            <button onClick={handleZerarSaldo} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-3 rounded-[12px] text-sm font-bold border border-rose-500/20 transition-colors flex items-center gap-2 shadow-premium"><Trash2 size={16} /> Formatar e Zerar Conta</button>
          </div>
        </div>
        
        <button onClick={onLogout} className="w-full bg-[var(--bg-main)] hover:bg-rose-500/10 text-[var(--text-sec)] hover:text-rose-400 font-bold py-4 rounded-[12px] mt-2 transition-all border border-[var(--border-card)] hover:border-rose-500/30 flex justify-center items-center gap-2">
          Sair do Aplicativo <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
