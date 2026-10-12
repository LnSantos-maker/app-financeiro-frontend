import { create } from 'zustand';

export const useFinanceStore = create((set, get) => ({
  // 1. Contexto Global
  idContaReal: '',
  setIdContaReal: (id) => set({ idContaReal: id }),
  telaAtiva: 'home',
  setTelaAtiva: (tela) => set({ telaAtiva: tela }),
  dataSelecionada: new Date(),
  setDataSelecionada: (data) => set({ dataSelecionada: data }),
  
  // Navegação de mês segura (evita overflow em dias 29/30/31 e mutação direta)
  mesAnterior: () => set(state => {
    const d = new Date(state.dataSelecionada);
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    return { dataSelecionada: d };
  }),
  proximoMes: () => set(state => {
    const d = new Date(state.dataSelecionada);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    return { dataSelecionada: d };
  }),

  // 2. Dados da API (Estado Compartilhado)
  nomeUsuario: 'Usuário',
  avatarUsuario: 'avatar-1',
  saldoReal: 0,
  transacoesReais: [],
  categoriasReais: [],
  metasReais: [],
  balancoReal: { receitas: 0, despesas: 0, guardado: 0, balanco: 0 },
  evolucaoReal: [],
  cartoesReais: [],
  beneficiosReais: [],
  agendamentosReais: [],
  planilhaReal: [],
  orcamentosReais: [],
  inteligenciaReal: {
    total_receitas: 0,
    essenciais: { valor: 0, porcentagem: 0, limite_ideal: 50, itens: [] },
    estilo_vida: { valor: 0, porcentagem: 0, limite_ideal: 30, itens: [] },
    futuro: { valor: 0, porcentagem: 0, limite_ideal: 20, itens: [] }
  },

  // 3. Atualizações Otimistas (Instantâneas 0ms)
  adicionarAgendamentoOtimista: (novoAgendamento) => set(state => ({
    agendamentosReais: [...(state.agendamentosReais || []), novoAgendamento].sort((a, b) => 
      (a.data_vencimento || '').localeCompare(b.data_vencimento || '')
    )
  })),

  removerAgendamentoOtimista: (id) => set(state => ({
    agendamentosReais: (state.agendamentosReais || []).filter(a => a.id !== id)
  })),

  pagarAgendamentoOtimista: (idAgendamento) => set(state => {
    const agenda = (state.agendamentosReais || []).find(a => a.id === idAgendamento);
    const agendamentosRestantes = (state.agendamentosReais || []).filter(a => a.id !== idAgendamento);
    if (!agenda) return { agendamentosReais: agendamentosRestantes };

    const valorNum = parseFloat(agenda.valor || 0);
    const hojeStr = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');

    const novaTx = {
      id: `tx-otimista-${Date.now()}`,
      tipo: 'Despesa',
      valor: valorNum,
      categoria: `${agenda.categoria || 'Geral'}: ${agenda.descricao}`,
      data: hojeStr,
      classificacao: agenda.classificacao || 'essencial'
    };

    const novoSaldo = Math.max(0, (state.saldoReal || 0) - valorNum);
    const novoBalanco = {
      ...state.balancoReal,
      despesas: (state.balancoReal?.despesas || 0) + valorNum,
      balanco: (state.balancoReal?.balanco || 0) - valorNum
    };

    return {
      agendamentosReais: agendamentosRestantes,
      saldoReal: novoSaldo,
      transacoesReais: [novaTx, ...(state.transacoesReais || [])],
      balancoReal: novoBalanco
    };
  }),

  adicionarTransacaoOtimista: (novaTx) => set(state => {
    const valorNum = parseFloat(novaTx.valor || 0);
    const isReceita = novaTx.tipo === 'Receita';
    const novoSaldo = isReceita ? (state.saldoReal + valorNum) : (state.saldoReal - valorNum);
    
    return {
      transacoesReais: [novaTx, ...(state.transacoesReais || [])],
      saldoReal: novoSaldo,
      balancoReal: {
        ...state.balancoReal,
        receitas: isReceita ? ((state.balancoReal?.receitas || 0) + valorNum) : (state.balancoReal?.receitas || 0),
        despesas: !isReceita ? ((state.balancoReal?.despesas || 0) + valorNum) : (state.balancoReal?.despesas || 0),
        balanco: isReceita ? ((state.balancoReal?.balanco || 0) + valorNum) : ((state.balancoReal?.balanco || 0) - valorNum)
      }
    };
  }),

  removerTransacaoOtimista: (idTx) => set(state => ({
    transacoesReais: (state.transacoesReais || []).filter(t => t.id !== idTx)
  })),

  // 4. Modais (Estado Visual Global)
  modalReceitaAberto: false, setModalReceitaAberto: (val) => set({ modalReceitaAberto: val }),
  modalDespesaAberto: false, setModalDespesaAberto: (val) => set({ modalDespesaAberto: val }),
  modalCofreAberto: false, setModalCofreAberto: (val) => set({ modalCofreAberto: val }),
  modalAporteAberto: false, setModalAporteAberto: (val) => set({ modalAporteAberto: val }),
  modalResgateAberto: false, setModalResgateAberto: (val) => set({ modalResgateAberto: val }),
  modalCartaoAberto: false, setModalCartaoAberto: (val) => set({ modalCartaoAberto: val }),
  modalCompraCartaoAberto: false, setModalCompraCartaoAberto: (val) => set({ modalCompraCartaoAberto: val }),
  modalAgendamentoAberto: false, setModalAgendamentoAberto: (val) => set({ modalAgendamentoAberto: val }),
  modalPlanilhaAberto: false, setModalPlanilhaAberto: (val) => set({ modalPlanilhaAberto: val }),
  modalPerfilAberto: false, setModalPerfilAberto: (val) => set({ modalPerfilAberto: val }),
  modalEditSaldoAberto: false, setModalEditSaldoAberto: (val) => set({ modalEditSaldoAberto: val }),
  modalOrcamentoAberto: false, setModalOrcamentoAberto: (val) => set({ modalOrcamentoAberto: val }),
  modalCommandPaletteAberto: false, setModalCommandPaletteAberto: (val) => set({ modalCommandPaletteAberto: val }),

  // 5. Recarregamento direcionado ultrarrápido (apenas agendamentos)
  recarregarAgendamentos: async (idConta) => {
    const id = idConta || get().idContaReal;
    if (!id) return;
    const { dataSelecionada } = get();
    const mesFormatado = `${dataSelecionada.getFullYear()}-${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}`;
    try {
      const res = await fetch(`https://app-financeiro-10tz.onrender.com/listar_agendamentos/${id}?mes=${mesFormatado}`);
      const data = await res.json();
      if (data && data.agendamentos) {
        set({ agendamentosReais: data.agendamentos });
      }
    } catch (e) {
      console.warn("Recarregamento silencioso de agendamentos falhou:", e);
    }
  },

  // 6. Ação Principal de Carregamento Assíncrono Completo
  carregarDadosDaTela: async () => {
    const { idContaReal, dataSelecionada, telaAtiva } = get();
    if (!idContaReal) return;
    
    const mesFormatado = `${dataSelecionada.getFullYear()}-${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}`;
    const mesParametroAPI = telaAtiva === 'extrato' ? "todos" : mesFormatado;

    try {
      const [dPerfil, dSaldo, dTx, dCat, dMetas, dBal, dEvo, dIntel, dCartoes, dAgenda, dPlanilha, dOrcamentos, dBeneficios] = await Promise.all([
        fetch(`https://app-financeiro-10tz.onrender.com/perfil/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/saldo/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/listar_transacoes/${idContaReal}?mes=${mesParametroAPI}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/graficos/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/listar_metas/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/balanco/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/evolucao/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/inteligencia/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/listar_cartoes/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/listar_agendamentos/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/listar_planilha/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/orcamentos/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`https://app-financeiro-10tz.onrender.com/listar_beneficios/${idContaReal}`).then(r => r.json()).catch(() => ({}))
      ]);

      set({
        nomeUsuario: dPerfil.nome_usuario || 'Usuário',
        avatarUsuario: dPerfil.avatar_usuario || 'avatar-1',
        saldoReal: dSaldo.saldo_atual || 0,
        transacoesReais: dTx.transacoes || [],
        categoriasReais: dCat.categorias || [],
        metasReais: dMetas.metas || [],
        balancoReal: dBal || { receitas: 0, despesas: 0, guardado: 0, balanco: 0 },
        evolucaoReal: dEvo.evolucao || [],
        inteligenciaReal: dIntel || get().inteligenciaReal,
        cartoesReais: dCartoes.cartoes || [],
        beneficiosReais: dBeneficios.beneficios || [],
        agendamentosReais: dAgenda.agendamentos || [],
        planilhaReal: dPlanilha.planilha || [],
        orcamentosReais: dOrcamentos.orcamentos || []
      });

    } catch (e) {
      console.error("Erro ao carregar dados da API pelo Zustand:", e);
    }
  }
}));
