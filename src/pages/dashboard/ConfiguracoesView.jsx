
import { User, Pencil, ShieldCheck, AlertCircle, Trash2, LogOut } from 'lucide-react';
import { AvatarBadge } from '../../components/ui/Avatar';

export default function ConfiguracoesView({
  nomeUsuario,
  avatarUsuario = 'avatar-1',
  emailLogin,

  setEditNomeUsuario,
  setModalPerfilAberto,
  mostrarNotificacao,
  handleReset2FA,
  handleZerarSaldo,
  onLogout
}) {
  return (
    <div className="animate-in fade-in duration-300 pb-28 md:pb-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-1">Configurações</h1>
          <p className="text-[var(--text-sec)] text-xs sm:text-sm">Gerencie sua conta, segurança e preferências</p>
        </div>

        {/* Botão de Sair em destaque no topo também (visível no celular e desktop) */}
        <button
          onClick={onLogout}
          className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-rose-500/30 transition-all flex items-center justify-center gap-2 min-h-[44px]"
        >
          <LogOut size={16} /> Sair da Conta
        </button>
      </header>

      <div className="max-w-3xl flex flex-col gap-6">

        {/* Cartão Meu Perfil com Avatar */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 sm:p-6 shadow-premium relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <User size={20} className="text-[#f34b27]"/> Meu Perfil
            </h2>
            <button
              onClick={() => { setEditNomeUsuario(nomeUsuario); setModalPerfilAberto(true); }}
              className="bg-[#26311f] hover:bg-slate-700 text-[#172333] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors border border-[var(--border-card)] flex items-center gap-1.5 min-h-[38px]"
            >
              <Pencil size={14} /> Editar Perfil
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 pt-2">
            <div className="relative group cursor-pointer" onClick={() => { setEditNomeUsuario(nomeUsuario); setModalPerfilAberto(true); }}>
              <AvatarBadge avatarId={avatarUsuario} nome={nomeUsuario} tamanho="lg" />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                <Pencil size={14} /> Alterar
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-[var(--text-main)] font-bold text-lg sm:text-xl capitalize">{nomeUsuario}</p>
              <p className="text-[var(--text-sec)] text-xs sm:text-sm mt-0.5">{emailLogin}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-[#e3e9f1]/50 border border-[#b5c2d3] text-[#526c8e] text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f34b27]"></span> Conta Ativa
              </div>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 sm:p-6 shadow-premium">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#f34b27]"/> Segurança & Acesso
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-[var(--border-card)] gap-3">
            <div>
              <p className="text-[var(--text-main)] font-medium text-sm sm:text-base">Autenticação de Dois Fatores (2FA)</p>
              <p className="text-[var(--text-sec)] text-xs sm:text-sm mt-0.5">Protegendo sua conta através do Google Authenticator</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-xl font-bold border border-emerald-500/20">Ativado</span>
              <button onClick={handleReset2FA} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-xl font-bold border border-amber-500/20 transition-colors min-h-[36px]">Resetar 2FA</button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-3">
            <div>
              <p className="text-[var(--text-main)] font-medium text-sm sm:text-base">Palavra-passe de Acesso</p>
              <p className="text-[var(--text-sec)] text-xs sm:text-sm mt-0.5">Proteção ativa e criptografia em nuvem</p>
            </div>
            <button onClick={() => mostrarNotificacao("Troca de palavra-passe pelo painel Web ativada!", "sucesso")} className="w-full sm:w-auto bg-[#26311f] hover:bg-slate-700 text-[var(--text-main)] px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors border border-[var(--border-card)] min-h-[36px]">Alterar Palavra-passe</button>
          </div>
        </div>

        {/* Zona de Perigo */}
        <div className="bg-[var(--bg-card)] border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-none relative overflow-hidden group">
          <div className="absolute inset-0 bg-rose-500/5 blur-[50px] pointer-events-none group-hover:bg-rose-500/10 transition-colors"></div>
          <h2 className="text-base sm:text-lg font-bold text-rose-400 mb-2 flex items-center gap-2 relative z-10">
            <AlertCircle size={20} /> Zona de Perigo
          </h2>
          <p className="text-[var(--text-sec)] text-xs sm:text-sm mb-4 leading-relaxed">
            Ações irreversíveis para a sua conta e seus dados financeiros Proceda com cautela
          </p>
          <div className="flex gap-4">
            <button onClick={handleZerarSaldo} className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-rose-500/30 transition-colors flex items-center justify-center gap-2 min-h-[40px]">
              <Trash2 size={16} /> Formatar e Zerar Conta
            </button>
          </div>
        </div>

        {/* Botão Sair Principal no Rodapé */}
        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full bg-[#1b2228] hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold py-4 px-6 rounded-2xl transition-all border border-rose-500/30 hover:border-rose-500/50 flex justify-center items-center gap-3 shadow-none min-h-[50px] text-sm sm:text-base cursor-pointer"
          >
            <LogOut size={20} /> Sair do Aplicativo
          </button>
        </div>
      </div>
    </div>
  );
}
