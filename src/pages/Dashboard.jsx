import { useState, useEffect } from 'react';
import { Home, CreditCard, ArrowRightLeft, Target, Settings, Wallet, Plus, TrendingUp, TrendingDown, Zap, ShoppingBag, Calendar, ChevronDown, X, CheckCircle, AlertCircle, BrainCircuit, Trash2, Download, Eraser, Pencil, User, Mail, Lock, EyeOff, Eye, ArrowRight, ChevronLeft, ChevronRight, Smartphone, ShieldCheck, Search, Filter, TrendingUp as Speed, LogOut, CalendarClock, CheckSquare, QrCode, ClipboardList, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { motion, AnimatePresence } from 'framer-motion';

import { MotionWrapper } from '../components/ui/MotionWrapper';
import HomeView from './dashboard/HomeView';
import ExtratoView from './dashboard/ExtratoView';
import MetasView from './dashboard/MetasView';
import PlanilhaView from './dashboard/PlanilhaView';
import CartoesView from './dashboard/CartoesView';
import ConfiguracoesView from './dashboard/ConfiguracoesView';
import { useFinanceStore } from '../store/useFinanceStore';

export default function Dashboard({ emailLogin, onLogout, mostrarNotificacao }) {

  const {
    idContaReal, setIdContaReal,
    telaAtiva, setTelaAtiva,
    dataSelecionada, setDataSelecionada,
    mesAnterior, proximoMes,
    nomeUsuario, saldoReal, transacoesReais, categoriasReais, metasReais, balancoReal, evolucaoReal, cartoesReais, agendamentosReais, planilhaReal, inteligenciaReal,
    modalReceitaAberto, setModalReceitaAberto,
    modalDespesaAberto, setModalDespesaAberto,
    modalCofreAberto, setModalCofreAberto,
    modalAporteAberto, setModalAporteAberto,
    modalResgateAberto, setModalResgateAberto,
    modalCartaoAberto, setModalCartaoAberto,
    modalCompraCartaoAberto, setModalCompraCartaoAberto,
    modalAgendamentoAberto, setModalAgendamentoAberto,
    modalPlanilhaAberto, setModalPlanilhaAberto,
    modalPerfilAberto, setModalPerfilAberto,
    modalEditSaldoAberto, setModalEditSaldoAberto,
    carregarDadosDaTela
  } = useFinanceStore();

  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });
  
  const [dialogoConfirmacao, setDialogoConfirmacao] = useState({
    aberto: false, titulo: '', mensagem: '', textoAcao: '', corAcao: '', corIcone: '', onConfirm: () => {}
  });
  
  const [editNomeUsuario, setEditNomeUsuario] = useState('');

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

  const [tituloPlanilha, setTituloPlanilha] = useState('');
  const [valorPlanilha, setValorPlanilha] = useState('');
  const [dataPlanilha, setDataPlanilha] = useState('');

  const [categoriaExpandida, setCategoriaExpandida] = useState(null);
  const [cartaoExpandidoExtrato, setCartaoExpandidoExtrato] = useState(null);

  // ==============================================================================
  // FUNCIONALIDADES E INTEGRAÇÕES 
  // ==============================================================================
  
  const nomeMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const mesFormatadoExibicao = `${nomeMeses[dataSelecionada.getMonth()]} de ${dataSelecionada.getFullYear()}`;
  const mesParametroAPI = telaAtiva === 'extrato' ? "todos" : `${dataSelecionada.getFullYear()}-${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}`;

  
  useEffect(() => { if (idContaReal) { carregarDadosDaTela(idContaReal); } }, [dataSelecionada, telaAtiva]); 

  useEffect(() => {
    if (emailLogin) {
      fetch(`https://app-financeiro-10tz.onrender.com/configurar/?email=${encodeURIComponent(emailLogin)}`)
        .then(res => res.json())
        .then(data => { setIdContaReal(data.id_conta); carregarDadosDaTela(data.id_conta); })
        .catch(err => console.error("Erro na configuração", err));
    }
  }, [emailLogin]);

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
        useFinanceStore.setState({ nomeUsuario: editNomeUsuario }); 
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
          const emailAtual = emailLogin;
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
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 font-sans overflow-hidden relative">
      
      

      {dialogoConfirmacao.aberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4"><h2 className={`text-xl font-bold flex items-center gap-2 ${dialogoConfirmacao.corIcone}`}><AlertCircle size={24} /> {dialogoConfirmacao.titulo}</h2></div>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{dialogoConfirmacao.mensagem}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDialogoConfirmacao({...dialogoConfirmacao, aberto: false})} className="px-5 py-2.5 rounded-xl text-zinc-400 font-medium hover:bg-zinc-800 transition-colors border border-zinc-700">Cancelar</button>
              <button onClick={dialogoConfirmacao.onConfirm} className={`px-5 py-2.5 rounded-xl text-zinc-100 font-bold transition-colors shadow-none ${dialogoConfirmacao.corAcao}`}>{dialogoConfirmacao.textoAcao}</button>
            </div>
          </div>
        </div>
      )}

      <aside className="w-20 border-r border-zinc-800 flex flex-col items-center py-8 gap-8 shrink-0 bg-[#0a0a0a]/50 backdrop-blur-sm z-10">
        <div className="bg-zinc-800 p-3 rounded-2xl text-zinc-100 shadow-none"><Wallet size={24} /></div>
        <nav className="flex flex-col gap-6 text-zinc-400 mt-4">
          <button onClick={() => setTelaAtiva('home')} className={`p-3 rounded-2xl transition-colors ${telaAtiva === 'home' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:text-zinc-100'}`} title="Visão Geral"><Home size={24} /></button>
          <button onClick={() => setTelaAtiva('cartoes')} className={`p-3 rounded-2xl transition-colors ${telaAtiva === 'cartoes' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:text-zinc-100'}`} title="Cartões"><CreditCard size={24} /></button>
          <button onClick={() => setTelaAtiva('extrato')} className={`p-3 rounded-2xl transition-colors ${telaAtiva === 'extrato' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:text-zinc-100'}`} title="Extrato Completo"><ArrowRightLeft size={24} /></button>
          <button onClick={() => setTelaAtiva('metas')} className={`p-3 rounded-2xl transition-colors ${telaAtiva === 'metas' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:text-zinc-100'}`} title="Cofres"><Target size={24} /></button>
          <button onClick={() => setTelaAtiva('planilha')} className={`p-3 rounded-2xl transition-colors ${telaAtiva === 'planilha' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:text-zinc-100'}`} title="Planilha Fantasma"><ClipboardList size={24} /></button>
          <button onClick={() => setTelaAtiva('configuracoes')} className={`p-3 rounded-2xl transition-colors mt-auto ${telaAtiva === 'configuracoes' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:text-zinc-100'}`} title="Configurações"><Settings size={24} /></button>
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={telaAtiva}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-full"
          >
            {telaAtiva === 'home' && (
          <HomeView
            dataSelecionada={dataSelecionada}
            saldoReal={saldoReal}
            totalGuardado={totalGuardado}
            balancoReal={balancoReal}
            inteligenciaReal={inteligenciaReal}
            categoriaExpandida={categoriaExpandida}
            agendamentosReais={agendamentosReais}
            evolucaoReal={evolucaoReal}
            categoriasReais={categoriasReais}
            transacoesReais={transacoesReais}
            mesFormatadoExibicao={mesFormatadoExibicao}
            mesAnterior={mesAnterior}
            proximoMes={proximoMes}
            toggleCategoria={toggleCategoria}
            setModalAgendamentoAberto={setModalAgendamentoAberto}
            setModalReceitaAberto={setModalReceitaAberto}
            setModalDespesaAberto={setModalDespesaAberto}
            abrirModalAporte={abrirModalAporte}
            abrirModalEditSaldo={abrirModalEditSaldo}
            abrirModalEditTx={abrirModalEditTx}
            handlePagarAgendamento={handlePagarAgendamento}
            handleExcluirAgendamento={handleExcluirAgendamento}
            handleExcluirTransacao={handleExcluirTransacao}
          />
        )}

        {/* ================================== EXTRATO ================================== */}
        {telaAtiva === 'extrato' && (
          <ExtratoView 
            transacoesReais={transacoesReais}
            abrirModalEditTx={abrirModalEditTx}
            handleExcluirTransacao={handleExcluirTransacao}
          />
        )}

        {/* ================================== METAS ================================== */}
        {telaAtiva === 'metas' && (
          <MetasView
            totalGuardado={totalGuardado}
            totalObjetivoGlobal={totalObjetivoGlobal}
            progressoGlobal={progressoGlobal}
            metasReais={metasReais}
            setModalCofreAberto={setModalCofreAberto}
            abrirModalEditMeta={abrirModalEditMeta}
            abrirModalResgate={abrirModalResgate}
            abrirModalAporte={abrirModalAporte}
          />
        )}

        {/* ================================== PLANILHA FANTASMA ================================== */}
        {telaAtiva === 'planilha' && (
          <PlanilhaView
            planilhaReal={planilhaReal}
            setModalPlanilhaAberto={setModalPlanilhaAberto}
            handleExportarWhatsApp={handleExportarWhatsApp}
            handleAlternarStatusPlanilha={handleAlternarStatusPlanilha}
            handleExcluirPlanilha={handleExcluirPlanilha}
          />
        )}

        {/* ================================== CONFIGURAÇÕES ================================== */}
        {telaAtiva === 'configuracoes' && (
          <ConfiguracoesView
            nomeUsuario={nomeUsuario}
            emailLogin={emailLogin}

            setEditNomeUsuario={setEditNomeUsuario}
            setModalPerfilAberto={setModalPerfilAberto}
            mostrarNotificacao={mostrarNotificacao}
            handleReset2FA={handleReset2FA}
            handleZerarSaldo={handleZerarSaldo}
            onLogout={onLogout}
          />
        )}
        
        {telaAtiva === 'cartoes' && (
          <CartoesView
            cartoesReais={cartoesReais}
            setModalCartaoAberto={setModalCartaoAberto}
            abrirModalCompraCartao={abrirModalCompraCartao}
            handlePagarFatura={handlePagarFatura}
            toggleExtratoCartao={toggleExtratoCartao}
            cartaoExpandidoExtrato={cartaoExpandidoExtrato}
          />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ==============================================================================
          MODAIS E FORMULÁRIOS
          ============================================================================== */}

      {modalPerfilAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><User size={24} className="text-zinc-100"/> Editar Perfil</h2>
              <button onClick={() => setModalPerfilAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-zinc-400 text-sm mb-1 block">Como quer ser chamado?</label>
                <input type="text" value={editNomeUsuario} onChange={(e) => setEditNomeUsuario(e.target.value)} placeholder="Ex: Luan, João, Maria..." className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" />
              </div>
              <button onClick={handleSalvarPerfil} className="w-full  bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {modalPlanilhaAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><ClipboardList className="text-zinc-100"/> Adicionar à Planilha</h2><button onClick={() => setModalPlanilhaAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">Descrição do Item</label><input type="text" value={tituloPlanilha} onChange={(e) => setTituloPlanilha(e.target.value)} placeholder="Ex: Conserto, Presente..." className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorPlanilha} onChange={(e) => setValorPlanilha(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Data de Vencimento</label><input type="date" value={dataPlanilha} onChange={(e) => setDataPlanilha(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500 " /></div>
              </div>
              <button onClick={handleSalvarPlanilha} className="w-full  bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">Adicionar Item</button>
            </div>
          </div>
        </div>
      )}

      {modalAgendamentoAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><CalendarClock size={24}/> Agendar Conta</h2><button onClick={() => setModalAgendamentoAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">O que vai pagar?</label><input type="text" value={tituloAgendamento} onChange={(e) => setTituloAgendamento(e.target.value)} placeholder="Ex: Netflix, Conta de Luz" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorAgendamento} onChange={(e) => setValorAgendamento(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Data de Vencimento</label><input type="date" value={dataAgendamento} onChange={(e) => setDataAgendamento(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500 " /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Categoria</label><select value={categoriaAgendamento} onChange={(e) => setCategoriaAgendamento(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500"><option value="Moradia">Moradia</option><option value="Alimentação">Alimentação</option><option value="Transporte">Transporte</option><option value="Lazer">Lazer</option><option value="Saúde">Saúde</option><option value="Educação">Educação</option><option value="Assinaturas">Assinaturas</option><option value="Outros">Outros</option></select></div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Tipo no Gráfico</label><select value={classificacaoAgendamento} onChange={(e) => setClassificacaoAgendamento(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500"><option value="essencial">Gasto Essencial</option><option value="estilo_vida">Estilo de Vida (Lazer)</option></select></div>
              </div>
              <button onClick={handleSalvarAgendamento} className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">Agendar Conta</button>
            </div>
          </div>
        </div>
      )}
      
      {modalEditSaldoAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><Pencil size={24} className="text-zinc-100"/> Ajustar Saldo Livre</h2><button onClick={() => setModalEditSaldoAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <p className="text-zinc-400 text-sm">Use isto para corrigir pequenas diferenças no saldo sem apagar o histórico.</p>
              <div><label className="text-zinc-400 text-sm mb-1 block">Novo Saldo Atual (R$)</label><input type="number" value={editSaldoValor} onChange={(e) => setEditSaldoValor(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <button onClick={handleSalvarEditSaldo} className="w-full  bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">Salvar Novo Saldo</button>
            </div>
          </div>
        </div>
      )}

      {modalEditTxAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><Pencil size={24} className="text-zinc-100"/> Editar {txEditTipo}</h2><button onClick={() => setModalEditTxAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">Título</label><input type="text" value={txEditTitulo} onChange={(e) => setTxEditTitulo(e.target.value)} placeholder="Título" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={txEditValor} onChange={(e) => setTxEditValor(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
                <div>{txEditTipo === 'Despesa' ? (<><label className="text-zinc-400 text-sm mb-1 block">Classificação</label><select value={txEditCat} onChange={(e) => setTxEditCat(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-rose-500"><option value="essencial">Essencial</option><option value="estilo_vida">Estilo de Vida</option></select></>) : (<><label className="text-zinc-400 text-sm mb-1 block">Categoria</label><select value={txEditCat} onChange={(e) => setTxEditCat(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500"><option value="Salário">Salário</option><option value="Vendas">Vendas</option><option value="Rendimento">Rendimento</option><option value="Outros">Outros</option></select></>)}</div>
              </div>
              <button onClick={handleSalvarEditTx} className={`w-full text-zinc-100 font-bold py-3.5 rounded-2xl mt-4 transition-colors ${txEditTipo === 'Receita' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-rose-500 hover:bg-rose-400'}`}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {modalEditMetaAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><Pencil size={24} className="text-zinc-100"/> Editar Cofre</h2><button onClick={() => setModalEditMetaAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">Nome do Objetivo</label><input type="text" value={metaEditTitulo} onChange={(e) => setMetaEditTitulo(e.target.value)} placeholder="Ex: Reserva de Emergência" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Valor Objetivo (R$)</label><input type="number" value={metaEditObjetivo} onChange={(e) => setMetaEditObjetivo(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Prazo (Meses)</label><input type="number" value={metaEditPrazo} onChange={(e) => setMetaEditPrazo(e.target.value)} placeholder="Ex: 12" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              </div>
              {parseFloat(metaEditObjetivo.toString().replace(',','.')) > 0 && parseInt(metaEditPrazo) > 0 && (<div className="bg-zinc-800 border border-emerald-500/30 rounded-2xl p-3 text-center mt-1"><p className="text-zinc-100 text-sm">💡 Meta: Guarde <strong>{(parseFloat(metaEditObjetivo.toString().replace(',','.')) / parseInt(metaEditPrazo)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> por mês.</p></div>)}
              <div><label className="text-zinc-400 text-sm mb-1 block">Dinheiro Guardado (R$)</label><input type="number" value={metaEditGuardado} onChange={(e) => setMetaEditGuardado(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /><p className="text-xs text-zinc-400 mt-1">Atenção: Alterar este valor não afeta o Saldo Livre. Para resgatar saldo real, use o botão "Resgatar".</p></div>
              <button onClick={handleSalvarEditMeta} className="w-full  bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {modalReceitaAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2"><TrendingUp size={24}/> Nova Receita</h2><button onClick={() => setModalReceitaAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">O que recebeu?</label><input type="text" value={tituloReceita} onChange={(e) => setTituloReceita(e.target.value)} placeholder="Ex: Pagamento de Trabalho" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorReceita} onChange={(e) => setValorReceita(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Categoria</label><select value={categoriaReceita} onChange={(e) => setCategoriaReceita(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500"><option value="Salário">Salário</option><option value="Vendas">Vendas</option><option value="Rendimento">Rendimento</option><option value="Outros">Outros</option></select></div>
              </div>
              <button onClick={handleSalvarReceita} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-100 font-bold py-3.5 rounded-2xl mt-4 transition-colors">Salvar Receita</button>
            </div>
          </div>
        </div>
      )}

      {modalDespesaAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-rose-400 flex items-center gap-2"><TrendingDown size={24}/> Nova Despesa</h2><button onClick={() => setModalDespesaAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">O que pagou?</label><input type="text" value={tituloDespesa} onChange={(e) => setTituloDespesa(e.target.value)} placeholder="Ex: Conta de Luz, Faculdade" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-rose-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorDespesa} onChange={(e) => setValorDespesa(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-rose-500" /></div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Tipo de Gasto</label><select value={classificacaoDespesa} onChange={(e) => setClassificacaoDespesa(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-rose-500"><option value="essencial">Gasto Essencial</option><option value="estilo_vida">Estilo de Vida (Lazer)</option></select></div>
              </div>
              <div><label className="text-zinc-400 text-sm mb-1 block">Categoria da Despesa</label><select value={categoriaDespesa} onChange={(e) => setCategoriaDespesa(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-rose-500"><option value="Alimentação">Alimentação (Comida, Mercado)</option><option value="Moradia">Moradia (Aluguel, Luz, Água)</option><option value="Transporte">Transporte (Combustível, Uber)</option><option value="Lazer">Lazer (Restaurantes, Cinema)</option><option value="Saúde">Saúde (Farmácia, Convênio)</option><option value="Educação">Educação (Faculdade, Cursos)</option><option value="Outros">Outros</option></select></div>
              <button onClick={handleSalvarDespesa} className="w-full bg-rose-500 hover:bg-rose-400 text-zinc-100 font-bold py-3.5 rounded-2xl mt-4 transition-colors">Salvar Despesa</button>
            </div>
          </div>
        </div>
      )}

      {modalCofreAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><Target size={24}/> Criar Novo Cofre</h2><button onClick={() => setModalCofreAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">Nome do Objetivo</label><input type="text" value={tituloMeta} onChange={(e) => setTituloMeta(e.target.value)} placeholder="Ex: Reserva de Emergência" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Valor Objetivo (R$)</label><input type="number" value={objetivoMeta} onChange={(e) => setObjetivoMeta(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Prazo (Meses)</label><input type="number" value={mesesMeta} onChange={(e) => setMesesMeta(e.target.value)} placeholder="Ex: 12" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              </div>
              {parseFloat(objetivoMeta.replace(',','.')) > 0 && parseInt(mesesMeta) > 0 && (<div className="bg-zinc-800 border border-emerald-500/30 rounded-2xl p-3 text-center mt-1"><p className="text-zinc-100 text-sm">💡 Dica: Guarde <strong>{(parseFloat(objetivoMeta.replace(',','.')) / parseInt(mesesMeta)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> por mês para atingir a meta.</p></div>)}
              <button onClick={handleSalvarMeta} className="w-full  bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">Criar Cofre</button>
            </div>
          </div>
        </div>
      )}

      {modalAporteAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><ArrowRightLeft size={24} className="text-zinc-100"/> Guardar Dinheiro</h2><button onClick={() => setModalAporteAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            {(metasReais || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-zinc-700 rounded-2xl bg-[#0a0a0a] mb-2">
                 <Target size={40} className="text-zinc-400 mb-4" /><h3 className="text-zinc-100 font-medium mb-2">Nenhum cofre disponível</h3><p className="text-zinc-400 text-sm text-center mb-6">Precisa de criar um cofre antes de guardar dinheiro.</p>
                 <button onClick={() => { setModalAporteAberto(false); setModalCofreAberto(true); }} className="bg-zinc-800 text-zinc-100 hover:bg-[#d4af37]/20 border border-emerald-500/30 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">Criar Primeiro Cofre</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1"><label className="text-zinc-400 text-sm block">Escolha o Cofre</label><button onClick={() => { setModalAporteAberto(false); setModalCofreAberto(true); }} className="text-zinc-100 text-xs font-medium hover:underline">+ Criar novo cofre</button></div>
                  <select value={metaSelecionada} onChange={(e) => setMetaSelecionada(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500"><option value="">Selecione...</option>{(metasReais || []).map(meta => (<option key={meta.id} value={meta.id}>{meta.titulo}</option>))}</select>
                </div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Valor a Guardar (R$)</label><input type="number" value={valorAporte} onChange={(e) => setValorAporte(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
                <button onClick={handleSalvarAporte} className="w-full  bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">Confirmar Transferência</button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalResgateAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><Download size={24} className="text-zinc-400"/> Tirar do Cofre</h2><button onClick={() => setModalResgateAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-zinc-400 text-sm mb-1 block">Escolha o Cofre</label>
                <select value={metaResgateSelecionada} onChange={(e) => setMetaResgateSelecionada(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-slate-500"><option value="">Selecione...</option>{(metasReais || []).map(meta => (<option key={meta.id} value={meta.id}>{meta.titulo} (Disponível: R$ {meta.guardado})</option>))}</select>
              </div>
              <div><label className="text-zinc-400 text-sm mb-1 block">Valor a Resgatar (R$)</label><input type="number" value={valorResgate} onChange={(e) => setValorResgate(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-slate-500" /></div>
              <button onClick={handleSalvarResgate} className="w-full bg-slate-700 hover:bg-slate-600 text-zinc-100 font-bold py-3.5 rounded-2xl mt-4 transition-colors">Confirmar Resgate</button>
            </div>
          </div>
        </div>
      )}

      {modalCartaoAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><CreditCard size={24} className="text-zinc-100"/> Adicionar Cartão</h2><button onClick={() => setModalCartaoAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">Nome do Cartão (Ex: Nubank, Itaú)</label><input type="text" value={nomeCartao} onChange={(e) => setNomeCartao(e.target.value)} placeholder="Nome do Cartão" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div><label className="text-zinc-400 text-sm mb-1 block">Limite Total (R$)</label><input type="number" value={limiteCartao} onChange={(e) => setLimiteCartao(e.target.value)} placeholder="Ex: 5000,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-zinc-400 text-sm mb-1 block">Dia de Fechamento</label><input type="number" value={diaFechamento} onChange={(e) => setDiaFechamento(e.target.value)} placeholder="Ex: 25" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-zinc-400 text-sm mb-1 block">Dia de Vencimento</label><input type="number" value={diaVencimento} onChange={(e) => setDiaVencimento(e.target.value)} placeholder="Ex: 05" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              </div>
              <button onClick={handleSalvarCartao} className="w-full  bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">Salvar Cartão</button>
            </div>
          </div>
        </div>
      )}

      {modalCompraCartaoAberto && (
        <div className="fixed inset-0 bg-emerald-500/40 backdrop-blur-md backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2"><CreditCard size={24} className="text-zinc-100"/> Lançar Compra</h2><button onClick={() => setModalCompraCartaoAberto(false)} className="text-zinc-400 hover:text-zinc-100"><X size={24} /></button></div>
            <div className="flex flex-col gap-4">
              <div><label className="text-zinc-400 text-sm mb-1 block">O que comprou?</label><input type="text" value={descricaoCompraCartao} onChange={(e) => setDescricaoCompraCartao(e.target.value)} placeholder="Ex: Restaurante, Celular novo" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <div><label className="text-zinc-400 text-sm mb-1 block">Valor (R$)</label><input type="number" value={valorCompraCartao} onChange={(e) => setValorCompraCartao(e.target.value)} placeholder="0,00" className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-emerald-500" /></div>
              <button onClick={handleLancarCompraCartao} className="w-full  bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold font-bold py-3.5 rounded-2xl mt-4 transition-colors">Confirmar Compra</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}