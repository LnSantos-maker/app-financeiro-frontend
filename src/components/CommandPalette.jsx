import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, TrendingDown, TrendingUp, CalendarClock, CreditCard, Home, Target, Settings, Zap } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPalette() {
  const {
    modalCommandPaletteAberto,
    setModalCommandPaletteAberto,
    setTelaAtiva,
    setModalReceitaAberto,
    setModalDespesaAberto,
    setModalAgendamentoAberto,
    setModalCartaoAberto
  } = useFinanceStore();

  const [busca, setBusca] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (modalCommandPaletteAberto && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [modalCommandPaletteAberto]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setModalCommandPaletteAberto(!modalCommandPaletteAberto);
      }
      if (e.key === 'Escape' && modalCommandPaletteAberto) {
        setModalCommandPaletteAberto(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalCommandPaletteAberto, setModalCommandPaletteAberto]);

  if (!modalCommandPaletteAberto) return null;

  const acoes = [
    { id: 'home', icone: Home, titulo: 'Ir para Visão Geral', categoria: 'Navegação', acao: () => setTelaAtiva('home') },
    { id: 'despesa', icone: TrendingDown, titulo: 'Registrar Nova Despesa', categoria: 'Ações Rápidas', acao: () => setModalDespesaAberto(true) },
    { id: 'receita', icone: TrendingUp, titulo: 'Registrar Nova Receita', categoria: 'Ações Rápidas', acao: () => setModalReceitaAberto(true) },
    { id: 'extrato', icone: ArrowRight, titulo: 'Ver Extrato Completo', categoria: 'Navegação', acao: () => setTelaAtiva('extrato') },
    { id: 'cartoes', icone: CreditCard, titulo: 'Gerir Cartões', categoria: 'Navegação', acao: () => setTelaAtiva('cartoes') },
    { id: 'agendamento', icone: CalendarClock, titulo: 'Novo Agendamento', categoria: 'Ações Rápidas', acao: () => setModalAgendamentoAberto(true) },
    { id: 'metas', icone: Target, titulo: 'Visualizar Cofres e Metas', categoria: 'Navegação', acao: () => setTelaAtiva('metas') },
    { id: 'config', icone: Settings, titulo: 'Configurações do Sistema', categoria: 'Sistema', acao: () => setTelaAtiva('configuracoes') },
  ];

  const filtradas = acoes.filter(a => a.titulo.toLowerCase().includes(busca.toLowerCase()) || a.categoria.toLowerCase().includes(busca.toLowerCase()));

  const executarAcao = (acaoItem) => {
    acaoItem.acao();
    setModalCommandPaletteAberto(false);
    setBusca('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Fundo de desfoque */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setModalCommandPaletteAberto(false)}
        className="absolute inset-0 bg-[#0f1115]/80 backdrop-blur-md"
      />
      
      {/* Janela Principal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-[#181a20]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="flex items-center px-4 py-4 border-b border-white/5">
          <Search size={22} className="text-teal-500 mr-3" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="O que deseja fazer? (Ex: 'Despesa', 'Cartões')"
            className="flex-1 bg-transparent text-white text-lg outline-none placeholder-slate-500"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-400 font-mono">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtradas.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              Nenhuma ação encontrada para "{busca}"
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {['Ações Rápidas', 'Navegação', 'Sistema'].map(categoria => {
                const itensCategoria = filtradas.filter(a => a.categoria === categoria);
                if (itensCategoria.length === 0) return null;
                
                return (
                  <div key={categoria} className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{categoria}</div>
                    {itensCategoria.map((item, index) => (
                      <button 
                        key={item.id}
                        onClick={() => executarAcao(item)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-teal-500/10 hover:text-teal-400 transition-colors text-left text-slate-300 group"
                      >
                        <item.icone size={18} className="text-slate-400 group-hover:text-teal-400 transition-colors" />
                        <span className="font-medium flex-1">{item.titulo}</span>
                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-teal-500" />
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
