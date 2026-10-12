import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, ArrowRight, CornerDownRight, TrendingUp, Target, BrainCircuit, X, CalendarClock, CreditCard, ArrowRightLeft, Wallet, ShoppingBag, Sparkles, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { MotionWrapper } from '../components/ui/MotionWrapper';

export default function Login({ onLoginSuccess, mostrarNotificacao }) {
  // Navigation & Modal State
  const [showModal, setShowModal] = useState(false);
  const [showModalRecursos, setShowModalRecursos] = useState(false);
  const [showModalSobre, setShowModalSobre] = useState(false);
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

  const carregarSetup2FA = async (email) => {
    try {
      const res = await fetch(`https://app-financeiro-10tz.onrender.com/auth/setup-2fa/?email=${encodeURIComponent(email)}`);
      const dados = await res.json();
      if (res.ok) {
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
      if (!nomeRegistro || !sobrenomeRegistro) return mostrarNotificacao("Preencha nome e sobrenome.", "erro");
      if (!emailLogin || !emailConfirma) return mostrarNotificacao("Preencha o e-mail.", "erro");
      if (emailLogin !== emailConfirma) return mostrarNotificacao("Os e-mails não coincidem.", "erro");
      if (senhaLogin !== senhaConfirma) return mostrarNotificacao("As senhas não coincidem.", "erro");
    } else {
      if (!emailLogin || !senhaLogin) return mostrarNotificacao("Preencha e-mail e senha.", "erro");
    }

    setIsLoading(true);
    try {
      if (isLoginMode) await signInWithEmailAndPassword(auth, emailLogin, senhaLogin);
      else await createUserWithEmailAndPassword(auth, emailLogin, senhaLogin);
      
      await carregarSetup2FA(emailLogin);
      mostrarNotificacao(isLoginMode ? "Acesso liberado" : "Conta criada", "sucesso");
      setEtapaLogin(1); 
    } catch (error) {
      let mensagem = "Erro de conexão.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') mensagem = "Credenciais inválidas.";
      if (error.code === 'auth/email-already-in-use') mensagem = "E-mail indisponível.";
      if (error.code === 'auth/weak-password') mensagem = "Senha muito fraca.";
      mostrarNotificacao(mensagem, "erro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmeter2FA = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const codigoLimpo = (codigo2FA || '').trim();
    if (codigoLimpo.length !== 6) return mostrarNotificacao("Código inválido. Digite os 6 dígitos.", "erro");
    
    setIsLoading(true);
    const emailNormalizado = (emailLogin || '').trim().toLowerCase();
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/auth/verificar-2fa/', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email: emailNormalizado, codigo_2fa: codigoLimpo }) 
      });
      const dados = await resposta.json();
      if (resposta.ok) { 
        mostrarNotificacao("Autenticado com sucesso", "sucesso"); 
        onLoginSuccess(emailNormalizado); 
      } else { 
        mostrarNotificacao(dados.detail || "Código 2FA incorreto ou expirado.", "erro"); 
      }
    } catch (erro) { 
      mostrarNotificacao("Erro no servidor de autenticação.", "erro"); 
    } finally {
      setIsLoading(false);
    }
  };

  const resetFields = () => {
    setSenhaLogin('');
    setSenhaConfirma('');
  };

  const openAuthModal = (isLogin) => {
    setIsLoginMode(isLogin);
    setShowModal(true);
    setEtapaLogin(0);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1e2226] text-slate-200 font-sans relative overflow-x-hidden selection:bg-[#95bfa6] selection:text-[#1a2f24]">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1b3b40] opacity-50 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 sm:px-8 lg:px-16 py-5 sm:py-6 relative z-20">
         <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 bg-[#23272b] rounded-xl flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(255,255,255,0.05),4px_4px_8px_rgba(0,0,0,0.4)] border border-[#30363d] overflow-hidden">
               <img src="/img/nexus_logo.jpg" alt="NEXUS Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] text-[#e6f0ed]">NEXUS</span>
         </div>
         <nav className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-[#8baaa6]">
            <button type="button" onClick={() => setShowModalRecursos(true)} className="hover:text-[#e6f0ed] transition-colors py-1 cursor-pointer">
              Recursos
            </button>
            <button type="button" onClick={() => setShowModalSobre(true)} className="hover:text-[#e6f0ed] transition-colors py-1 cursor-pointer">
              Sobre Nós
            </button>
         </nav>
         <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => openAuthModal(true)} className="text-xs sm:text-sm font-bold text-[#8baaa6] hover:text-[#e6f0ed] transition-colors min-h-[40px] px-2 sm:px-3">Login</button>
            <button onClick={() => openAuthModal(false)} className="bg-[#95bfa6] text-[#1a2f24] hover:bg-[#a6d1b7] px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-bold shadow-[4px_4px_10px_rgba(0,0,0,0.3)] transition-all text-xs sm:text-sm min-h-[40px]">
               Cadastrar-se
            </button>
         </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center pt-8 sm:pt-10 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-16 relative z-10 w-full max-w-[1400px] mx-auto">
         <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 lg:gap-16">
            
            {/* Left Content */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10 w-full">
               <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] text-[#e6f0ed] mb-6 tracking-tight">
                  UNA SUAS FINANÇAS.<br />CONSTRUA SEU FUTURO.
               </h1>
               <p className="text-sm sm:text-lg text-[#8baaa6] mb-8 sm:mb-10 max-w-lg leading-relaxed font-light">
                  Nexus: A Plataforma de Planejamento Financeiro Inteligente que Centraliza Contas, Otimiza Orçamentos e Traça Caminhos para suas Metas.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button onClick={() => openAuthModal(false)} className="bg-gradient-to-r from-[#14535c] to-[#1b3b40] border border-[#2a5056] text-[#e6f0ed] hover:from-[#1a6b77] hover:to-[#244b52] px-8 py-4 rounded-2xl font-bold shadow-[4px_4px_15px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2 min-h-[44px]">
                     COMEÇAR AGORA <ArrowRight size={18} />
                  </button>
               </div>
            </div>

            {/* Right Mockup */}
            <div className="flex-1 relative w-full max-w-[600px] hidden md:block perspective-[1000px]">
               {/* Mockup Window Neumorphic */}
               <div className="relative z-10 bg-[#2a2e33] border border-[#353a40] rounded-[2rem] p-4 shadow-[15px_20px_40px_rgba(0,0,0,0.5),-5px_-5px_15px_rgba(255,255,255,0.02)] transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                  {/* Browser Header */}
                  <div className="flex gap-2 mb-4 px-2">
                     <div className="w-3 h-3 rounded-full bg-[#e69894]"></div>
                     <div className="w-3 h-3 rounded-full bg-[#d4af37]"></div>
                     <div className="w-3 h-3 rounded-full bg-[#95bfa6]"></div>
                  </div>
                  {/* Dashboard Graphic Representation */}
                  <div className="bg-gradient-to-br from-[#1b3b40] to-[#112a2e] rounded-2xl p-6 border border-[#2a5056] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.3)]">
                     <div className="flex justify-between items-center mb-6">
                        <div className="h-4 w-32 bg-[#2a5056] rounded-full"></div>
                        <div className="h-4 w-20 bg-[#2a5056] rounded-full"></div>
                     </div>
                     {/* Chart Area */}
                     <div className="h-40 bg-[#14535c]/30 rounded-xl mb-6 relative overflow-hidden border border-[#2a5056]/50">
                        {/* Fake Line Chart */}
                        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                           <path d="M0,80 Q25,20 50,60 T100,10" fill="none" stroke="#95bfa6" strokeWidth="2" />
                           <path d="M0,80 Q25,20 50,60 T100,10 L100,100 L0,100 Z" fill="#95bfa6" fillOpacity="0.1" />
                        </svg>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-1/2 h-20 bg-[#244b52] rounded-xl border border-[#316168] p-3 flex flex-col justify-between">
                           <div className="w-6 h-6 rounded-md bg-[#95bfa6]/20"></div>
                           <div className="h-2 w-16 bg-[#316168] rounded-full"></div>
                        </div>
                        <div className="w-1/2 h-20 bg-[#244b52] rounded-xl border border-[#316168] p-3 flex flex-col justify-between">
                           <div className="w-6 h-6 rounded-md bg-[#d4af37]/20"></div>
                           <div className="h-2 w-12 bg-[#316168] rounded-full"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Features 4 Cards Bottom */}
         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
            {[
               { title: "Agregação Segura", icon: <Lock className="text-[#95bfa6]" size={28}/> },
               { title: "Orçamento com IA", icon: <BrainCircuit className="text-[#d4af37]" size={28}/> },
               { title: "Gestão de Portfólio", icon: <TrendingUp className="text-[#a4c5c1]" size={28}/> },
               { title: "Planejamento de Metas", icon: <Target className="text-[#e69894]" size={28}/> }
            ].map((f, i) => (
               <div key={i} className="bg-[#2a2e33] rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-[#353a40] shadow-[6px_6px_15px_rgba(0,0,0,0.3),-4px_-4px_10px_rgba(255,255,255,0.02)] hover:-translate-y-2 transition-transform duration-300 cursor-pointer group">
                  <div className="w-16 h-16 bg-[#23272b] rounded-2xl flex items-center justify-center mb-6 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.05),4px_4px_10px_rgba(0,0,0,0.4)] border border-[#30363d] group-hover:scale-110 transition-transform">
                     {f.icon}
                  </div>
                  <h3 className="font-bold text-[#e2e8f0] tracking-wide">{f.title}</h3>
               </div>
            ))}
         </div>
      </main>

      {/* Auth Modal Overlay */}
      {showModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090b10]/80 backdrop-blur-md p-4">
            <MotionWrapper className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#23272b] rounded-[2rem] p-6 sm:p-8 border border-[#30363d] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative">
               
               <button type="button" onClick={() => setShowModal(false)} className="absolute z-50 top-4 right-4 md:top-6 md:right-6 text-[#8baaa6] hover:text-[#e6f0ed] bg-[#1e2226] p-2 rounded-full border border-[#30363d] shadow-[2px_2px_5px_rgba(0,0,0,0.2)] min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <X size={16}/>
               </button>

               <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${etapaLogin === 1 ? 'opacity-0 translate-x-[-20px] pointer-events-none hidden' : 'opacity-100 translate-x-0'}`}>
                 <div className="mb-8">
                   <h3 className="text-2xl font-bold tracking-tight text-[#e6f0ed] mb-2">
                     {isLoginMode ? "Acesso ao Sistema" : "Criar sua Conta"}
                   </h3>
                   <p className="text-[#8baaa6] text-sm">
                     {isLoginMode ? "Insira suas credenciais para continuar." : "Preencha seus dados para começar."}
                   </p>
                 </div>

                 <form onSubmit={handleSubmeterLogin} className="space-y-5">
                   {!isLoginMode && (
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-[#8baaa6] uppercase tracking-widest">Nome</label>
                         <input type="text" value={nomeRegistro} onChange={(e) => setNomeRegistro(e.target.value)}
                           className="w-full bg-[#1e2226] text-[#e6f0ed] px-4 py-3 rounded-xl border border-[#30363d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] focus:outline-none focus:border-[#95bfa6]"
                           placeholder="Nome" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-[#8baaa6] uppercase tracking-widest">Sobrenome</label>
                         <input type="text" value={sobrenomeRegistro} onChange={(e) => setSobrenomeRegistro(e.target.value)}
                           className="w-full bg-[#1e2226] text-[#e6f0ed] px-4 py-3 rounded-xl border border-[#30363d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] focus:outline-none focus:border-[#95bfa6]"
                           placeholder="Sobrenome" />
                       </div>
                     </div>
                   )}
                   
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-[#8baaa6] uppercase tracking-widest">E-mail</label>
                     <input type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)}
                       className="w-full bg-[#1e2226] text-[#e6f0ed] px-4 py-3 rounded-xl border border-[#30363d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] focus:outline-none focus:border-[#95bfa6]"
                       placeholder="usuario@email.com" />
                   </div>

                   {!isLoginMode && (
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-[#8baaa6] uppercase tracking-widest">Confirmar E-mail</label>
                       <input type="email" value={emailConfirma} onChange={(e) => setEmailConfirma(e.target.value)}
                         className="w-full bg-[#1e2226] text-[#e6f0ed] px-4 py-3 rounded-xl border border-[#30363d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] focus:outline-none focus:border-[#95bfa6]"
                         placeholder="usuario@email.com" />
                     </div>
                   )}

                   <div className="space-y-2 relative">
                     <label className="text-[10px] font-bold text-[#8baaa6] uppercase tracking-widest">Senha</label>
                     <div className="relative">
                       <input type={mostrarSenha ? "text" : "password"} value={senhaLogin} onChange={(e) => setSenhaLogin(e.target.value)}
                         className="w-full bg-[#1e2226] text-[#e6f0ed] px-4 py-3 rounded-xl border border-[#30363d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] focus:outline-none focus:border-[#95bfa6]"
                         placeholder="••••••••" />
                       <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8baaa6] hover:text-[#e6f0ed] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                         {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>
                     </div>
                   </div>

                   {!isLoginMode && (
                     <div className="space-y-2 relative">
                       <label className="text-[10px] font-bold text-[#8baaa6] uppercase tracking-widest">Confirmar Senha</label>
                       <input type={mostrarSenha ? "text" : "password"} value={senhaConfirma} onChange={(e) => setSenhaConfirma(e.target.value)}
                         className="w-full bg-[#1e2226] text-[#e6f0ed] px-4 py-3 rounded-xl border border-[#30363d] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] focus:outline-none focus:border-[#95bfa6]"
                         placeholder="••••••••" />
                     </div>
                   )}

                   <div className="pt-6">
                     <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#14535c] to-[#1b3b40] border border-[#2a5056] text-[#e6f0ed] hover:from-[#1a6b77] hover:to-[#244b52] py-4 px-6 rounded-2xl font-bold shadow-[4px_4px_10px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.1)] transition-all flex justify-between items-center group">
                       <span>{isLoading ? "Processando..." : (isLoginMode ? "Entrar na Conta" : "Abrir Conta")}</span>
                       {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-[#95bfa6]" />}
                     </button>
                   </div>
                 </form>

                 <div className="mt-8 pt-6 border-t border-[#30363d] flex justify-center">
                   <button onClick={() => { setIsLoginMode(!isLoginMode); resetFields(); }} className="text-xs font-bold text-[#8baaa6] hover:text-[#95bfa6] transition-colors uppercase tracking-widest">
                     {isLoginMode ? "Criar nova conta" : "Já tenho uma conta"}
                   </button>
                 </div>
               </div>

               {/* 2FA Step */}
               <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${etapaLogin === 0 ? 'opacity-0 translate-x-[20px] pointer-events-none absolute inset-0' : 'opacity-100 translate-x-0 relative'}`}>
                 <div className="mb-8">
                   <div className="flex items-center gap-3 mb-2">
                     <button onClick={() => setEtapaLogin(0)} className="text-[#8baaa6] hover:text-[#e6f0ed] transition-colors p-1 bg-[#1e2226] rounded-lg border border-[#30363d]">
                       <ArrowRight size={16} className="rotate-180" />
                     </button>
                     <h3 className="text-xl font-bold tracking-tight text-[#e6f0ed]">
                       Segurança 2FA
                     </h3>
                   </div>
                   <p className="text-[#8baaa6] text-xs">
                     Utilize seu aplicativo autenticador para ler o código QR ou insira a chave manualmente.
                   </p>
                 </div>

                 {!isLoginMode && qrCodeUrl && (
                   <div className="mb-6 flex flex-col items-center justify-center p-4 bg-[#1e2226] border border-[#30363d] rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)]">
                     <img src={qrCodeUrl} alt="QR Code 2FA" className="w-32 h-32 mix-blend-screen opacity-90 rounded-xl" />
                     <p className="mt-3 text-[10px] font-mono text-[#8baaa6] break-all text-center px-4">{chaveSecreta2FA}</p>
                   </div>
                 )}

                 <form onSubmit={handleSubmeter2FA} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-[#8baaa6] uppercase tracking-widest">Código de 6 dígitos</label>
                     <input type="text" maxLength="6" value={codigo2FA} onChange={(e) => setCodigo2FA(e.target.value.replace(/\D/g, ''))}
                       className="w-full bg-[#1e2226] border border-[#30363d] rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] py-4 text-2xl font-mono text-center tracking-[0.4em] text-[#e6f0ed] focus:outline-none focus:border-[#95bfa6] transition-colors"
                       placeholder="000000" />
                   </div>

                   <div className="pt-2">
                     <button type="submit" className="w-full bg-gradient-to-r from-[#95bfa6] to-[#a6d1b7] text-[#1a2f24] py-4 px-6 rounded-2xl font-bold shadow-[4px_4px_10px_rgba(0,0,0,0.3)] hover:brightness-110 transition-all flex items-center justify-between group">
                       <span>Verificar Código</span>
                       <CornerDownRight size={18} className="group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                     </button>
                   </div>
                 </form>
               </div>
            </MotionWrapper>
         </div>
      )}
      {/* Modal Recursos do Sistema */}
      {showModalRecursos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090b10]/85 backdrop-blur-md p-4">
          <MotionWrapper className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#23272b] rounded-3xl p-6 sm:p-8 border border-[#30363d] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative">
            <button 
              type="button" 
              onClick={() => setShowModalRecursos(false)} 
              className="absolute z-20 top-4 right-4 sm:top-6 sm:right-6 text-[#8baaa6] hover:text-[#e6f0ed] bg-[#1e2226] p-2 rounded-full border border-[#30363d] shadow-[2px_2px_5px_rgba(0,0,0,0.2)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#0a0c10] flex items-center justify-center border border-teal-500/30 overflow-hidden shadow-[0_0_12px_rgba(45,212,191,0.2)]">
                  <img src="/img/nexus_logo.jpg" alt="NEXUS" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e6f0ed]">
                    Recursos do NEXUS
                  </h3>
                  <span className="text-xs uppercase tracking-widest text-[#95bfa6] font-semibold">Tudo o que o aplicativo oferece</span>
                </div>
              </div>
              <p className="text-[#8baaa6] text-sm leading-relaxed mt-2">
                Conheça em detalhes cada módulo projetado para dar a você autonomia patrimonial e controle financeiro absoluto em alta performance.
              </p>
            </div>

            {/* Grid de Recursos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: <BrainCircuit size={22} className="text-[#95bfa6]" />,
                  title: "Diagnóstico Financeiro 50/30/20",
                  desc: "Separação inteligente automática das despesas entre Essenciais (50%), Estilo de Vida (30%) e Investimentos/Futuro (20%) com cálculo visual de equilíbrio."
                },
                {
                  icon: <CalendarClock size={22} className="text-[#e69894]" />,
                  title: "Agenda de Pagamentos com 0ms Delay",
                  desc: "Fila de contas a pagar com alerta de vencimento, liquidação com um clique e atualização instantânea sem espera de servidor."
                },
                {
                  icon: <CreditCard size={22} className="text-[#d4af37]" />,
                  title: "Gestão de Cartões de Crédito 3D",
                  desc: "Acompanhamento interativo de cartões físicos e virtuais, cálculo dinâmico de limite disponível, fatura atual, dia de fechamento e dia de vencimento."
                },
                {
                  icon: <ArrowRightLeft size={22} className="text-[#a4c5c1]" />,
                  title: "Extrato Completo & Auditoria",
                  desc: "Histórico detalhado de movimentações com pesquisa por descrição, agrupamento por data (Hoje/Ontem) e filtros rápidos por entradas, saídas e cartões."
                },
                {
                  icon: <Target size={22} className="text-[#95bfa6]" />,
                  title: "Cofres Patrimoniais & Metas",
                  desc: "Separe seu dinheiro guardado em cofres temáticos com cálculo de progresso em tempo real, aportes rápidos e resgates seguros."
                },
                {
                  icon: <ShoppingBag size={22} className="text-[#a4c5c1]" />,
                  title: "Vales & Benefícios Corporativos",
                  desc: "Gestão dedicada para saldos de Vale Refeição, Vale Alimentação e cartões de benefícios flexíveis com histórico de consumo."
                },
                {
                  icon: <Sparkles size={22} className="text-[#d4af37]" />,
                  title: "Assistente de IA NEXUS AI",
                  desc: "Algoritmo preditivo de análise orçamentária que gera recomendações e alertas personalizados para manter suas finanças no rumo certo."
                },
                {
                  icon: <ShieldCheck size={22} className="text-[#95bfa6]" />,
                  title: "Segurança 2FA & Acesso Internacional",
                  desc: "Proteção com autenticação em dois fatores (TOTP / Google Authenticator) com janela de tolerância para fuso horário de qualquer país e conexões via VPN."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#1e2226] border border-[#30363d] rounded-2xl p-4 sm:p-5 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.02),4px_4px_10px_rgba(0,0,0,0.3)] hover:border-[#38434b] transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-[#292e33] border border-[#383f45]">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-[#e6f0ed]">{item.title}</h4>
                  </div>
                  <p className="text-xs text-[#8baaa6] leading-relaxed pl-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#30363d]">
              <div className="flex items-center gap-2 text-xs text-[#8baaa6]">
                <CheckCircle2 size={16} className="text-[#95bfa6]" />
                <span>Todos os módulos inclusos na sua conta</span>
              </div>
              <button 
                onClick={() => { setShowModalRecursos(false); openAuthModal(false); }}
                className="w-full sm:w-auto bg-[#95bfa6] hover:bg-[#a6d1b7] text-[#1a2f24] font-bold px-6 py-3 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.3)] transition-all text-sm flex items-center justify-center gap-2"
              >
                Começar a Usar Agora <ArrowRight size={16} />
              </button>
            </div>
          </MotionWrapper>
        </div>
      )}

      {/* Modal Sobre Nós */}
      {showModalSobre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090b10]/85 backdrop-blur-md p-4">
          <MotionWrapper className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#23272b] rounded-3xl p-6 sm:p-8 border border-[#30363d] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative">
            <button 
              type="button" 
              onClick={() => setShowModalSobre(false)} 
              className="absolute z-20 top-4 right-4 sm:top-6 sm:right-6 text-[#8baaa6] hover:text-[#e6f0ed] bg-[#1e2226] p-2 rounded-full border border-[#30363d] shadow-[2px_2px_5px_rgba(0,0,0,0.2)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0a0c10] flex items-center justify-center border border-teal-500/30 overflow-hidden shadow-[0_0_15px_rgba(45,212,191,0.25)]">
                <img src="/img/nexus_logo.jpg" alt="NEXUS" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-[#e6f0ed]">Sobre o NEXUS</h3>
                <span className="text-xs uppercase tracking-widest text-[#95bfa6] font-semibold">Tecnologia & Soberania Financeira</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#8baaa6] leading-relaxed">
              <p>
                O <strong className="text-[#e6f0ed]">NEXUS</strong> foi desenvolvido para redefinir o controle patrimonial moderno. Em um mundo onde planilhas manuais e aplicativos genéricos são lentos e confusos, criamos uma plataforma unificada que alia estética de ponta, velocidade de resposta instantânea e algoritmos de planejamento inteligente.
              </p>
              <p>
                Nossa arquitetura foi construída para funcionar sem barreiras geográficas: seja você um profissional no Brasil, nos Estados Unidos ou na Europa, ou navegando protegido através de VPNs, o sistema garante precisão de fuso horário, segurança com 2FA e sincronização em tempo real.
              </p>
              <div className="p-4 bg-[#1e2226] rounded-2xl border border-[#30363d] space-y-2 mt-4">
                <div className="text-xs font-bold text-[#e6f0ed] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#95bfa6]" /> Nossos Pilares
                </div>
                <ul className="text-xs text-[#8baaa6] space-y-1.5 pl-6 list-disc">
                  <li>Privacidade e criptografia de credenciais.</li>
                  <li>Atualizações com zero latência percebida (Optimistic UI).</li>
                  <li>Diagnóstico financeiro metodológico (50/30/20).</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#30363d] flex justify-end">
              <button 
                onClick={() => setShowModalSobre(false)}
                className="bg-[#292e33] hover:bg-[#32383e] text-[#e6f0ed] font-medium px-5 py-2.5 rounded-xl border border-[#383f45] transition-colors text-sm"
              >
                Fechar
              </button>
            </div>
          </MotionWrapper>
        </div>
      )}
    </div>
  );
}
