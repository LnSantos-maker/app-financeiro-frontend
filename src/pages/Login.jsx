import React, { useState } from 'react';
import { ShieldCheck, Smartphone, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { MotionWrapper } from '../components/ui/MotionWrapper';

export default function Login({ onLoginSuccess, mostrarNotificacao }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
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
  
  const [idioma, setIdioma] = useState('en');

  const traducoes = {
    en: { welcome: "Welcome ", back: "Back", create: "Create ", account: "Account", subIn: "Sign in to continue your financial journey", subUp: "Sign up to start your financial journey", signIn: "Sign In", signUp: "Create Account", twoFactor: "Two-Factor Auth", subTwoFactor: "Scan the QR Code with Google Authenticator and enter the 6-digit code", verify: "Verify Code", backToLogin: "Back to Login" },
    pt: { welcome: "Bem-vindo de ", back: "Volta", create: "Criar ", account: "Conta", subIn: "Entre para continuar sua jornada financeira", subUp: "Cadastre-se para iniciar sua jornada financeira", signIn: "Entrar", signUp: "Criar Conta", twoFactor: "Autenticação 2FA", subTwoFactor: "Escaneie o QR Code com o Google Authenticator e digite o código de 6 dígitos", verify: "Verificar Código", backToLogin: "Voltar para Login" }
  };
  const t = traducoes[idioma] || traducoes['en'];

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
    if (!isLoginMode) {
      if (!nomeRegistro || !sobrenomeRegistro) return mostrarNotificacao("Preencha nome e sobrenome.", "erro");
      if (!emailLogin || !emailConfirma) return mostrarNotificacao("Preencha o e-mail.", "erro");
      if (emailLogin !== emailConfirma) return mostrarNotificacao("Os e-mails não coincidem.", "erro");
      if (senhaLogin !== senhaConfirma) return mostrarNotificacao("As senhas não coincidem.", "erro");
    } else {
      if (!emailLogin || !senhaLogin) return mostrarNotificacao("Preencha e-mail e senha.", "erro");
    }

    try {
      if (isLoginMode) await signInWithEmailAndPassword(auth, emailLogin, senhaLogin);
      else await createUserWithEmailAndPassword(auth, emailLogin, senhaLogin);
      await carregarSetup2FA(emailLogin);
      mostrarNotificacao(isLoginMode ? "Acesso liberado!" : "Conta criada com sucesso!", "sucesso");
      setEtapaLogin(1); 
    } catch (error) {
      let mensagem = "Erro ao conectar com a conta.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') mensagem = "E-mail ou senha incorretos.";
      if (error.code === 'auth/email-already-in-use') mensagem = "Este e-mail já está em uso.";
      if (error.code === 'auth/weak-password') mensagem = "A senha deve ter pelo menos 6 caracteres.";
      mostrarNotificacao(mensagem, "erro");
    }
  };

  const handleSubmeter2FA = async (e) => {
    e.preventDefault();
    if (codigo2FA.length !== 6) return mostrarNotificacao("O código deve ter 6 dígitos.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/auth/verificar-2fa/', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailLogin, codigo_2fa: codigo2FA }) 
      });
      const dados = await resposta.json();
      if (resposta.ok) { mostrarNotificacao(dados.mensagem, "sucesso"); onLoginSuccess(emailLogin); } 
      else { mostrarNotificacao(dados.detail, "erro"); }
    } catch (erro) { mostrarNotificacao("Erro ao validar 2FA no servidor.", "erro"); }
  };

  return (
    <div className="flex min-h-screen bg-[#090b10] text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/80 to-[#090b10]/40"></div>
      </div>
      
      <MotionWrapper className="relative z-10 flex flex-col w-full items-center justify-center p-6">
        <div className="mb-8 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 shadow-2xl">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 tracking-tighter">PF</span>
          </div>
        </div>
        
        <div className="w-full max-w-[440px] bg-[#161922]/80 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className={`transition-transform duration-500 w-full ${etapaLogin === 1 ? 'translate-x-0' : 'translate-x-[150%] absolute top-8 left-0 px-8'}`}>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3"><div className="bg-[#d4af37]/10 p-3 rounded-full text-[#d4af37]"><ShieldCheck size={30} /></div></div>
              <h1 className="text-xl font-semibold mb-1">{t.twoFactor}</h1>
              <p className="text-slate-400 text-xs leading-relaxed">{t.subTwoFactor}</p>
            </div>
            {qrCodeUrl ? (
              <div className="flex flex-col items-center justify-center mb-6 bg-[#090b10] p-4 rounded-2xl border border-slate-800">
                <img src={qrCodeUrl} alt="QR Code 2FA" className="w-40 h-40 rounded-lg shadow-md mb-2" />
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Chave de Backup:</span>
                <span className="text-xs text-[#d4af37] font-mono select-all font-bold">{chaveSecreta2FA}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mb-6 bg-[#090b10] p-6 rounded-2xl border border-slate-800 text-center">
                <ShieldCheck size={48} className="text-[#d4af37] mb-4" />
                <p className="text-sm text-slate-400">Gerando QR Code...</p>
              </div>
            )}
            <form onSubmit={handleSubmeter2FA} className="flex flex-col gap-5">
              <div className="bg-[#1c1f26] border border-slate-800 rounded-2xl px-4 py-3 flex gap-3 items-center focus-within:border-[#d4af37] transition-colors">
                <Smartphone className="text-slate-500 shrink-0" size={20} />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Código do Aplicativo</span>
                  <input type="text" value={codigo2FA} onChange={(e) => setCodigo2FA(e.target.value)} maxLength={6} placeholder="000000" className="bg-transparent text-white text-lg font-mono tracking-[0.4em] outline-none w-full text-center" />
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all">{t.verify}</button>
              <button type="button" onClick={() => setEtapaLogin(0)} className="text-slate-500 text-xs hover:text-white transition-colors">{t.backToLogin}</button>
            </form>
          </div>

          <div className={`transition-transform duration-500 w-full ${etapaLogin === 0 ? 'translate-x-0' : '-translate-x-[150%] absolute top-8 left-0 px-8'}`}>
            <div className="text-center mb-8"><h1 className="text-3xl font-semibold mb-2">{isLoginMode ? t.welcome : t.create}<span className="text-[#d4af37]">{isLoginMode ? t.back : t.account}</span></h1><p className="text-slate-400 text-sm">{isLoginMode ? t.subIn : t.subUp}</p></div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmeterLogin}>
              {!isLoginMode && (
                <div className="flex gap-3">
                  <div className="bg-[#1c1f26] border border-slate-800 rounded-2xl px-4 py-3 flex gap-3 items-center w-full focus-within:border-slate-600 transition-colors">
                    <User className="text-slate-500 shrink-0" size={20} />
                    <div className="flex flex-col w-full"><span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Nome</span><input type="text" value={nomeRegistro} onChange={(e) => setNomeRegistro(e.target.value)} placeholder="Seu nome" className="bg-transparent text-white text-sm outline-none w-full" /></div>
                  </div>
                  <div className="bg-[#1c1f26] border border-slate-800 rounded-2xl px-4 py-3 flex gap-3 items-center w-full focus-within:border-slate-600 transition-colors">
                    <div className="flex flex-col w-full"><span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Sobrenome</span><input type="text" value={sobrenomeRegistro} onChange={(e) => setSobrenomeRegistro(e.target.value)} placeholder="Seu sobrenome" className="bg-transparent text-white text-sm outline-none w-full" /></div>
                  </div>
                </div>
              )}
              <div className="bg-[#1c1f26] border border-slate-800 rounded-2xl px-4 py-3 flex gap-3 items-center focus-within:border-slate-600 transition-colors">
                <Mail className="text-slate-500 shrink-0" size={20} />
                <div className="flex flex-col w-full"><span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">E-mail</span><input type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} placeholder="Digite seu e-mail" className="bg-transparent text-white text-sm outline-none w-full" /></div>
              </div>
              {!isLoginMode && (
                <div className="bg-[#1c1f26] border border-slate-800 rounded-2xl px-4 py-3 flex gap-3 items-center focus-within:border-slate-600 transition-colors">
                  <Mail className="text-slate-500 shrink-0" size={20} />
                  <div className="flex flex-col w-full"><span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Confirmar E-mail</span><input type="email" value={emailConfirma} onChange={(e) => setEmailConfirma(e.target.value)} placeholder="Repita seu e-mail" className="bg-transparent text-white text-sm outline-none w-full" /></div>
                </div>
              )}
              <div className="bg-[#1c1f26] border border-slate-800 rounded-2xl px-4 py-3 flex gap-3 items-center focus-within:border-slate-600 transition-colors">
                <Lock className="text-slate-500 shrink-0" size={20} />
                <div className="flex flex-col w-full"><span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Senha</span><input type={mostrarSenha ? "text" : "password"} value={senhaLogin} onChange={(e) => setSenhaLogin(e.target.value)} placeholder="Sua senha" className="bg-transparent text-white text-sm outline-none w-full" /></div>
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="text-slate-500 hover:text-slate-300">{mostrarSenha ? <Eye size={18}/> : <EyeOff size={18}/>}</button>
              </div>
              {!isLoginMode && (
                <div className="bg-[#1c1f26] border border-slate-800 rounded-2xl px-4 py-3 flex gap-3 items-center focus-within:border-slate-600 transition-colors">
                  <Lock className="text-slate-500 shrink-0" size={20} />
                  <div className="flex flex-col w-full"><span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Confirmar Senha</span><input type={mostrarSenha ? "text" : "password"} value={senhaConfirma} onChange={(e) => setSenhaConfirma(e.target.value)} placeholder="Repita sua senha" className="bg-transparent text-white text-sm outline-none w-full" /></div>
                </div>
              )}
              {isLoginMode && (
                <div className="flex justify-end mt-[-8px]">
                  <button type="button" onClick={() => mostrarNotificacao("A recuperação de senha foi ativada!", "sucesso")} className="text-xs text-[#d4af37] hover:text-[#f3cd57] transition-colors">Esqueceu a Senha?</button>
                </div>
              )}
              <button type="submit" className="mt-2 w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-medium py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg">
                {isLoginMode ? "Entrar" : "Criar Conta"} <ArrowRight size={18} />
              </button>
            </form>
            <div className="mt-6 flex justify-center text-sm text-slate-400">
              {isLoginMode ? (
                <span>Não tem uma conta? <button type="button" onClick={() => setIsLoginMode(false)} className="text-[#d4af37] hover:underline font-semibold ml-1">Cadastre-se</button></span>
              ) : (
                <span>Já tem uma conta? <button type="button" onClick={() => setIsLoginMode(true)} className="text-[#d4af37] hover:underline font-semibold ml-1">Fazer Login</button></span>
              )}
            </div>
            <div className="mt-8 flex justify-center items-center gap-3 text-xs font-medium uppercase tracking-widest">
              <button onClick={() => setIdioma('en')} className={`transition-colors ${idioma === 'en' ? 'text-[#d4af37]' : 'text-slate-600 hover:text-slate-400'}`}>EN</button><span className="text-slate-800">|</span><button onClick={() => setIdioma('pt')} className={`transition-colors ${idioma === 'pt' ? 'text-[#d4af37]' : 'text-slate-600 hover:text-slate-400'}`}>PT</button>
            </div>
          </div>
        </div>
      </MotionWrapper>
    </div>
  );
}
