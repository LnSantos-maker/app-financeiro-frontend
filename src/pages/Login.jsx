import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, CornerDownRight, X } from 'lucide-react';
import LandingPage from '../components/LandingPage';
import Dialog from '../components/ui/Dialog';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { MotionWrapper } from '../components/ui/MotionWrapper';
import { API_URL } from '../config';

export default function Login({ onLoginSuccess, mostrarNotificacao }) {
  // Navigation & Modal State
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Auth Form State
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [etapaLogin, setEtapaLogin] = useState(0);
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [codigo2FA, setCodigo2FA] = useState('');

  const [nomeRegistro, setNomeRegistro] = useState('');
  const [sobrenomeRegistro, setSobrenomeRegistro] = useState('');
  const [emailConfirma, setEmailConfirma] = useState('');
  const [senhaConfirma, setSenhaConfirma] = useState('');

  const [chaveSecreta2FA, setChaveSecreta2FA] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pré-aquecimento do backend para eliminar qualquer latência de cold start do Render
  React.useEffect(() => {
    fetch(`${API_URL}/`).catch(() => {});
  }, []);

  const carregarSetup2FA = async (email) => {
    try {
      const res = await fetch(`${API_URL}/auth/setup-2fa/?email=${encodeURIComponent(email)}`);
      const dados = await res.json();
      if (res.ok && dados.precisa_qrcode) {
        const chave = dados.chave_secreta || 'CHAVE-JA-SALVA-NO-BACKEND';
        setChaveSecreta2FA(chave);
        const linkTotp = dados.link_qrcode || `otpauth://totp/PF:${email}?secret=${chave}&issuer=PF`;
        const urlImage = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(linkTotp)}`;
        setQrCodeUrl(urlImage);
      }
    } catch (e) { console.error("Erro ao carregar QR Code do 2FA", e); }
  };

  const handleSubmeterLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!isLoginMode) {
      if (!nomeRegistro || !sobrenomeRegistro) return mostrarNotificacao("Preencha nome e sobrenome", "erro");
      if (!emailLogin || !emailConfirma) return mostrarNotificacao("Preencha o e-mail", "erro");
      if (emailLogin !== emailConfirma) return mostrarNotificacao("Os e-mails não coincidem", "erro");
      if (senhaLogin !== senhaConfirma) return mostrarNotificacao("As senhas não coincidem", "erro");
    } else {
      if (!emailLogin || !senhaLogin) return mostrarNotificacao("Preencha e-mail e senha", "erro");
    }

    // Configuração de 2FA: Mudar para true quando quiser reativar o autenticador
    const ATIVAR_2FA = false;

    setIsLoading(true);
    try {
      const emailNormalizado = emailLogin.trim().toLowerCase();
      if (isLoginMode) {
        // Validação no Firebase Auth
        await signInWithEmailAndPassword(auth, emailLogin.trim(), senhaLogin);
        if (!ATIVAR_2FA) {
          mostrarNotificacao("Autenticado com sucesso!", "sucesso");
          onLoginSuccess(emailNormalizado);
          return;
        }
        setEtapaLogin(1);
        mostrarNotificacao("Acesso validado Digite o código 2FA", "sucesso");
      } else {
        await createUserWithEmailAndPassword(auth, emailLogin.trim(), senhaLogin);
        if (!ATIVAR_2FA) {
          mostrarNotificacao("Conta criada com sucesso!", "sucesso");
          onLoginSuccess(emailNormalizado);
          return;
        }
        setEtapaLogin(1);
        mostrarNotificacao("Conta criada! Configure o 2FA", "sucesso");
        carregarSetup2FA(emailLogin.trim());
      }
    } catch (error) {
      let mensagem = "Erro de conexão";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') mensagem = "Credenciais inválidas";
      if (error.code === 'auth/email-already-in-use') mensagem = "E-mail indisponível";
      if (error.code === 'auth/weak-password') mensagem = "Senha muito fraca";
      mostrarNotificacao(mensagem, "erro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmeter2FA = async (e, codigoManual = null) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isLoading) return;
    const codigoLimpo = (codigoManual || codigo2FA || '').trim();
    if (codigoLimpo.length !== 6) return mostrarNotificacao("Código inválido Digite os 6 dígitos", "erro");

    setIsLoading(true);
    const emailNormalizado = (emailLogin || '').trim().toLowerCase();
    try {
      const resposta = await fetch(`${API_URL}/auth/verificar-2fa/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailNormalizado, codigo_2fa: codigoLimpo })
      });
      const dados = await resposta.json();
      if (resposta.ok) {
        mostrarNotificacao("Autenticado com sucesso!", "sucesso");
        onLoginSuccess(emailNormalizado);
      } else {
        mostrarNotificacao(dados.detail || "Código 2FA incorreto ou expirado", "erro");
      }
    } catch {
      mostrarNotificacao("Erro no servidor de autenticação", "erro");
    } finally {
      setIsLoading(false);
    }
  };

  const resetFields = () => {
    setSenhaLogin('');
    setSenhaConfirma('');
  };

  const openAuthModal = (isLogin) => {
    // Pré-aquece o backend no momento que abre o modal
    fetch(`${API_URL}/`).catch(() => {});
    setIsLoginMode(isLogin);
    setShowModal(true);
    setEtapaLogin(0);
  };

  return (
    <div className="login-page">
      <LandingPage scenePaused={showModal} onLogin={() => openAuthModal(true)} onRegister={() => openAuthModal(false)} />
      {/* Auth Modal Overlay */}
      {showModal && (
         <Dialog label={etapaLogin === 1 ? "Verificação de segurança" : isLoginMode ? "Entrar na conta" : "Criar conta"} onClose={() => setShowModal(false)}>
            <MotionWrapper className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#ffffff] rounded-[2rem] p-6 sm:p-8 border border-[#b5c2d3] shadow-none relative">

               <button type="button" aria-label="Fechar" onClick={() => setShowModal(false)} className="absolute z-50 top-4 right-4 md:top-6 md:right-6 text-[#5c6d83] hover:text-[#172333] bg-[#eef1f5] p-2 rounded-full border border-[#b5c2d3] shadow-none min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <X size={16}/>
               </button>

               <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${etapaLogin === 1 ? 'opacity-0 translate-x-[-20px] pointer-events-none hidden' : 'opacity-100 translate-x-0'}`}>
                 <div className="mb-8">
                   <h3 className="text-2xl font-bold tracking-tight text-[#172333] mb-2">
                     {isLoginMode ? "Sua conta NEXUS" : "Criar sua Conta"}
                   </h3>
                   <p className="text-[#5c6d83] text-sm">
                     {isLoginMode ? "Use o e-mail e a senha do seu cadastro" : "Preencha seus dados para começar"}
                   </p>
                 </div>

                 <form onSubmit={handleSubmeterLogin} className="space-y-5">
                   {!isLoginMode && (
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-[#5c6d83] uppercase tracking-widest">Nome</label>
                         <input type="text" id="nomeRegistro" aria-label="Nome" autoComplete="given-name" value={nomeRegistro} onChange={(e) => setNomeRegistro(e.target.value)}
                           className="w-full bg-[#eef1f5] text-[#172333] px-4 py-3 rounded-xl border border-[#b5c2d3] shadow-none focus:outline-none focus:border-[#f34b27]"
                           placeholder="Nome" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-[#5c6d83] uppercase tracking-widest">Sobrenome</label>
                         <input type="text" id="sobrenomeRegistro" aria-label="Sobrenome" autoComplete="family-name" value={sobrenomeRegistro} onChange={(e) => setSobrenomeRegistro(e.target.value)}
                           className="w-full bg-[#eef1f5] text-[#172333] px-4 py-3 rounded-xl border border-[#b5c2d3] shadow-none focus:outline-none focus:border-[#f34b27]"
                           placeholder="Sobrenome" />
                       </div>
                     </div>
                   )}

                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-[#5c6d83] uppercase tracking-widest">E-mail</label>
                     <input type="email" id="emailLogin" aria-label="E-mail" autoComplete="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)}
                       className="w-full bg-[#eef1f5] text-[#172333] px-4 py-3 rounded-xl border border-[#b5c2d3] shadow-none focus:outline-none focus:border-[#f34b27]"
                       placeholder="usuario@email.com" />
                   </div>

                   {!isLoginMode && (
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-[#5c6d83] uppercase tracking-widest">Confirmar E-mail</label>
                       <input type="email" id="emailConfirma" aria-label="Confirmar e-mail" autoComplete="email" value={emailConfirma} onChange={(e) => setEmailConfirma(e.target.value)}
                         className="w-full bg-[#eef1f5] text-[#172333] px-4 py-3 rounded-xl border border-[#b5c2d3] shadow-none focus:outline-none focus:border-[#f34b27]"
                         placeholder="usuario@email.com" />
                     </div>
                   )}

                   <div className="space-y-2 relative">
                     <label className="text-[10px] font-bold text-[#5c6d83] uppercase tracking-widest">Senha</label>
                     <div className="relative">
                       <input type={mostrarSenha ? "text" : "password"} id="senhaLogin" aria-label="Senha" autoComplete={isLoginMode ? "current-password" : "new-password"} value={senhaLogin} onChange={(e) => setSenhaLogin(e.target.value)}
                         className="w-full bg-[#eef1f5] text-[#172333] px-4 py-3 rounded-xl border border-[#b5c2d3] shadow-none focus:outline-none focus:border-[#f34b27]"
                         placeholder="••••••••" />
                       <button type="button" aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5c6d83] hover:text-[#172333] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                         {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>
                     </div>
                   </div>

                   {!isLoginMode && (
                     <div className="space-y-2 relative">
                       <label className="text-[10px] font-bold text-[#5c6d83] uppercase tracking-widest">Confirmar Senha</label>
                       <input type={mostrarSenha ? "text" : "password"} id="senhaConfirma" aria-label="Confirmar senha" autoComplete="new-password" value={senhaConfirma} onChange={(e) => setSenhaConfirma(e.target.value)}
                         className="w-full bg-[#eef1f5] text-[#172333] px-4 py-3 rounded-xl border border-[#b5c2d3] shadow-none focus:outline-none focus:border-[#f34b27]"
                         placeholder="••••••••" />
                     </div>
                   )}

                   <div className="pt-6">
                     <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#315275] to-[#e3e9f1] border border-[#b5c2d3] text-[#172333] hover:from-[#52683e] hover:to-[#394b2b] py-4 px-6 rounded-2xl font-bold shadow-none transition-all flex justify-between items-center group">
                       <span>{isLoading ? "Processando..." : (isLoginMode ? "Entrar na Conta" : "Abrir Conta")}</span>
                       {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-[#f34b27]" />}
                     </button>
                   </div>
                 </form>

                 <div className="mt-8 pt-6 border-t border-[#b5c2d3] flex justify-center">
                   <button onClick={() => { setIsLoginMode(!isLoginMode); resetFields(); }} className="text-xs font-bold text-[#5c6d83] hover:text-[#f34b27] transition-colors uppercase tracking-widest">
                     {isLoginMode ? "Criar nova conta" : "Já tenho uma conta"}
                   </button>
                 </div>
               </div>

               {/* 2FA Step */}
               <div hidden={etapaLogin === 0}>
                 <div className="mb-8">
                   <div className="flex items-center gap-3 mb-2">
                     <button onClick={() => setEtapaLogin(0)} className="text-[#5c6d83] hover:text-[#172333] transition-colors p-1 bg-[#eef1f5] rounded-lg border border-[#b5c2d3]">
                       <ArrowRight size={16} className="rotate-180" />
                     </button>
                     <h3 className="text-xl font-bold tracking-tight text-[#172333]">
                       Segurança 2FA
                     </h3>
                   </div>
                   <p className="text-[#5c6d83] text-xs">
                     Utilize seu aplicativo autenticador para ler o código QR ou insira a chave manualmente
                   </p>
                 </div>

                 {!isLoginMode && qrCodeUrl && (
                   <div className="mb-6 flex flex-col items-center justify-center p-4 bg-[#eef1f5] border border-[#b5c2d3] rounded-2xl shadow-none">
                     <img src={qrCodeUrl} alt="QR Code 2FA" className="w-32 h-32 mix-blend-screen opacity-90 rounded-xl" />
                     <p className="mt-3 text-[10px] font-mono text-[#5c6d83] break-all text-center px-4">{chaveSecreta2FA}</p>
                   </div>
                 )}

                 <form onSubmit={handleSubmeter2FA} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-[#5c6d83] uppercase tracking-widest">Código de 6 dígitos</label>
                     <input
                       type="text"
                       inputMode="numeric"
                       autoComplete="one-time-code"
                       maxLength="6"
                       id="codigo2FA" aria-label="Código de 6 dígitos"  value={codigo2FA}
                       autoFocus
                       onChange={(e) => {
                         const val = e.target.value.replace(/\D/g, '');
                         setCodigo2FA(val);
                         if (val.length === 6) {
                           handleSubmeter2FA(null, val);
                         }
                       }}
                       className="w-full bg-[#eef1f5] border border-[#b5c2d3] rounded-2xl shadow-none py-4 text-2xl font-mono text-center tracking-[0.4em] text-[#172333] focus:outline-none focus:border-[#f34b27] transition-colors"
                       placeholder="000000" />
                   </div>

                   <div className="pt-2">
                     <button type="submit" className="w-full bg-gradient-to-r from-[#f34b27] to-[#d9401f] text-[#ffffff] py-4 px-6 rounded-2xl font-bold shadow-none hover:brightness-110 transition-all flex items-center justify-between group">
                       <span>Verificar Código</span>
                       <CornerDownRight size={18} className="group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                     </button>
                   </div>
                 </form>
               </div>
            </MotionWrapper>
         </Dialog>
      )}
    </div>
  );
}
