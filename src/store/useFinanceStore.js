import { create } from 'zustand';

export const useFinanceStore = create((set, get) => ({
  // 1. Contexto Global
  idContaReal: '',
  setIdContaReal: (id) => set({ idContaReal: id }),
  telaAtiva: 'home',
  setTelaAtiva: (tela) => set({ telaAtiva: tela }),
  dataSelecionada: new Date(),
  setDataSelecionada: (data) => set({ dataSelecionada: data }),
  
  mesAnterior: () => set(state => ({ dataSelecionada: new Date(state.dataSelecionada.setMonth(state.dataSelecionada.getMonth() - 1)) })),
  proximoMes: () => set(state => ({ dataSelecionada: new Date(state.dataSelecionada.setMonth(state.dataSelecionada.getMonth() + 1)) })),

  // 2. Dados da API (Estado Compartilhado)
  nomeUsuario: 'Usuário',
  saldoReal: 0,
  transacoesReais: [],
  categoriasReais: [],
  metasReais: [],
  balancoReal: { receitas: 0, despesas: 0, guardado: 0, balanco: 0 },
  evolucaoReal: [],
  cartoesReais: [],
  agendamentosReais: [],
  planilhaReal: [],
  orcamentosReais: [],
  inteligenciaReal: {
    total_receitas: 0,
    essenciais: { valor: 0, porcentagem: 0, limite_ideal: 50, itens: [] },
    estilo_vida: { valor: 0, porcentagem: 0, limite_ideal: 30, itens: [] },
    futuro: { valor: 0, porcentagem: 0, limite_ideal: 20, itens: [] }
  },

  // 3. Modais (Estado Visual Global)
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

  // 4. Ação Principal de Carregamento Assíncrono (Busca de Dados)
  carregarDadosDaTela: async () => {
    const { idContaReal, dataSelecionada, telaAtiva } = get();
    if (!idContaReal) return;
    
    const mesFormatado = `${dataSelecionada.getFullYear()}-${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}`;
    const mesParametroAPI = telaAtiva === 'extrato' ? "todos" : mesFormatado;

    try {
      // Faz fetch em paralelo para otimizar velocidade
      const [dPerfil, dSaldo, dTx, dCat, dMetas, dBal, dEvo, dIntel, dCartoes, dAgenda, dPlanilha, dOrcamentos] = await Promise.all([
        fetch(`http://localhost:8000/perfil/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/saldo/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/listar_transacoes/${idContaReal}?mes=${mesParametroAPI}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/graficos/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/listar_metas/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/balanco/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/evolucao/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/inteligencia/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/listar_cartoes/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/listar_agendamentos/${idContaReal}?mes=${mesFormatado}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/listar_planilha/${idContaReal}`).then(r => r.json()).catch(() => ({})),
        fetch(`http://localhost:8000/orcamentos/${idContaReal}`).then(r => r.json()).catch(() => ({}))
      ]);

      set({
        nomeUsuario: dPerfil.nome_usuario || 'Usuário',
        saldoReal: dSaldo.saldo_atual || 0,
        transacoesReais: dTx.transacoes || [],
        categoriasReais: dCat.categorias || [],
        metasReais: dMetas.metas || [],
        balancoReal: dBal || { receitas: 0, despesas: 0, guardado: 0, balanco: 0 },
        evolucaoReal: dEvo.evolucao || [],
        inteligenciaReal: dIntel || get().inteligenciaReal,
        cartoesReais: dCartoes.cartoes || [],
        agendamentosReais: dAgenda.agendamentos || [],
        planilhaReal: dPlanilha.planilha || [],
        orcamentosReais: dOrcamentos.orcamentos || []
      });

    } catch (e) {
      console.error("Erro ao carregar dados da API pelo Zustand:", e);
    }
  }
}));
