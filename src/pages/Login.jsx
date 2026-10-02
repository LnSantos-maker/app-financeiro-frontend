import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, ArrowRight, CornerDownRight, TrendingUp, Target, BrainCircuit, X } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { MotionWrapper } from '../components/ui/MotionWrapper';

export default function Login({ onLoginSuccess, mostrarNotificacao }) {
  // Navigation & Modal State
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Auth Form State
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [etapaLogin, setEtapaLogin] = useState(0); 
  const [emailLogin, setEmailLogin] = useState('luam@admin.com');
  const [senhaLogin, setSenhaLogin] = useState('12345678');
  const [codigo2FA, setCodigo2FA] = useState('123456');

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
      
      if (emailLogin === 'luam@admin.com' && senhaLogin === '12345678') {
        mostrarNotificacao("Acesso Bypass Autorizado", "sucesso");
        onLoginSuccess(emailLogin);
        return;
      }
      
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
    if (codigo2FA.length !== 6) return mostrarNotificacao("Código inválido.", "erro");
    
    setIsLoading(true);
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/auth/verificar-2fa/', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailLogin, codigo_2fa: codigo2FA }) 
      });
      const dados = await resposta.json();
      if (resposta.ok) { mostrarNotificacao("Autenticado", "sucesso"); onLoginSuccess(emailLogin); } 
      else { mostrarNotificacao(dados.detail, "erro"); }
    } catch (erro) { mostrarNotificacao("Erro no servidor.", "erro"); } finally {
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
      <header className="flex justify-between items-center px-6 lg:px-16 py-6 relative z-20">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#23272b] rounded-[10px] flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(255,255,255,0.05),4px_4px_8px_rgba(0,0,0,0.4)] border border-[#30363d]">
               <img src="/img/nexus_logo.jpg" alt="Logo" className="w-7 h-7 rounded-md" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] text-[#e6f0ed]">NEXUS</span>
         </div>
         <nav className="hidden lg:flex gap-8 text-sm font-semibold text-[#8baaa6]">
            <a href="#" className="hover:text-[#e6f0ed] transition-colors">Recursos</a>
            <a href="#" className="hover:text-[#e6f0ed] transition-colors">Planos</a>
            <a href="#" className="hover:text-[#e6f0ed] transition-colors">Metas</a>
            <a href="#" className="hover:text-[#e6f0ed] transition-colors">Sobre Nós</a>
            <a href="#" className="hover:text-[#e6f0ed] transition-colors">Blog</a>
         </nav>
         <div className="flex items-center gap-6">
            <button onClick={() => openAuthModal(true)} className="text-sm font-bold text-[#8baaa6] hover:text-[#e6f0ed] transition-colors">Login</button>
            <button onClick={() => openAuthModal(false)} className="bg-[#95bfa6] text-[#1a2f24] hover:bg-[#a6d1b7] px-6 py-2.5 rounded-2xl font-bold shadow-[4px_4px_10px_rgba(0,0,0,0.3)] transition-all text-sm">
               Cadastrar-se
            </button>
         </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center pt-10 pb-20 px-6 lg:px-16 relative z-10 w-full max-w-[1400px] mx-auto">
         <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-16">
            
            {/* Left Content */}
            <div className="flex-1 flex flex-col items-start text-left z-10">
               <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] text-[#e6f0ed] mb-6 tracking-tight">
                  UNA SUAS FINANÇAS.<br />CONSTRUA SEU FUTURO.
               </h1>
               <p className="text-lg text-[#8baaa6] mb-10 max-w-lg leading-relaxed font-light">
                  Nexus: A Plataforma de Planejamento Financeiro Inteligente que Centraliza Contas, Otimiza Orçamentos e Traça Caminhos para suas Metas.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button onClick={() => openAuthModal(false)} className="bg-gradient-to-r from-[#14535c] to-[#1b3b40] border border-[#2a5056] text-[#e6f0ed] hover:from-[#1a6b77] hover:to-[#244b52] px-8 py-4 rounded-2xl font-bold shadow-[4px_4px_15px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2">
                     COMEÇAR AGORA <ArrowRight size={18} />
                  </button>
                  <button className="bg-[#23272b] border border-[#30363d] text-[#8baaa6] hover:text-[#e6f0ed] hover:bg-[#2d3238] px-8 py-4 rounded-2xl font-bold shadow-[4px_4px_10px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center">
                     VEJA OS PLANOS
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
            <MotionWrapper className="w-full max-w-md bg-[#23272b] rounded-[2rem] p-8 border border-[#30363d] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
               
               <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-[#8baaa6] hover:text-[#e6f0ed] bg-[#1e2226] p-2 rounded-full border border-[#30363d] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]">
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
                       <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8baaa6] hover:text-[#e6f0ed] transition-colors">
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
    </div>
  );
}
