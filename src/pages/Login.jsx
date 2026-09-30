import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, ArrowRight, CornerDownRight } from 'lucide-react';
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
      mostrarNotificacao(isLoginMode ? "Acesso liberado" : "Conta criada", "sucesso");
      setEtapaLogin(1); 
    } catch (error) {
      let mensagem = "Erro de conexão.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') mensagem = "Credenciais inválidas.";
      if (error.code === 'auth/email-already-in-use') mensagem = "E-mail indisponível.";
      if (error.code === 'auth/weak-password') mensagem = "Senha muito fraca.";
      mostrarNotificacao(mensagem, "erro");
    }
  };

  const handleSubmeter2FA = async (e) => {
    e.preventDefault();
    if (codigo2FA.length !== 6) return mostrarNotificacao("Código inválido.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/auth/verificar-2fa/', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailLogin, codigo_2fa: codigo2FA }) 
      });
      const dados = await resposta.json();
      if (resposta.ok) { mostrarNotificacao("Autenticado", "sucesso"); onLoginSuccess(emailLogin); } 
      else { mostrarNotificacao(dados.detail, "erro"); }
    } catch (erro) { mostrarNotificacao("Erro no servidor.", "erro"); }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0a] text-zinc-100 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Grid architecture lines representing precise banking aesthetic */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
      </div>
      
      <div className="relative z-10 flex w-full">
        {/* Left column - Brand & Copy */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 border-r border-zinc-800 bg-[#0a0a0a]/50 backdrop-blur-sm">
          <div>
            <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center mb-8">
              <span className="text-xl font-bold text-white tracking-tight">PF</span>
            </div>
            <h1 className="text-6xl font-light tracking-tight leading-tight text-zinc-100 mt-24">
              Private<br/><span className="font-semibold">Finance.</span>
            </h1>
            <p className="mt-8 text-lg text-zinc-400 max-w-md font-light leading-relaxed">
              Gestão patrimonial rigorosa. Precisão absoluta em cada centavo. O controle do seu capital no mais alto nível de exigência.
            </p>
          </div>
          
          <div className="text-xs text-slate-400 font-mono tracking-widest uppercase">
            Autenticação Segura • Criptografia Fim-a-Fim
          </div>
        </div>

        {/* Right column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0a0a]">
          <MotionWrapper className="w-full max-w-md">
            
            <div className="lg:hidden mb-12 flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-white tracking-tight">PF</span>
              </div>
              <h2 className="text-3xl font-light tracking-tight text-zinc-100">Private <span className="font-semibold">Finance</span></h2>
            </div>

            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${etapaLogin === 1 ? 'opacity-0 translate-x-[-20px] pointer-events-none hidden' : 'opacity-100 translate-x-0'}`}>
              <div className="mb-10">
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-100 mb-2">
                  {isLoginMode ? "Acesso ao Sistema" : "Abertura de Conta"}
                </h3>
                <p className="text-zinc-400 text-sm">
                  {isLoginMode ? "Insira suas credenciais para continuar." : "Preencha seus dados para começar."}
                </p>
              </div>

              <form onSubmit={handleSubmeterLogin} className="space-y-6">
                {!isLoginMode && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Nome</label>
                      <input type="text" value={nomeRegistro} onChange={(e) => setNomeRegistro(e.target.value)}
                        className="w-full bg-[#0a0a0a] border-b border-zinc-700 py-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Nome" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sobrenome</label>
                      <input type="text" value={sobrenomeRegistro} onChange={(e) => setSobrenomeRegistro(e.target.value)}
                        className="w-full bg-[#0a0a0a] border-b border-zinc-700 py-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Sobrenome" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Endereço de E-mail</label>
                  <input type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)}
                    className="w-full bg-[#0a0a0a] border-b border-zinc-700 py-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="usuario@email.com" />
                </div>

                {!isLoginMode && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Confirmar E-mail</label>
                    <input type="email" value={emailConfirma} onChange={(e) => setEmailConfirma(e.target.value)}
                      className="w-full bg-[#0a0a0a] border-b border-zinc-700 py-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="usuario@email.com" />
                  </div>
                )}

                <div className="space-y-2 relative">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Senha de Acesso</label>
                  </div>
                  <div className="relative">
                    <input type={mostrarSenha ? "text" : "password"} value={senhaLogin} onChange={(e) => setSenhaLogin(e.target.value)}
                      className="w-full bg-[#0a0a0a] border-b border-zinc-700 py-3 text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors pr-10"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-zinc-100 transition-colors">
                      {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {!isLoginMode && (
                  <div className="space-y-2 relative">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Confirmar Senha</label>
                    <input type={mostrarSenha ? "text" : "password"} value={senhaConfirma} onChange={(e) => setSenhaConfirma(e.target.value)}
                      className="w-full bg-[#0a0a0a] border-b border-zinc-700 py-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="••••••••" />
                  </div>
                )}

                <div className="pt-4">
                  <button type="submit" className="w-full bg-emerald-500 text-emerald-950 font-medium py-4 px-6 hover:bg-emerald-400 transition-all flex items-center justify-between group">
                    <span>{isLoginMode ? "Autenticar" : "Abrir Conta"}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
                <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                  {isLoginMode ? "Não possui conta? Solicite abertura." : "Já possui conta? Autenticar."}
                </button>
              </div>
            </div>

            {/* 2FA Step */}
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${etapaLogin === 0 ? 'opacity-0 translate-x-[20px] pointer-events-none absolute inset-0' : 'opacity-100 translate-x-0 relative'}`}>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setEtapaLogin(0)} className="text-slate-400 hover:text-zinc-100 transition-colors">
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
                  <h3 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    Segurança 2FA
                  </h3>
                </div>
                <p className="text-zinc-400 text-sm">
                  Utilize seu aplicativo autenticador (Google/Microsoft) para ler o código QR ou insira a chave manualmente.
                </p>
              </div>

              {!isLoginMode && qrCodeUrl && (
                <div className="mb-8 flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800">
                  <img src={qrCodeUrl} alt="QR Code 2FA" className="w-40 h-40 mix-blend-multiply" />
                  <p className="mt-4 text-xs font-mono text-zinc-400 break-all text-center">{chaveSecreta2FA}</p>
                </div>
              )}

              <form onSubmit={handleSubmeter2FA} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Código de 6 dígitos</label>
                  <input type="text" maxLength="6" value={codigo2FA} onChange={(e) => setCodigo2FA(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#0a0a0a] border-b border-zinc-700 py-4 text-3xl font-mono text-center tracking-[0.5em] text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="000000" />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-emerald-500 text-emerald-950 font-medium py-4 px-6 hover:bg-emerald-400 transition-all flex items-center justify-between group">
                    <span>Verificar Identidade</span>
                    <CornerDownRight size={18} className="group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>

          </MotionWrapper>
        </div>
      </div>
    </div>
  );
}
