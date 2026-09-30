import { useState, useEffect } from 'react';
import { Home, CreditCard, ArrowRightLeft, Target, Settings, Wallet, Plus, TrendingUp, TrendingDown, Zap, ShoppingBag, Calendar, ChevronDown, X, CheckCircle, AlertCircle, BrainCircuit, Trash2, Download, Eraser, Pencil, User, Mail, Lock, EyeOff, Eye, ArrowRight, ChevronLeft, ChevronRight, Smartphone, ShieldCheck, Search, Filter, TrendingUp as Speed, LogOut, CalendarClock, CheckSquare, QrCode, ClipboardList, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { MotionWrapper } from '../components/ui/MotionWrapper';

export default function Dashboard({ emailLogin, onLogout, mostrarNotificacao }) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });
  
  const [dialogoConfirmacao, setDialogoConfirmacao] = useState({
    aberto: false, titulo: '', mensagem: '', textoAcao: '', corAcao: '', corIcone: '', onConfirm: () => {}
  });
  
  const [modalReceitaAberto, setModalReceitaAberto] = useState(false);
  const [modalDespesaAberto, setModalDespesaAberto] = useState(false);
  const [modalCofreAberto, setModalCofreAberto] = useState(false);
  const [modalAporteAberto, setModalAporteAberto] = useState(false);
  const [modalResgateAberto, setModalResgateAberto] = useState(false);
  const [modalCartaoAberto, setModalCartaoAberto] = useState(false);
  const [modalCompraCartaoAberto, setModalCompraCartaoAberto] = useState(false);
  const [modalAgendamentoAberto, setModalAgendamentoAberto] = useState(false);

  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [editNomeUsuario, setEditNomeUsuario] = useState('');

  const [modalEditSaldoAberto, setModalEditSaldoAberto] = useState(false);
  const [editSaldoValor, setEditSaldoValor] = useState('');

  const [modalEditTxAberto, setModalEditTxAberto] = useState(false);
  const [txEditId, setTxEditId] = useState('');
  const [txEditTitulo, setTxEditTitulo] = useState('');
  const [txEditValor, setTxEditValor] = useState('');
  const [txEditTipo, setTxEditTipo] = useState('Despesa');
  const [txEditCat, setTxEditCat] = useState('essencial');

  const [modalEditMetaAberto, setModalEditMetaAberto] = useState(false);
  const [metaEditId, setMetaEditId] = useState('');
  const [metaEditTitulo, setMetaEditTitulo] = useState('');
  const [metaEditObjetivo, setMetaEditObjetivo] = useState('');
  const [metaEditGuardado, setMetaEditGuardado] = useState('');
  const [metaEditPrazo, setMetaEditPrazo] = useState('');

  const [telaAtiva, setTelaAtiva] = useState('home');
  const [buscaExtrato, setBuscaExtrato] = useState('');
  const [filtroTipoExtrato, setFiltroTipoExtrato] = useState('Todos'); 

  const [tituloReceita, setTituloReceita] = useState('');
  const [valorReceita, setValorReceita] = useState('');
  const [categoriaReceita, setCategoriaReceita] = useState('Salário'); 
  
  const [tituloDespesa, setTituloDespesa] = useState('');
  const [valorDespesa, setValorDespesa] = useState('');
  const [categoriaDespesa, setCategoriaDespesa] = useState('Alimentação'); 
  const [classificacaoDespesa, setClassificacaoDespesa] = useState('essencial');
  
  const [tituloAgendamento, setTituloAgendamento] = useState('');
  const [valorAgendamento, setValorAgendamento] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [categoriaAgendamento, setCategoriaAgendamento] = useState('Moradia');
  const [classificacaoAgendamento, setClassificacaoAgendamento] = useState('essencial');

  const [tituloMeta, setTituloMeta] = useState('');
  const [objetivoMeta, setObjetivoMeta] = useState('');
  const [mesesMeta, setMesesMeta] = useState('');
  
  const [metaSelecionada, setMetaSelecionada] = useState('');
  const [valorAporte, setValorAporte] = useState('');
  const [metaResgateSelecionada, setMetaResgateSelecionada] = useState('');
  const [valorResgate, setValorResgate] = useState('');

  const [nomeCartao, setNomeCartao] = useState('');
  const [limiteCartao, setLimiteCartao] = useState('');
  const [diaFechamento, setDiaFechamento] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('');
  const [cartaoSelecionadoId, setCartaoSelecionadoId] = useState('');
  const [descricaoCompraCartao, setDescricaoCompraCartao] = useState('');
  const [valorCompraCartao, setValorCompraCartao] = useState('');

  const [planilhaReal, setPlanilhaReal] = useState([]);
  const [modalPlanilhaAberto, setModalPlanilhaAberto] = useState(false);
  const [tituloPlanilha, setTituloPlanilha] = useState('');
  const [valorPlanilha, setValorPlanilha] = useState('');
  const [dataPlanilha, setDataPlanilha] = useState('');

  const [idContaReal, setIdContaReal] = useState('');
  const [saldoReal, setSaldoReal] = useState(0);
  const [transacoesReais, setTransacoesReais] = useState([]);
  const [categoriasReais, setCategoriasReais] = useState([]);
  const [metasReais, setMetasReais] = useState([]);
  const [balancoReal, setBalancoReal] = useState({ receitas: 0, despesas: 0, guardado: 0, balanco: 0 });
  const [evolucaoReal, setEvolucaoReal] = useState([]);
  const [cartoesReais, setCartoesReais] = useState([]);
  const [agendamentosReais, setAgendamentosReais] = useState([]);

  const [inteligenciaReal, setInteligenciaReal] = useState({
    total_receitas: 0,
    essenciais: { valor: 0, porcentagem: 0, limite_ideal: 50, itens: [] },
    estilo_vida: { valor: 0, porcentagem: 0, limite_ideal: 30, itens: [] },
    futuro: { valor: 0, porcentagem: 0, limite_ideal: 20, itens: [] }
  });

  const [categoriaExpandida, setCategoriaExpandida] = useState(null);
  const [cartaoExpandidoExtrato, setCartaoExpandidoExtrato] = useState(null);

  const traducoes = {
    en: { welcome: "Welcome ", back: "Back", create: "Create ", account: "Account", subIn: "Sign in to continue your financial journey", subUp: "Sign up to start your financial journey", fName: "First Name", lName: "Last Name", email: "Email Address", pass: "Password", forgot: "Forgot Password?", signIn: "Sign In", signUp: "Create Account", or: "or continue with", dontHave: "Don't have an account? ", alreadyHave: "Already have an account? ", toSignUp: "Sign Up", toSignIn: "Sign In", placeEmail: "Enter your email", placePass: "Enter your password", twoFactor: "Two-Factor Auth", subTwoFactor: "Scan the QR Code with Google Authenticator and enter the 6-digit code", verify: "Verify Code", backToLogin: "Back to Login" },
    pt: { welcome: "Bem-vindo de ", back: "Volta", create: "Criar ", account: "Conta", subIn: "Entre para continuar sua jornada financeira", subUp: "Cadastre-se para iniciar sua jornada financeira", fName: "Nome", lName: "Sobrenome", email: "Endereço de E-mail", pass: "Senha", forgot: "Esqueceu a Senha?", signIn: "Entrar", signUp: "Criar Conta", or: "ou continue com", dontHave: "Não tem uma conta? ", alreadyHave: "Já tem uma conta? ", toSignUp: "Cadastre-se", toSignIn: "Entrar", placeEmail: "Digite seu e-mail", placePass: "Digite sua senha", twoFactor: "Autenticação 2FA", subTwoFactor: "Escaneie o QR Code com o Google Authenticator e digite o código de 6 dígitos", verify: "Verificar Código", backToLogin: "Voltar para Login" }
  };
  const t = traducoes[idioma] || traducoes['en'];

  // ==============================================================================
  // FUNCIONALIDADES E INTEGRAÇÕES 
  // ==============================================================================
  
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
    } catch (e) {
      console.error("Erro ao carregar QR Code do 2FA", e);
    }
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
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, emailLogin, senhaLogin);
      } else {
        await createUserWithEmailAndPassword(auth, emailLogin, senhaLogin);
      }
      
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
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email: emailLogin, codigo_2fa: codigo2FA }) 
      });
      const dados = await resposta.json();
      if (resposta.ok) { setIsAutenticado(true); mostrarNotificacao(dados.mensagem, "sucesso"); } 
      else { mostrarNotificacao(dados.detail, "erro"); }
    } catch (erro) { mostrarNotificacao("Erro ao validar 2FA no servidor.", "erro"); }
  };

  const nomeMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const mesFormatadoExibicao = `${nomeMeses[dataSelecionada.getMonth()]} de ${dataSelecionada.getFullYear()}`;
  const mesParametroAPI = telaAtiva === 'extrato' ? "todos" : `${dataSelecionada.getFullYear()}-${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}`;

  const mesAnterior = () => setDataSelecionada(new Date(dataSelecionada.setMonth(dataSelecionada.getMonth() - 1)));
  const proximoMes = () => setDataSelecionada(new Date(dataSelecionada.setMonth(dataSelecionada.getMonth() + 1)));

  
  const carregarDadosDaTela = async (idConta) => {
    try {
      const resPerfil = await fetch(`https://app-financeiro-10tz.onrender.com/perfil/${idConta}`);
      if (resPerfil.ok) { setNomeUsuario((await resPerfil.json()).nome_usuario); }

      const resSaldo = await fetch(`https://app-financeiro-10tz.onrender.com/saldo/${idConta}`);
      setSaldoReal((await resSaldo.json()).saldo_atual || 0);

      const resTx = await fetch(`https://app-financeiro-10tz.onrender.com/listar_transacoes/${idConta}?mes=${mesParametroAPI}`);
      setTransacoesReais((await resTx.json()).transacoes || []);

      const paramMesAtual = `${dataSelecionada.getFullYear()}-${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}`;
      
      const resGraficos = await fetch(`https://app-financeiro-10tz.onrender.com/graficos/${idConta}?mes=${paramMesAtual}`);
      setCategoriasReais((await resGraficos.json()).categorias || []);

      const resMetas = await fetch(`https://app-financeiro-10tz.onrender.com/listar_metas/${idConta}`);
      setMetasReais((await resMetas.json()).metas || []);

      const resBalanco = await fetch(`https://app-financeiro-10tz.onrender.com/balanco/${idConta}?mes=${paramMesAtual}`);
      setBalancoReal(await resBalanco.json());

      const resEvolucao = await fetch(`https://app-financeiro-10tz.onrender.com/evolucao/${idConta}?mes=${paramMesAtual}`);
      setEvolucaoReal((await resEvolucao.json()).evolucao || []);

      const resInteligencia = await fetch(`https://app-financeiro-10tz.onrender.com/inteligencia/${idConta}?mes=${paramMesAtual}`);
      setInteligenciaReal(await resInteligencia.json());

      const resCartoes = await fetch(`https://app-financeiro-10tz.onrender.com/listar_cartoes/${idConta}`);
      setCartoesReais((await resCartoes.json()).cartoes || []);

      const resAgendamentos = await fetch(`https://app-financeiro-10tz.onrender.com/listar_agendamentos/${idConta}?mes=${paramMesAtual}`);
      setAgendamentosReais((await resAgendamentos.json()).agendamentos || []);

      const resPlanilha = await fetch(`https://app-financeiro-10tz.onrender.com/listar_planilha/${idConta}`);
      setPlanilhaReal((await resPlanilha.json()).planilha || []);

    } catch (erro) {
      console.error("Erro de conexão:", erro);
    }
  };

  useEffect(() => { if (isAutenticado && idContaReal) { carregarDadosDaTela(idContaReal); } }, [dataSelecionada, telaAtiva]); 

  useEffect(() => {
    if (isAutenticado && emailLogin) {
      fetch(`https://app-financeiro-10tz.onrender.com/configurar/?email=${encodeURIComponent(emailLogin)}`)
        .then(res => res.json())
        .then(data => { setIdContaReal(data.id_conta); carregarDadosDaTela(data.id_conta); })
        .catch(err => console.error("Erro na configuração", err));
    }
  }, [isAutenticado, emailLogin]);

  const toggleCategoria = (nomeDaCategoria) => { categoriaExpandida === nomeDaCategoria ? setCategoriaExpandida(null) : setCategoriaExpandida(nomeDaCategoria); };
  const toggleExtratoCartao = (idCartao) => { cartaoExpandidoExtrato === idCartao ? setCartaoExpandidoExtrato(null) : setCartaoExpandidoExtrato(idCartao); };

  const handleSalvarPerfil = async () => {
    if (!editNomeUsuario.trim()) return mostrarNotificacao("O nome não pode ficar vazio.", "erro");
    try {
      const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/perfil/${idContaReal}`, { 
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome_usuario: editNomeUsuario }) 
      });
      if (resposta.ok) { 
        setModalPerfilAberto(false); 
        setNomeUsuario(editNomeUsuario); 
        mostrarNotificacao("Perfil atualizado com sucesso!"); 
      }
    } catch (erro) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleExcluirTransacao = (idTransacao) => {
    setDialogoConfirmacao({
      aberto: true, titulo: 'Apagar Transação', mensagem: 'Tem certeza que deseja apagar esta transação? O valor será estornado.', textoAcao: 'Sim, Apagar', corAcao: 'bg-rose-500 hover:bg-rose-400', corIcone: 'text-rose-500',
      onConfirm: async () => {
        setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
        try {
          const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/transacoes/${idContaReal}/${idTransacao}`, { method: 'DELETE' });
          if (resposta.ok) { carregarDadosDaTela(idContaReal); mostrarNotificacao("Transação apagada com sucesso!"); }
        } catch (erro) { mostrarNotificacao("Erro de conexão.", "erro"); }
      }
    });
  };

  const handleZerarSaldo = () => {
    setDialogoConfirmacao({
      aberto: true, titulo: 'Formatar Conta Inteira', mensagem: 'Deseja FORMATAR a sua conta? Isso apagará TODAS as transações e zerará o saldo. Essa ação não tem volta.', textoAcao: 'Zerar Tudo', corAcao: 'bg-rose-500 hover:bg-rose-400', corIcone: 'text-rose-500',
      onConfirm: async () => {
        setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
        try {
          const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/zerar_saldo/${idContaReal}`, { method: 'PUT' });
          if (resposta.ok) { carregarDadosDaTela(idContaReal); mostrarNotificacao("Conta formatada! Ficha limpa."); setTelaAtiva('home'); }
        } catch (erro) { mostrarNotificacao("Erro de conexão.", "erro"); }
      }
    });
  };

  // NOVA FUNÇÃO DE RESETAR O 2FA
  const handleReset2FA = () => {
    setDialogoConfirmacao({
      aberto: true, 
      titulo: 'Redefinir Autenticador (2FA)', 
      mensagem: 'Isso apagará sua chave de segurança atual. No próximo login, você precisará escanear um novo QR Code no Google Authenticator. Tem certeza?', 
      textoAcao: 'Sim, Redefinir 2FA', 
      corAcao: 'bg-amber-500 hover:bg-amber-400', 
      corIcone: 'text-amber-500',
      onConfirm: async () => {
        setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
        try {
          const emailAtual = auth.currentUser ? auth.currentUser.email : emailLogin;
          const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/auth/reset-2fa/${encodeURIComponent(emailAtual)}`, { method: 'DELETE' });
          if (resposta.ok) { mostrarNotificacao("2FA resetado! O QR Code voltará a aparecer no próximo login."); }
          else { mostrarNotificacao("Erro ao resetar no servidor.", "erro"); }
        } catch (erro) { mostrarNotificacao("Erro de conexão.", "erro"); }
      }
    });
  };

  const handlePagarFatura = (idCartao, valorFaturaAtual) => {
    if (valorFaturaAtual <= 0) return mostrarNotificacao("A fatura já está zerada.", "erro");
    setDialogoConfirmacao({
      aberto: true, titulo: 'Pagar Fatura', mensagem: `Deseja pagar a fatura de R$ ${valorFaturaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}? Esse valor sairá do seu Saldo Livre.`, textoAcao: 'Confirmar Pagamento', corAcao: 'bg-emerald-500 hover:bg-emerald-400', corIcone: 'text-emerald-500',
      onConfirm: async () => {
        setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
        try {
          const resposta = await fetch('https://app-financeiro-10tz.onrender.com/cartoes/pagar/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conta: idContaReal, id_cartao: idCartao, valor: valorFaturaAtual }) });
          if (resposta.ok) { carregarDadosDaTela(idContaReal); mostrarNotificacao("Fatura paga com sucesso!"); } 
          else { const erro = await resposta.json(); mostrarNotificacao(erro.detail, "erro"); }
        } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
      }
    });
  };

  const abrirModalAporte = (idMeta = '') => { setMetaSelecionada(idMeta); setValorAporte(''); setModalAporteAberto(true); };
  const abrirModalResgate = (idMeta = '') => { setMetaResgateSelecionada(idMeta); setValorResgate(''); setModalResgateAberto(true); };
  const abrirModalEditSaldo = () => { setEditSaldoValor(saldoReal.toString()); setModalEditSaldoAberto(true); };

  const handleSalvarEditSaldo = async () => {
    if (editSaldoValor === '') return mostrarNotificacao("Preencha um valor", "erro");
    try {
      const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/saldo/${idContaReal}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ novo_saldo: parseFloat(editSaldoValor.replace(',', '.')) }) });
      if (resposta.ok) { setModalEditSaldoAberto(false); carregarDadosDaTela(idContaReal); mostrarNotificacao("Saldo ajustado!"); }
    } catch (erro) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const abrirModalEditTx = (tx) => {
    setTxEditId(tx.id);
    const nomeLimpo = tx.categoria.includes(': ') ? tx.categoria.split(': ')[1] : tx.categoria;
    setTxEditTitulo(nomeLimpo); setTxEditValor(tx.valor.toString()); setTxEditTipo(tx.tipo); setTxEditCat(tx.classificacao || (tx.tipo === 'Receita' ? 'Salário' : 'essencial')); setModalEditTxAberto(true);
  };

  const handleSalvarEditTx = async () => {
    if (!txEditTitulo || !txEditValor) return mostrarNotificacao("Preencha título e valor.", "erro");
    const txAtualizada = { id_conta: idContaReal, tipo: txEditTipo, valor: parseFloat(txEditValor.replace(',', '.')), categoria: txEditTipo === 'Receita' ? `${txEditCat}: ${txEditTitulo}` : txEditTitulo, data: new Date().toISOString().split('T')[0], classificacao: txEditCat };
    try {
      const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/transacoes/${idContaReal}/${txEditId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(txAtualizada) });
      if (resposta.ok) { setModalEditTxAberto(false); carregarDadosDaTela(idContaReal); mostrarNotificacao("Transação editada!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const abrirModalEditMeta = (meta) => { setMetaEditId(meta.id); setMetaEditTitulo(meta.titulo); setMetaEditObjetivo(meta.objetivo.toString()); setMetaEditGuardado(meta.guardado.toString()); setMetaEditPrazo(Math.round(meta.dias_restantes / 30).toString()); setModalEditMetaAberto(true); };
  
  const handleSalvarEditMeta = async () => {
    if (!metaEditTitulo || !metaEditObjetivo || !metaEditGuardado) return mostrarNotificacao("Preencha os campos essenciais.", "erro");
    const metaAtualizada = { id_conta: idContaReal, titulo: metaEditTitulo, objetivo: parseFloat(metaEditObjetivo.toString().replace(',', '.')), guardado: parseFloat(metaEditGuardado.toString().replace(',', '.')), dias_restantes: parseInt(metaEditPrazo || 1) * 30 };
    try {
      const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/metas/${idContaReal}/${metaEditId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(metaAtualizada) });
      if (resposta.ok) { setModalEditMetaAberto(false); carregarDadosDaTela(idContaReal); mostrarNotificacao("Cofre editado!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleSalvarReceita = async () => {
    if (!tituloReceita || !valorReceita) return mostrarNotificacao("Preencha título e valor.", "erro");
    const novaTransacao = { id_conta: idContaReal, tipo: 'Receita', valor: parseFloat(valorReceita.replace(',', '.')), categoria: `${categoriaReceita}: ${tituloReceita}`, data: new Date().toISOString().split('T')[0], classificacao: 'receita' };
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/transacoes/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novaTransacao) });
      if (resposta.ok) { setModalReceitaAberto(false); setTituloReceita(''); setValorReceita(''); setCategoriaReceita('Salário'); carregarDadosDaTela(idContaReal); mostrarNotificacao("Receita registrada!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const processarSalvamentoDespesa = async () => {
    const novaTransacao = { id_conta: idContaReal, tipo: 'Despesa', valor: parseFloat(valorDespesa.replace(',', '.')), categoria: `${categoriaDespesa}: ${tituloDespesa}`, data: new Date().toISOString().split('T')[0], classificacao: classificacaoDespesa };
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/transacoes/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novaTransacao) });
      if (resposta.ok) { setModalDespesaAberto(false); setTituloDespesa(''); setValorDespesa(''); setCategoriaDespesa('Alimentação'); setClassificacaoDespesa('essencial'); carregarDadosDaTela(idContaReal); mostrarNotificacao("Despesa registrada!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleSalvarDespesa = () => {
    if (!tituloDespesa || !valorDespesa) return mostrarNotificacao("Preencha título e valor.", "erro");
    if (classificacaoDespesa === 'estilo_vida' && inteligenciaReal?.total_receitas > 0 && ((inteligenciaReal?.estilo_vida?.valor || 0) + parseFloat(valorDespesa.replace(',', '.')) > inteligenciaReal.total_receitas * 0.30)) {
        setDialogoConfirmacao({ aberto: true, titulo: 'Alerta Financeiro!', mensagem: `Esse gasto vai ultrapassar o limite recomendado de 30% para Estilo de Vida neste mês. Tem certeza?`, textoAcao: 'Sim, Gastar Mesmo Assim', corAcao: 'bg-amber-500 hover:bg-amber-400', corIcone: 'text-amber-500', onConfirm: () => { setDialogoConfirmacao(prev => ({ ...prev, aberto: false })); processarSalvamentoDespesa(); } });
        return;
    }
    processarSalvamentoDespesa();
  };

  const handleSalvarAgendamento = async () => {
    if (!tituloAgendamento || !valorAgendamento || !dataAgendamento) return mostrarNotificacao("Preencha todos os campos do agendamento.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/agendamentos/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conta: idContaReal, descricao: tituloAgendamento, valor: parseFloat(valorAgendamento.replace(',', '.')), data_vencimento: dataAgendamento, categoria: categoriaAgendamento, classificacao: classificacaoAgendamento }) });
      if (resposta.ok) { setModalAgendamentoAberto(false); setTituloAgendamento(''); setValorAgendamento(''); setDataAgendamento(''); carregarDadosDaTela(idContaReal); mostrarNotificacao("Conta programada!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handlePagarAgendamento = async (idAgendamento) => {
    try {
      const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/agendamentos/pagar/${idAgendamento}`, { method: 'POST' });
      if (resposta.ok) { carregarDadosDaTela(idContaReal); mostrarNotificacao("Conta paga e registrada com sucesso!"); } 
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleExcluirAgendamento = async (idAgendamento) => {
    try {
      const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/agendamentos/${idAgendamento}`, { method: 'DELETE' });
      if (resposta.ok) { carregarDadosDaTela(idContaReal); mostrarNotificacao("Agendamento cancelado!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const totalGuardado = (metasReais || []).reduce((acc, meta) => acc + (meta.guardado || 0), 0);
  const totalObjetivoGlobal = (metasReais || []).reduce((acc, meta) => acc + (meta.objetivo || 0), 0);
  const progressoGlobal = totalObjetivoGlobal > 0 ? Math.min(100, Math.round((totalGuardado / totalObjetivoGlobal) * 100)) : 0;

  const transacoesFiltradas = (transacoesReais || []).filter(tx => {
    const bateuBusca = tx.categoria.toLowerCase().includes(buscaExtrato.toLowerCase());
    const bateuTipo = filtroTipoExtrato === 'Todos' || tx.tipo === filtroTipoExtrato;
    return bateuBusca && bateuTipo;
  });

  const handleSalvarMeta = async () => {
    if (!tituloMeta || !objetivoMeta || !mesesMeta) return mostrarNotificacao("Preencha todos os campos.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/metas/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conta: idContaReal, titulo: tituloMeta, objetivo: parseFloat(objetivoMeta.toString().replace(',', '.')), dias_restantes: parseInt(mesesMeta) * 30 }) });
      if (resposta.ok) { setModalCofreAberto(false); setTituloMeta(''); setObjetivoMeta(''); setMesesMeta(''); carregarDadosDaTela(idContaReal); mostrarNotificacao("Cofre criado com sucesso!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleSalvarAporte = async () => {
    if (!metaSelecionada || !valorAporte) return mostrarNotificacao("Escolha o cofre e o valor.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/aportes/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conta: idContaReal, id_meta: metaSelecionada, valor_aporte: parseFloat(valorAporte.replace(',', '.')) }) });
      if (resposta.ok) { setModalAporteAberto(false); setValorAporte(''); setMetaSelecionada(''); carregarDadosDaTela(idContaReal); mostrarNotificacao("Dinheiro guardado!"); } 
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleSalvarResgate = async () => {
    if (!metaResgateSelecionada || !valorResgate) return mostrarNotificacao("Escolha o cofre e o valor.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/resgatar/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conta: idContaReal, id_meta: metaResgateSelecionada, valor_resgate: parseFloat(valorResgate.replace(',', '.')) }) });
      if (resposta.ok) { setModalResgateAberto(false); setValorResgate(''); setMetaResgateSelecionada(''); carregarDadosDaTela(idContaReal); mostrarNotificacao("Dinheiro resgatado para o Saldo Livre!"); } 
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleSalvarCartao = async () => {
    if (!nomeCartao || !limiteCartao || !diaFechamento || !diaVencimento) return mostrarNotificacao("Preencha todos os dados.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/cartoes/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conta: idContaReal, nome: nomeCartao, limite_total: parseFloat(limiteCartao.toString().replace(',', '.')), dia_fechamento: parseInt(diaFechamento), dia_vencimento: parseInt(diaVencimento) }) });
      if (resposta.ok) { setModalCartaoAberto(false); setNomeCartao(''); setLimiteCartao(''); setDiaFechamento(''); setDiaVencimento(''); carregarDadosDaTela(idContaReal); mostrarNotificacao("Cartão adicionado!"); } 
    } catch (erro) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const abrirModalCompraCartao = (idCartao) => { setCartaoSelecionadoId(idCartao); setModalCompraCartaoAberto(true); };
  
  const handleLancarCompraCartao = async () => {
    if (!descricaoCompraCartao || !valorCompraCartao) return mostrarNotificacao("Preencha a descrição e o valor.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/cartoes/comprar/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conta: idContaReal, id_cartao: cartaoSelecionadoId, descricao: descricaoCompraCartao, valor: parseFloat(valorCompraCartao.replace(',', '.')) }) });
      if (resposta.ok) { setModalCompraCartaoAberto(false); setDescricaoCompraCartao(''); setValorCompraCartao(''); carregarDadosDaTela(idContaReal); mostrarNotificacao("Compra lançada no cartão!"); } 
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleSalvarPlanilha = async () => {
    if (!tituloPlanilha || !valorPlanilha || !dataPlanilha) return mostrarNotificacao("Preencha todos os campos.", "erro");
    try {
      const resposta = await fetch('https://app-financeiro-10tz.onrender.com/planilha/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_conta: idContaReal, descricao: tituloPlanilha, valor: parseFloat(valorPlanilha.replace(',', '.')), vencimento: dataPlanilha }) });
      if (resposta.ok) { setModalPlanilhaAberto(false); setTituloPlanilha(''); setValorPlanilha(''); setDataPlanilha(''); carregarDadosDaTela(idContaReal); mostrarNotificacao("Item adicionado à planilha!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleExcluirPlanilha = async (idItem) => {
    try {
      const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/planilha/${idItem}`, { method: 'DELETE' });
      if (resposta.ok) { carregarDadosDaTela(idContaReal); mostrarNotificacao("Item removido!"); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleAlternarStatusPlanilha = async (idItem, statusAtual) => {
    const novoStatus = statusAtual === 'pendente' ? 'pago' : 'pendente';
    try {
      const resposta = await fetch(`https://app-financeiro-10tz.onrender.com/planilha/${idItem}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: novoStatus }) });
      if (resposta.ok) { carregarDadosDaTela(idContaReal); }
    } catch (e) { mostrarNotificacao("Erro de conexão.", "erro"); }
  };

  const handleExportarWhatsApp = () => {
    if (planilhaReal.length === 0) return mostrarNotificacao("A planilha está vazia.", "erro");
    let texto = "*Minha Planilha de Contas* 📄\n\n";
    let total = 0;
    planilhaReal.forEach(item => {
      const icone = item.status === 'pago' ? '✅' : '⏳';
      texto += `${icone} ${item.descricao} - R$ ${item.valor.toFixed(2)} (Vence: ${item.vencimento.split('-').reverse().join('/')})\n`;
      if (item.status === 'pendente') total += item.valor;
    });
    texto += `\n*Total Pendente:* R$ ${total.toFixed(2)}`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  // ==============================================================================
  // 4. INTERFACE GRÁFICA: LOGIN
  // ==============================================================================
  // 6. RENDERIZAÇÃO DO APLICATIVO INTERNO
  // ==============================================================================
  return (
    <div className="flex h-screen bg-[#090b10] text-white font-sans overflow-hidden relative">
      
      

      {dialogoConfirmacao.aberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4"><h2 className={`text-xl font-bold flex items-center gap-2 ${dialogoConfirmacao.corIcone}`}><AlertCircle size={24} /> {dialogoConfirmacao.titulo}</h2></div>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">{dialogoConfirmacao.mensagem}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDialogoConfirmacao({...dialogoConfirmacao, aberto: false})} className="px-5 py-2.5 rounded-lg text-slate-300 font-medium hover:bg-white/5 transition-colors border border-slate-700">Cancelar</button>
              <button onClick={dialogoConfirmacao.onConfirm} className={`px-5 py-2.5 rounded-lg text-white font-bold transition-colors shadow-lg ${dialogoConfirmacao.corAcao}`}>{dialogoConfirmacao.textoAcao}</button>
            </div>
          </div>
        </div>
      )}

      <aside className="w-20 border-r border-slate-800/50 flex flex-col items-center py-8 gap-8 shrink-0 bg-[#090b10]">
        <div className="bg-[#d4af37]/10 p-3 rounded-xl text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)]"><Wallet size={24} /></div>
        <nav className="flex flex-col gap-6 text-slate-500 mt-4">
          <button onClick={() => setTelaAtiva('home')} className={`p-3 rounded-xl transition-colors ${telaAtiva === 'home' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'hover:text-[#d4af37]'}`} title="Visão Geral"><Home size={24} /></button>
          <button onClick={() => setTelaAtiva('cartoes')} className={`p-3 rounded-xl transition-colors ${telaAtiva === 'cartoes' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'hover:text-[#d4af37]'}`} title="Cartões"><CreditCard size={24} /></button>
          <button onClick={() => setTelaAtiva('extrato')} className={`p-3 rounded-xl transition-colors ${telaAtiva === 'extrato' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'hover:text-[#d4af37]'}`} title="Extrato Completo"><ArrowRightLeft size={24} /></button>
          <button onClick={() => setTelaAtiva('metas')} className={`p-3 rounded-xl transition-colors ${telaAtiva === 'metas' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'hover:text-[#d4af37]'}`} title="Cofres"><Target size={24} /></button>
          <button onClick={() => setTelaAtiva('planilha')} className={`p-3 rounded-xl transition-colors ${telaAtiva === 'planilha' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'hover:text-[#d4af37]'}`} title="Planilha Fantasma"><ClipboardList size={24} /></button>
          <button onClick={() => setTelaAtiva('configuracoes')} className={`p-3 rounded-xl transition-colors mt-auto ${telaAtiva === 'configuracoes' ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20' : 'hover:text-[#d4af37]'}`} title="Configurações"><Settings size={24} /></button>
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        
        {telaAtiva === 'home' && (
          <div className="animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4 bg-[#161922] border border-slate-800/60 rounded-xl px-4 py-2 shadow-lg">
                <button onClick={mesAnterior} className="p-1 hover:bg-[#d4af37]/10 hover:text-[#d4af37] rounded-lg transition-colors text-slate-400"><ChevronLeft size={24} /></button>
                <div className="flex flex-col items-center min-w-[140px]"><span className="text-xl font-bold text-white capitalize">{mesFormatadoExibicao}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Período Selecionado</span></div>
                <button onClick={proximoMes} className="p-1 hover:bg-[#d4af37]/10 hover:text-[#d4af37] rounded-lg transition-colors text-slate-400"><ChevronRight size={24} /></button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setModalAgendamentoAberto(true)} className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all border border-indigo-500/20"><CalendarClock size={18} /> Agendar</button>
                <button onClick={() => setModalReceitaAberto(true)} className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all border border-emerald-500/20"><TrendingUp size={18} /> Receita</button>
                <button onClick={() => setModalDespesaAberto(true)} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all border border-rose-500/20"><TrendingDown size={18} /> Despesa</button>
                <button onClick={() => abrirModalAporte('')} className="bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg"><ArrowRightLeft size={18} /> Guardar</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:border-[#d4af37]/30 group shadow-lg">
                <div className="flex justify-between items-start mb-6"><div className="bg-[#d4af37]/10 p-2 rounded-lg text-[#d4af37]"><Wallet size={20} /></div><div className="flex gap-2"><button onClick={abrirModalEditSaldo} className="text-slate-600 hover:text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md hover:bg-[#d4af37]/10" title="Editar Saldo Manualmente"><Pencil size={18} /></button></div></div>
                <h3 className="text-slate-400 text-sm mb-1">Saldo Livre</h3><p className="text-3xl font-bold text-[#d4af37] mb-1">{saldoReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p><p className="text-slate-500 text-xs">Disponível para uso</p>
              </div>
              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:border-emerald-500/30 shadow-lg">
                <div className="flex justify-between items-start mb-6"><div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400"><Target size={20} /></div></div>
                <h3 className="text-slate-400 text-sm mb-1">Total Guardado</h3><p className="text-3xl font-bold text-emerald-400 mb-1">{totalGuardado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p><p className="text-slate-500 text-xs">Soma de todos os cofres</p>
              </div>
              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:border-[#d4af37]/30 shadow-lg">
                <div className="flex justify-between items-start mb-6"><div className="bg-slate-700/30 p-2 rounded-lg text-slate-300"><ArrowRightLeft size={20} /></div></div>
                <h3 className="text-slate-400 text-sm mb-1">Balanço do Mês</h3><p className={`text-3xl font-bold mb-1 ${(balancoReal?.balanco || 0) >= 0 ? 'text-white' : 'text-rose-400'}`}>{(balancoReal?.balanco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p><p className="text-slate-500 text-xs">R: {(balancoReal?.receitas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} · D: {(balancoReal?.despesas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </div>

            <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6"><div className="bg-[#d4af37]/10 p-2 rounded-lg text-[#d4af37]"><BrainCircuit size={24} /></div><div><h2 className="text-lg font-bold text-white mb-1">Diagnóstico Financeiro (50/30/20)</h2><p className="text-slate-500 text-sm">Com base nas receitas do mês selecionado: {(inteligenciaReal?.total_receitas || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => toggleCategoria('essenciais')} className="bg-[#090b10] border border-slate-800/50 rounded-xl p-5 cursor-pointer hover:bg-black/40 transition-colors group">
                  <div className="flex justify-between items-center mb-2"><h4 className="font-semibold text-white flex items-center gap-1 group-hover:text-slate-300 transition-colors">Essenciais <ChevronDown size={14} className={`transition-transform ${categoriaExpandida === 'essenciais' ? 'rotate-180' : ''}`} /></h4><span className={`text-xs font-bold px-2 py-1 rounded ${(inteligenciaReal?.essenciais?.porcentagem || 0) > 50 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>{inteligenciaReal?.essenciais?.porcentagem || 0}% (Ideal: 50%)</span></div>
                  <p className="text-3xl font-bold text-white mb-3">{(inteligenciaReal?.essenciais?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${(inteligenciaReal?.essenciais?.porcentagem || 0) > 50 ? 'bg-rose-500' : 'bg-slate-500'}`} style={{ width: `${Math.min(inteligenciaReal?.essenciais?.porcentagem || 0, 100)}%` }}></div></div>
                  {categoriaExpandida === 'essenciais' && (<div className="mt-5 pt-4 border-t border-slate-800/50 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">{(inteligenciaReal?.essenciais?.itens || []).map((item, index) => (<div key={index} className="flex justify-between items-center text-sm"><span className="text-slate-400 capitalize">{item.nome}</span><span className="text-slate-300 font-medium">{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>))}{(inteligenciaReal?.essenciais?.itens || []).length === 0 && <span className="text-xs text-slate-500 italic">Nenhum gasto essencial registrado.</span>}</div>)}
                </div>

                <div onClick={() => toggleCategoria('estilo_vida')} className="bg-[#090b10] border border-slate-800/50 rounded-xl p-5 cursor-pointer hover:bg-black/40 transition-colors group">
                  <div className="flex justify-between items-center mb-2"><h4 className="font-semibold text-white flex items-center gap-1 group-hover:text-[#d4af37] transition-colors">Estilo de Vida <ChevronDown size={14} className={`transition-transform ${categoriaExpandida === 'estilo_vida' ? 'rotate-180' : ''}`} /></h4><span className={`text-xs font-bold px-2 py-1 rounded ${(inteligenciaReal?.estilo_vida?.porcentagem || 0) > 30 ? 'bg-rose-500/20 text-rose-400' : 'bg-[#d4af37]/20 text-[#d4af37]'}`}>{inteligenciaReal?.estilo_vida?.porcentagem || 0}% (Ideal: 30%)</span></div>
                  <p className="text-3xl font-bold text-white mb-3">{(inteligenciaReal?.estilo_vida?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${(inteligenciaReal?.estilo_vida?.porcentagem || 0) > 30 ? 'bg-rose-500' : 'bg-[#d4af37]'}`} style={{ width: `${Math.min(inteligenciaReal?.estilo_vida?.porcentagem || 0, 100)}%` }}></div></div>
                  {categoriaExpandida === 'estilo_vida' && (<div className="mt-5 pt-4 border-t border-slate-800/50 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">{(inteligenciaReal?.estilo_vida?.itens || []).map((item, index) => (<div key={index} className="flex justify-between items-center text-sm"><span className="text-slate-400 capitalize">{item.nome}</span><span className="text-slate-300 font-medium">{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>))}{(inteligenciaReal?.estilo_vida?.itens || []).length === 0 && <span className="text-xs text-slate-500 italic">Nenhum gasto de lazer registrado.</span>}</div>)}
                </div>

                <div onClick={() => toggleCategoria('futuro')} className="bg-[#090b10] border border-slate-800/50 rounded-xl p-5 cursor-pointer hover:bg-black/40 transition-colors group">
                  <div className="flex justify-between items-center mb-2"><h4 className="font-semibold text-white flex items-center gap-1 group-hover:text-[#d4af37] transition-colors">Investimento <ChevronDown size={14} className={`transition-transform ${categoriaExpandida === 'futuro' ? 'rotate-180' : ''}`} /></h4><span className={`text-xs font-bold px-2 py-1 rounded ${(inteligenciaReal?.futuro?.porcentagem || 0) >= 20 ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-slate-800 text-slate-400'}`}>{inteligenciaReal?.futuro?.porcentagem || 0}% (Ideal: 20%)</span></div>
                  <p className="text-3xl font-bold text-white mb-3">{(inteligenciaReal?.futuro?.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${(inteligenciaReal?.futuro?.porcentagem || 0) >= 20 ? 'bg-[#d4af37]' : 'bg-slate-500'}`} style={{ width: `${Math.min(inteligenciaReal?.futuro?.porcentagem || 0, 100)}%` }}></div></div>
                  {categoriaExpandida === 'futuro' && (<div className="mt-5 pt-4 border-t border-slate-800/50 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">{(inteligenciaReal?.futuro?.itens || []).map((item, index) => (<div key={index} className={`flex justify-between items-center text-sm ${item.valor < 0 ? 'text-amber-400' : ''}`}><span className="capitalize">{item.nome}</span><span className="font-medium">{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>))}{(inteligenciaReal?.futuro?.itens || []).length === 0 && <span className="text-xs text-slate-500 italic">Nenhum aporte realizado este mês.</span>}</div>)}
                </div>
              </div>
            </div>

            <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg mb-8">
              <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold text-white flex items-center gap-2"><CalendarClock className="text-indigo-400" /> Agenda de Pagamentos</h2><button onClick={() => setModalAgendamentoAberto(true)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors"><Plus size={16} /> Nova Conta</button></div>
              <div className="flex flex-col gap-4">
                {(agendamentosReais || []).length === 0 ? (<p className="text-slate-500 text-sm text-center py-4">Nenhuma conta agendada para este mês.</p>) : (
                  (agendamentosReais || []).map((agenda) => (
                    <div key={agenda.id} className="flex items-center justify-between p-4 bg-[#090b10] border border-slate-800/50 rounded-xl hover:border-indigo-500/30 transition-colors group">
                      <div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400"><Calendar size={20} /></div><div><h4 className="font-semibold text-white">{agenda.categoria}: {agenda.descricao}</h4><p className="text-slate-500 text-xs flex items-center gap-1 mt-1">Vence dia: <span className="text-indigo-300 font-bold">{agenda.data_vencimento.split('-').reverse().join('/')}</span></p></div></div>
                      <div className="flex items-center gap-4"><span className="font-bold text-rose-400 text-lg">{(agenda.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span><div className="flex gap-2"><button onClick={() => handlePagarAgendamento(agenda.id)} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors text-sm border border-emerald-500/20"><CheckSquare size={16} /> Pagar</button><button onClick={() => handleExcluirAgendamento(agenda.id)} className="text-slate-600 hover:text-rose-500 p-2 rounded transition-colors" title="Cancelar Agendamento"><Trash2 size={18} /></button></div></div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6"><div><h2 className="text-lg font-bold text-white mb-1">Evolução Financeira (Últimos 6 Meses)</h2></div></div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={(evolucaoReal || [])} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" /><XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} /><RechartsTooltip contentStyle={{ backgroundColor: '#090b10', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#d4af37' }} /><Line type="monotone" dataKey="saldo" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f3cd57', stroke: '#fff' }} /></LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-white mb-1">Gastos por Categoria</h2>
                {(categoriasReais || []).length === 0 ? (<div className="flex h-48 items-center justify-center text-slate-500 text-sm">Nenhuma despesa no período.</div>) : (
                  <div className="flex items-center justify-between h-48 mt-4">
                    <div className="w-1/2 h-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoriasReais} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">{(categoriasReais || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer></div>
                    <div className="w-1/2 flex flex-col gap-3 pl-4">{(categoriasReais || []).map((item, index) => (<div key={index} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-slate-300 truncate w-16">{item.name}</span></div><span className="font-medium text-white">R$ {item.value}</span></div>))}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg pb-10">
              <h2 className="text-lg font-bold text-white mb-6">Transações do Mês (Extrato)</h2>
              <div className="flex flex-col gap-4">
                {(transacoesReais || []).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4"><div className={`p-3 rounded-xl ${tx.tipo === 'Receita' ? 'bg-emerald-500/10 text-emerald-400' : tx.tipo === 'Cartao' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-rose-500/10 text-rose-400'}`}>{tx.tipo === 'Receita' ? <Zap size={20} /> : tx.tipo === 'Cartao' ? <CreditCard size={20} /> : <ShoppingBag size={20} />}</div><div><h4 className="font-semibold text-white">{tx.categoria}</h4><p className="text-slate-500 text-xs">{tx.tipo === 'Cartao' ? 'Cartão de Crédito' : tx.tipo} · {tx.data.split('-').reverse().join('/')}</p></div></div>
                    <div className="flex items-center gap-4"><span className={`font-bold ${tx.tipo === 'Receita' ? 'text-emerald-400' : tx.tipo === 'Cartao' ? 'text-[#d4af37]' : 'text-rose-400'}`}>{tx.tipo === 'Receita' ? '+' : '-'}{(tx.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span><div className="flex gap-1">{tx.tipo !== 'Cartao' && (<button onClick={() => abrirModalEditTx(tx)} className="text-slate-600 hover:text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all p-1" title="Editar transação"><Pencil size={18} /></button>)}<button onClick={() => handleExcluirTransacao(tx.id)} className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1" title="Apagar transação"><Trash2 size={18} /></button></div></div>
                  </div>
                ))}
                {(transacoesReais || []).length === 0 && <p className="text-slate-500 text-sm text-center py-4">Nenhuma transação registrada neste mês.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ================================== EXTRATO ================================== */}
        {telaAtiva === 'extrato' && (
          <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100vh-80px)]">
             <header className="flex justify-between items-center mb-8 shrink-0">
               <div><h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Extrato Completo</h1><p className="text-slate-400 text-sm">Busque, filtre e analise todo o seu histórico financeiro.</p></div>
             </header>

            <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-5 mb-6 flex flex-col md:flex-row gap-4 shadow-lg shrink-0">
              <div className="flex-1 bg-[#090b10] border border-slate-800 rounded-xl px-4 py-3 flex gap-3 items-center focus-within:border-[#d4af37] transition-colors"><Search className="text-slate-500 shrink-0" size={20} /><input type="text" value={buscaExtrato} onChange={(e) => setBuscaExtrato(e.target.value)} placeholder="Buscar por nome da transação, mercado, faculdade..." className="bg-transparent text-white text-sm outline-none w-full placeholder:text-slate-600" /></div>
              <div className="md:w-64 bg-[#090b10] border border-slate-800 rounded-xl px-4 py-3 flex gap-3 items-center focus-within:border-[#d4af37] transition-colors"><Filter className="text-slate-500 shrink-0" size={20} /><select value={filtroTipoExtrato} onChange={(e) => setFiltroTipoExtrato(e.target.value)} className="bg-transparent text-white text-sm outline-none w-full cursor-pointer"><option value="Todos" className="bg-[#090b10]">Todas as Transações</option><option value="Receita" className="bg-[#090b10]">Apenas Receitas</option><option value="Despesa" className="bg-[#090b10]">Apenas Despesas</option><option value="Cartao" className="bg-[#090b10]">Apenas Cartão de Crédito</option></select></div>
            </div>
            
            <div className="bg-[#161922] border border-slate-800/60 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-lg">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800/60 bg-black/20 text-xs font-bold text-slate-500 uppercase tracking-widest"><div className="col-span-2">Data</div><div className="col-span-5">Descrição</div><div className="col-span-2 text-center">Tipo</div><div className="col-span-2 text-right">Valor</div><div className="col-span-1 text-center">Ações</div></div>
              <div className="flex-1 overflow-y-auto p-2">
                {transacoesFiltradas.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500"><Search size={48} className="mb-4 text-slate-700 opacity-50" /><p>Nenhuma transação encontrada.</p></div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {transacoesFiltradas.map((tx) => (
                      <div key={tx.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-[#090b10] rounded-xl transition-colors group">
                        <div className="col-span-2 text-sm text-slate-400">{tx.data.split('-').reverse().join('/')}</div>
                        <div className="col-span-5 flex items-center gap-3"><div className={`p-2 rounded-lg shrink-0 ${tx.tipo === 'Receita' ? 'bg-emerald-500/10 text-emerald-400' : tx.tipo === 'Cartao' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'bg-rose-500/10 text-rose-400'}`}>{tx.tipo === 'Receita' ? <Zap size={16} /> : tx.tipo === 'Cartao' ? <CreditCard size={16} /> : <ShoppingBag size={16} />}</div><span className="text-white font-medium truncate">{tx.categoria}</span></div>
                        <div className="col-span-2 flex justify-center"><span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${tx.tipo === 'Receita' ? 'bg-emerald-500/20 text-emerald-400' : tx.tipo === 'Cartao' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-rose-500/20 text-rose-400'}`}>{tx.tipo === 'Cartao' ? 'Cartão' : tx.tipo}</span></div>
                        <div className={`col-span-2 text-right font-bold ${tx.tipo === 'Receita' ? 'text-emerald-400' : tx.tipo === 'Cartao' ? 'text-[#d4af37]' : 'text-rose-400'}`}>{tx.tipo === 'Receita' ? '+' : '-'}{(tx.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <div className="col-span-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">{tx.tipo !== 'Cartao' && (<button onClick={() => abrirModalEditTx(tx)} className="text-slate-600 hover:text-[#d4af37] p-1 rounded transition-colors" title="Editar"><Pencil size={16} /></button>)}<button onClick={() => handleExcluirTransacao(tx.id)} className="text-slate-600 hover:text-rose-500 p-1 rounded transition-colors" title="Excluir"><Trash2 size={16} /></button></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================== METAS ================================== */}
        {telaAtiva === 'metas' && (
          <div className="animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-10"><div><h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Meus Cofres e Metas</h1><p className="text-slate-400 text-sm">Planeje, invista e acompanhe a realização dos seus sonhos.</p></div><button onClick={() => setModalCofreAberto(true)} className="bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]"><Plus size={20} /> Novo Cofre</button></header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-[#161922] to-[#090b10] border border-[#d4af37]/30 rounded-2xl p-6 shadow-lg relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10 text-[#d4af37]"><Target size={64} /></div><h3 className="text-slate-400 text-sm mb-2">Total Guardado Hoje</h3><p className="text-4xl font-bold text-white mb-1">{totalGuardado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p><p className="text-[#d4af37] text-xs font-medium tracking-wide uppercase mt-4">Liquidez Imediata</p></div>
              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg"><h3 className="text-slate-400 text-sm mb-2">Meta Global</h3><p className="text-3xl font-bold text-slate-300 mb-1">{totalObjetivoGlobal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p><p className="text-slate-500 text-xs mt-4">Soma de todos os objetivos</p></div>
              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg flex flex-col justify-center"><h3 className="text-slate-400 text-sm mb-4">Progresso Médio Geral</h3><div className="flex items-center gap-4"><div className="text-4xl font-bold text-[#d4af37]">{progressoGlobal}%</div><div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8c6b4a] to-[#d4af37] rounded-full transition-all duration-1000" style={{ width: `${progressoGlobal}%` }}></div></div></div></div>
            </div>
            {(metasReais || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center bg-[#161922] border border-dashed border-slate-700/60 rounded-2xl p-8 shadow-lg"><Target size={48} className="text-slate-600 mb-4" /><h2 className="text-xl font-bold text-white mb-2">Sua lista de sonhos está vazia!</h2><p className="text-slate-400 text-sm">Crie seu primeiro cofre para começar a guardar dinheiro de forma organizada.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                {(metasReais || []).map((cofre) => (
                  <div key={cofre.id} className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg hover:border-[#d4af37]/30 transition-all group flex flex-col">
                    <div className="flex justify-between items-start mb-6"><div><h3 className="text-xl font-bold text-white mb-1">{cofre.titulo}</h3><p className="text-slate-500 text-xs flex items-center gap-1"><Calendar size={12} /> {cofre.dias_restantes} dias restantes para o alvo</p></div><button onClick={() => abrirModalEditMeta(cofre)} className="text-slate-600 hover:text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg bg-[#090b10] border border-slate-800" title="Editar Cofre"><Pencil size={16} /></button></div>
                    <div className="bg-[#090b10] rounded-xl p-5 mb-6 border border-slate-800/50 flex-1"><div className="flex justify-between items-end mb-2"><div><p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Guardado</p><p className="text-2xl font-bold text-[#d4af37]">R$ {(cofre.guardado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><div className="text-right"><p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Objetivo</p><p className="text-lg font-bold text-slate-300">R$ {(cofre.objetivo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div></div><div className="h-3 w-full bg-slate-800 rounded-full mt-4 mb-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8c6b4a] to-[#d4af37] rounded-full transition-all duration-1000" style={{ width: `${cofre.progresso}%` }}></div></div><div className="flex justify-end"><span className="text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded">{cofre.progresso}% concluído</span></div></div>
                    <div className="flex gap-3"><button onClick={() => abrirModalResgate(cofre.id)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors text-sm flex justify-center items-center gap-2 border border-slate-700"><Download size={16} /> Resgatar</button><button onClick={() => abrirModalAporte(cofre.id)} className="flex-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] font-bold py-3 rounded-xl transition-colors text-sm flex justify-center items-center gap-2 border border-[#d4af37]/30"><Speed size={16} /> Aportar</button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================== PLANILHA FANTASMA ================================== */}
        {telaAtiva === 'planilha' && (
          <div className="animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-10">
              <div><h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Planilha Fantasma</h1><p className="text-slate-400 text-sm">Contas avulsas que não afetam o seu saldo livre.</p></div>
              <div className="flex gap-3">
                <button onClick={handleExportarWhatsApp} className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all border border-emerald-500/20"><MessageCircle size={20} /> Enviar p/ WhatsApp</button>
                <button onClick={() => setModalPlanilhaAberto(true)} className="bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg"><Plus size={20} /> Novo Item</button>
              </div>
            </header>

            <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg">
              {planilhaReal.length === 0 ? (
                <div className="text-center py-10"><ClipboardList size={48} className="mx-auto text-slate-700 mb-4" /><p className="text-slate-500">Sua planilha está vazia.</p></div>
              ) : (
                <div className="flex flex-col gap-3">
                  {planilhaReal.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-[#090b10] border border-slate-800/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleAlternarStatusPlanilha(item.id, item.status)} className={`p-1 rounded-full border-2 transition-colors ${item.status === 'pago' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-slate-600 text-transparent hover:border-slate-400'}`}><CheckCircle size={20} /></button>
                        <div>
                          <h4 className={`font-semibold ${item.status === 'pago' ? 'text-slate-500 line-through' : 'text-white'}`}>{item.descricao}</h4>
                          <p className="text-slate-500 text-xs">Vence em: {item.vencimento.split('-').reverse().join('/')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${item.status === 'pago' ? 'text-slate-600' : 'text-white'}`}>R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <button onClick={() => handleExcluirPlanilha(item.id)} className="text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================== CONFIGURAÇÕES ================================== */}
        {telaAtiva === 'configuracoes' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10"><h1 className="text-2xl font-bold mb-1">Configurações</h1><p className="text-slate-400 text-sm">Gerencie sua conta, segurança e dados.</p></header>
            <div className="max-w-3xl flex flex-col gap-6">
              
              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User className="text-[#d4af37]"/> Meu Perfil</h2>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-[#090b10] border border-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-[#d4af37] uppercase">
                    {nomeUsuario.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-xl capitalize">{nomeUsuario}</p>
                    <p className="text-slate-400 text-sm">{auth.currentUser ? auth.currentUser.email : emailLogin}</p>
                  </div>
                  <button onClick={() => { setEditNomeUsuario(nomeUsuario); setModalPerfilAberto(true); }} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2">
                    <Pencil size={16} /> Editar Perfil
                  </button>
                </div>
              </div>

              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="text-[#d4af37]"/> Segurança</h2>
                <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                  <div>
                    <p className="text-white font-medium">Autenticação de Dois Fatores (2FA)</p>
                    <p className="text-slate-500 text-sm">Protegendo sua conta através do Google Authenticator.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/20">Ativado</span>
                    <button onClick={handleReset2FA} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs px-3 py-1 rounded-lg font-bold border border-amber-500/20 transition-colors">Resetar</button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">Palavra-passe de Acesso</p>
                    <p className="text-slate-500 text-sm">Proteção ativa no banco de dados da nuvem.</p>
                  </div>
                  <button onClick={() => mostrarNotificacao("Troca de palavra-passe pelo painel Web ativada!", "sucesso")} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700">Alterar Palavra-passe</button>
                </div>
              </div>

              <div className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 shadow-lg border-l-4 border-l-rose-500"><h2 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2"><AlertCircle /> Zona de Perigo</h2><p className="text-slate-400 text-sm mb-4">Ações irreversíveis para a sua conta e seus dados financeiros. Proceda com extrema cautela.</p><div className="flex gap-4"><button onClick={handleZerarSaldo} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm font-bold border border-rose-500/20 transition-colors flex items-center gap-2 shadow-lg"><Trash2 size={16} /> Formatar e Zerar Conta</button></div></div>
              <button onClick={onLogout} className="w-full bg-[#090b10] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 font-bold py-4 rounded-xl mt-2 transition-all border border-slate-800 hover:border-rose-500/30 flex justify-center items-center gap-2">Sair do Aplicativo <LogOut size={18} /></button>
            </div>
          </div>
        )}
        
        {telaAtiva === 'cartoes' && (
          <div className="animate-in fade-in duration-300">
             <header className="flex justify-between items-center mb-10"><div><h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Meus Cartões</h1><p className="text-slate-400 text-sm">Controle de limites e faturas</p></div><button onClick={() => setModalCartaoAberto(true)} className="bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]"><Plus size={20} /> Adicionar Cartão</button></header>
            {(cartoesReais || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-[#161922] border border-slate-800/60 rounded-2xl p-8 shadow-lg"><div className="bg-[#d4af37]/10 p-6 rounded-full text-[#d4af37] mb-6 border border-[#d4af37]/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]"><CreditCard size={48} /></div><h2 className="text-2xl font-bold text-white mb-4">Nenhum cartão cadastrado</h2><p className="text-slate-400 max-w-md text-sm mb-8">Adicione o seu primeiro cartão de crédito para começar a controlar faturas e limites.</p></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {(cartoesReais || []).map(cartao => (
                  <div key={cartao.id} className="bg-[#161922] border border-slate-800/60 rounded-2xl p-6 transition-transform hover:-translate-y-1 shadow-lg">
                    <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3"><div className="bg-[#d4af37]/10 p-3 rounded-xl text-[#d4af37] border border-[#d4af37]/20"><CreditCard size={24} /></div><div><h3 className="text-lg font-bold text-white">{cartao.nome}</h3><p className="text-slate-500 text-xs">Vence dia {cartao.dia_vencimento} • Fecha dia {cartao.dia_fechamento}</p></div></div></div>
                    <div className="bg-[#090b10] rounded-xl p-5 mb-4 border border-slate-800/50">
                      <div className="flex justify-between items-end mb-2"><div><p className="text-slate-400 text-xs mb-1">Fatura Atual</p><p className="text-2xl font-bold text-white">R$ {(cartao.fatura_atual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div></div>
                      <div className="h-2 w-full bg-slate-800 rounded-full mb-3 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8c6b4a] to-[#d4af37] rounded-full transition-all duration-1000" style={{ width: `${cartao.progresso_limite || 0}%` }}></div></div>
                      <div className="flex justify-between text-xs"><span className="text-emerald-400">Disponível: R$ {(cartao.limite_disponivel || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span><span className="text-slate-500">Limite: R$ {(cartao.limite_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                    </div>
                    <div className="flex gap-2 mt-4"><button onClick={() => abrirModalCompraCartao(cartao.id)} className="flex-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] font-medium py-2 rounded-lg transition-colors text-sm border border-[#d4af37]/20">Lançar Compra</button><button onClick={() => handlePagarFatura(cartao.id, cartao.fatura_atual)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-colors text-sm border border-slate-700">Pagar Fatura</button></div>
                    <div onClick={() => toggleExtratoCartao(cartao.id)} className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800/50 cursor-pointer group"><span className="text-sm text-slate-400 group-hover:text-[#d4af37] transition-colors">Ver compras desta fatura</span><ChevronDown size={16} className={`text-slate-500 transition-transform ${cartaoExpandidoExtrato === cartao.id ? 'rotate-180' : ''}`} /></div>
                    {cartaoExpandidoExtrato === cartao.id && (<div className="mt-4 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">{(cartao.extrato || []).map(compra => (<div key={compra.id} className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2 last:border-0 last:pb-0"><span className="text-slate-300">{compra.descricao}</span><span className="text-white font-medium">R$ {(compra.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>))}{(cartao.extrato || []).length === 0 && <span className="text-xs text-slate-500 italic">Nenhuma compra nesta fatura.</span>}</div>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==============================================================================
          MODAIS E FORMULÁRIOS
          ============================================================================== */}

      {modalPerfilAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><User size={24} className="text-[#d4af37]"/> Editar Perfil</h2>
              <button onClick={() => setModalPerfilAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Como quer ser chamado?</label>
                <input type="text" value={editNomeUsuario} onChange={(e) => setEditNomeUsuario(e.target.value)} placeholder="Ex: Luan, João, Maria..." className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" />
              </div>
              <button onClick={handleSalvarPerfil} className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {modalPlanilhaAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardList className="text-[#d4af37]"/> Adicionar à Planilha</h2><button onClick={() => setModalPlanilhaAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">Descrição do Item</label><input type="text" value={tituloPlanilha} onChange={(e) => setTituloPlanilha(e.target.value)} placeholder="Ex: Conserto, Presente..." className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorPlanilha} onChange={(e) => setValorPlanilha(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
                <div><label className="text-slate-400 text-sm mb-1 block">Data de Vencimento</label><input type="date" value={dataPlanilha} onChange={(e) => setDataPlanilha(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37] [color-scheme:dark]" /></div>
              </div>
              <button onClick={handleSalvarPlanilha} className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Adicionar Item</button>
            </div>
          </div>
        </div>
      )}

      {modalAgendamentoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2"><CalendarClock size={24}/> Agendar Conta</h2><button onClick={() => setModalAgendamentoAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">O que vai pagar?</label><input type="text" value={tituloAgendamento} onChange={(e) => setTituloAgendamento(e.target.value)} placeholder="Ex: Netflix, Conta de Luz" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorAgendamento} onChange={(e) => setValorAgendamento(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500" /></div>
                <div><label className="text-slate-400 text-sm mb-1 block">Data de Vencimento</label><input type="date" value={dataAgendamento} onChange={(e) => setDataAgendamento(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Categoria</label><select value={categoriaAgendamento} onChange={(e) => setCategoriaAgendamento(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500"><option value="Moradia">Moradia</option><option value="Alimentação">Alimentação</option><option value="Transporte">Transporte</option><option value="Lazer">Lazer</option><option value="Saúde">Saúde</option><option value="Educação">Educação</option><option value="Assinaturas">Assinaturas</option><option value="Outros">Outros</option></select></div>
                <div><label className="text-slate-400 text-sm mb-1 block">Tipo no Gráfico</label><select value={classificacaoAgendamento} onChange={(e) => setClassificacaoAgendamento(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500"><option value="essencial">Gasto Essencial</option><option value="estilo_vida">Estilo de Vida (Lazer)</option></select></div>
              </div>
              <button onClick={handleSalvarAgendamento} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Agendar Conta</button>
            </div>
          </div>
        </div>
      )}
      
      {modalEditSaldoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><Pencil size={24} className="text-[#d4af37]"/> Ajustar Saldo Livre</h2><button onClick={() => setModalEditSaldoAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <p className="text-slate-400 text-sm">Use isto para corrigir pequenas diferenças no saldo sem apagar o histórico.</p>
              <div><label className="text-slate-400 text-sm mb-1 block">Novo Saldo Atual (R$)</label><input type="number" value={editSaldoValor} onChange={(e) => setEditSaldoValor(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <button onClick={handleSalvarEditSaldo} className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Salvar Novo Saldo</button>
            </div>
          </div>
        </div>
      )}

      {modalEditTxAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><Pencil size={24} className="text-[#d4af37]"/> Editar {txEditTipo}</h2><button onClick={() => setModalEditTxAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">Título</label><input type="text" value={txEditTitulo} onChange={(e) => setTxEditTitulo(e.target.value)} placeholder="Título" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={txEditValor} onChange={(e) => setTxEditValor(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
                <div>{txEditTipo === 'Despesa' ? (<><label className="text-slate-400 text-sm mb-1 block">Classificação</label><select value={txEditCat} onChange={(e) => setTxEditCat(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500"><option value="essencial">Essencial</option><option value="estilo_vida">Estilo de Vida</option></select></>) : (<><label className="text-slate-400 text-sm mb-1 block">Categoria</label><select value={txEditCat} onChange={(e) => setTxEditCat(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500"><option value="Salário">Salário</option><option value="Vendas">Vendas</option><option value="Rendimento">Rendimento</option><option value="Outros">Outros</option></select></>)}</div>
              </div>
              <button onClick={handleSalvarEditTx} className={`w-full text-white font-bold py-3.5 rounded-xl mt-4 transition-colors ${txEditTipo === 'Receita' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-rose-500 hover:bg-rose-400'}`}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {modalEditMetaAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><Pencil size={24} className="text-[#d4af37]"/> Editar Cofre</h2><button onClick={() => setModalEditMetaAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">Nome do Objetivo</label><input type="text" value={metaEditTitulo} onChange={(e) => setMetaEditTitulo(e.target.value)} placeholder="Ex: Reserva de Emergência" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Valor Objetivo (R$)</label><input type="number" value={metaEditObjetivo} onChange={(e) => setMetaEditObjetivo(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
                <div><label className="text-slate-400 text-sm mb-1 block">Prazo (Meses)</label><input type="number" value={metaEditPrazo} onChange={(e) => setMetaEditPrazo(e.target.value)} placeholder="Ex: 12" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              </div>
              {parseFloat(metaEditObjetivo.toString().replace(',','.')) > 0 && parseInt(metaEditPrazo) > 0 && (<div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-3 text-center mt-1"><p className="text-[#d4af37] text-sm">💡 Meta: Guarde <strong>{(parseFloat(metaEditObjetivo.toString().replace(',','.')) / parseInt(metaEditPrazo)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> por mês.</p></div>)}
              <div><label className="text-slate-400 text-sm mb-1 block">Dinheiro Guardado (R$)</label><input type="number" value={metaEditGuardado} onChange={(e) => setMetaEditGuardado(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /><p className="text-xs text-slate-500 mt-1">Atenção: Alterar este valor não afeta o Saldo Livre. Para resgatar saldo real, use o botão "Resgatar".</p></div>
              <button onClick={handleSalvarEditMeta} className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {modalReceitaAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2"><TrendingUp size={24}/> Nova Receita</h2><button onClick={() => setModalReceitaAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">O que recebeu?</label><input type="text" value={tituloReceita} onChange={(e) => setTituloReceita(e.target.value)} placeholder="Ex: Pagamento de Trabalho" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorReceita} onChange={(e) => setValorReceita(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-slate-400 text-sm mb-1 block">Categoria</label><select value={categoriaReceita} onChange={(e) => setCategoriaReceita(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500"><option value="Salário">Salário</option><option value="Vendas">Vendas</option><option value="Rendimento">Rendimento</option><option value="Outros">Outros</option></select></div>
              </div>
              <button onClick={handleSalvarReceita} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Salvar Receita</button>
            </div>
          </div>
        </div>
      )}

      {modalDespesaAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-rose-400 flex items-center gap-2"><TrendingDown size={24}/> Nova Despesa</h2><button onClick={() => setModalDespesaAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">O que pagou?</label><input type="text" value={tituloDespesa} onChange={(e) => setTituloDespesa(e.target.value)} placeholder="Ex: Conta de Luz, Faculdade" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorDespesa} onChange={(e) => setValorDespesa(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500" /></div>
                <div><label className="text-slate-400 text-sm mb-1 block">Tipo de Gasto</label><select value={classificacaoDespesa} onChange={(e) => setClassificacaoDespesa(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500"><option value="essencial">Gasto Essencial</option><option value="estilo_vida">Estilo de Vida (Lazer)</option></select></div>
              </div>
              <div><label className="text-slate-400 text-sm mb-1 block">Categoria da Despesa</label><select value={categoriaDespesa} onChange={(e) => setCategoriaDespesa(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500"><option value="Alimentação">Alimentação (Comida, Mercado)</option><option value="Moradia">Moradia (Aluguel, Luz, Água)</option><option value="Transporte">Transporte (Combustível, Uber)</option><option value="Lazer">Lazer (Restaurantes, Cinema)</option><option value="Saúde">Saúde (Farmácia, Convênio)</option><option value="Educação">Educação (Faculdade, Cursos)</option><option value="Outros">Outros</option></select></div>
              <button onClick={handleSalvarDespesa} className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Salvar Despesa</button>
            </div>
          </div>
        </div>
      )}

      {modalCofreAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-[#d4af37] flex items-center gap-2"><Target size={24}/> Criar Novo Cofre</h2><button onClick={() => setModalCofreAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">Nome do Objetivo</label><input type="text" value={tituloMeta} onChange={(e) => setTituloMeta(e.target.value)} placeholder="Ex: Reserva de Emergência" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Valor Objetivo (R$)</label><input type="number" value={objetivoMeta} onChange={(e) => setObjetivoMeta(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
                <div><label className="text-slate-400 text-sm mb-1 block">Prazo (Meses)</label><input type="number" value={mesesMeta} onChange={(e) => setMesesMeta(e.target.value)} placeholder="Ex: 12" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              </div>
              {parseFloat(objetivoMeta.replace(',','.')) > 0 && parseInt(mesesMeta) > 0 && (<div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-3 text-center mt-1"><p className="text-[#d4af37] text-sm">💡 Dica: Guarde <strong>{(parseFloat(objetivoMeta.replace(',','.')) / parseInt(mesesMeta)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> por mês para atingir a meta.</p></div>)}
              <button onClick={handleSalvarMeta} className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Criar Cofre</button>
            </div>
          </div>
        </div>
      )}

      {modalAporteAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><ArrowRightLeft size={24} className="text-[#d4af37]"/> Guardar Dinheiro</h2><button onClick={() => setModalAporteAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            {(metasReais || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-700/60 rounded-xl bg-[#090b10] mb-2">
                 <Target size={40} className="text-slate-600 mb-4" /><h3 className="text-white font-medium mb-2">Nenhum cofre disponível</h3><p className="text-slate-400 text-sm text-center mb-6">Precisa de criar um cofre antes de guardar dinheiro.</p>
                 <button onClick={() => { setModalAporteAberto(false); setModalCofreAberto(true); }} className="bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 border border-[#d4af37]/30 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors">Criar Primeiro Cofre</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1"><label className="text-slate-400 text-sm block">Escolha o Cofre</label><button onClick={() => { setModalAporteAberto(false); setModalCofreAberto(true); }} className="text-[#d4af37] text-xs font-medium hover:underline">+ Criar novo cofre</button></div>
                  <select value={metaSelecionada} onChange={(e) => setMetaSelecionada(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]"><option value="">Selecione...</option>{(metasReais || []).map(meta => (<option key={meta.id} value={meta.id}>{meta.titulo}</option>))}</select>
                </div>
                <div><label className="text-slate-400 text-sm mb-1 block">Valor a Guardar (R$)</label><input type="number" value={valorAporte} onChange={(e) => setValorAporte(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
                <button onClick={handleSalvarAporte} className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Confirmar Transferência</button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalResgateAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><Download size={24} className="text-slate-400"/> Tirar do Cofre</h2><button onClick={() => setModalResgateAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Escolha o Cofre</label>
                <select value={metaResgateSelecionada} onChange={(e) => setMetaResgateSelecionada(e.target.value)} className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-slate-500"><option value="">Selecione...</option>{(metasReais || []).map(meta => (<option key={meta.id} value={meta.id}>{meta.titulo} (Disponível: R$ {meta.guardado})</option>))}</select>
              </div>
              <div><label className="text-slate-400 text-sm mb-1 block">Valor a Resgatar (R$)</label><input type="number" value={valorResgate} onChange={(e) => setValorResgate(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-slate-500" /></div>
              <button onClick={handleSalvarResgate} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Confirmar Resgate</button>
            </div>
          </div>
        </div>
      )}

      {modalCartaoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><CreditCard size={24} className="text-[#d4af37]"/> Adicionar Cartão</h2><button onClick={() => setModalCartaoAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">Nome do Cartão (Ex: Nubank, Itaú)</label><input type="text" value={nomeCartao} onChange={(e) => setNomeCartao(e.target.value)} placeholder="Nome do Cartão" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <div><label className="text-slate-400 text-sm mb-1 block">Limite Total (R$)</label><input type="number" value={limiteCartao} onChange={(e) => setLimiteCartao(e.target.value)} placeholder="Ex: 5000,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm mb-1 block">Dia de Fechamento</label><input type="number" value={diaFechamento} onChange={(e) => setDiaFechamento(e.target.value)} placeholder="Ex: 25" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
                <div><label className="text-slate-400 text-sm mb-1 block">Dia de Vencimento</label><input type="number" value={diaVencimento} onChange={(e) => setDiaVencimento(e.target.value)} placeholder="Ex: 05" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              </div>
              <button onClick={handleSalvarCartao} className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Salvar Cartão</button>
            </div>
          </div>
        </div>
      )}

      {modalCompraCartaoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><CreditCard size={24} className="text-[#d4af37]"/> Lançar Compra</h2><button onClick={() => setModalCompraCartaoAberto(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-slate-400 text-sm mb-1 block">O que comprou?</label><input type="text" value={descricaoCompraCartao} onChange={(e) => setDescricaoCompraCartao(e.target.value)} placeholder="Ex: Restaurante, Celular novo" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <div><label className="text-slate-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorCompraCartao} onChange={(e) => setValorCompraCartao(e.target.value)} placeholder="0,00" className="w-full bg-[#090b10] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37]" /></div>
              <button onClick={handleLancarCompraCartao} className="w-full bg-gradient-to-r from-[#2a2d35] to-[#8c6b4a] hover:from-[#323640] hover:to-[#a37d57] text-white font-bold py-3.5 rounded-xl mt-4 transition-colors">Confirmar Compra</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}