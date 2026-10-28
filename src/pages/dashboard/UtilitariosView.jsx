import { useState, useEffect } from 'react';
import { Calculator, StickyNote, Trash2 } from 'lucide-react';

export default function UtilitariosView() {
  const [nota, setNota] = useState(() => localStorage.getItem('appFinanceiroNota') || '');
  const [calcDisplay, setCalcDisplay] = useState('0');

  useEffect(() => {
    localStorage.setItem('appFinanceiroNota', nota);
  }, [nota]);

  const handleCalc = (val) => {
    if (val === 'C') { setCalcDisplay('0'); return; }
    if (val === '=') {
      try {
        setCalcDisplay(eval(calcDisplay).toString());
      } catch {
        setCalcDisplay('Erro');
      }
      return;
    }
    if (calcDisplay === '0' || calcDisplay === 'Erro') {
      setCalcDisplay(val);
    } else {
      setCalcDisplay(prev => prev + val);
    }
  };

  const botoesCalc = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    'C', '0', '=', '+'
  ];

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Utilitários</h1>
        <p className="text-[var(--text-sec)]">Suas ferramentas de produtividade diária</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* Bloco de Notas */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-6 flex flex-col shadow-premium">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-card)]">
            <div className="bg-[var(--accent)]/10 text-[var(--accent)] p-2 rounded-[12px]"><StickyNote size={20} /></div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">Bloco de Notas</h2>
          </div>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Anotações rápidas, lembretes..."
            className="flex-1 w-full bg-[var(--bg-main)] border border-[var(--border-card)] rounded-[12px] p-4 text-[var(--text-main)] focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
          <div className="mt-4 flex justify-between items-center text-sm text-[var(--text-sec)]">
            <span>Salvo automaticamente</span>
            <button onClick={() => setNota('')} className="text-[var(--text-sec)] hover:text-rose-500 transition-colors flex items-center gap-1"><Trash2 size={16} /> Limpar</button>
          </div>
        </div>

        {/* Calculadora */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[12px] p-6 flex flex-col shadow-premium">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-card)]">
            <div className="bg-[var(--accent)]/10 text-[var(--accent)] p-2 rounded-[12px]"><Calculator size={20} /></div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">Calculadora Rápida</h2>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-card)] rounded-[12px] p-6 mb-6">
            <div className="text-right text-3xl font-mono text-[var(--text-main)] overflow-x-auto overflow-y-hidden whitespace-nowrap">{calcDisplay}</div>
          </div>

          <div className="grid grid-cols-4 gap-3 flex-1">
            {botoesCalc.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleCalc(btn)}
                className={`text-xl font-bold rounded-[12px] transition-colors ${
                  btn === '=' ? 'bg-[var(--accent)] text-emerald-950 hover:bg-emerald-400' :
                  btn === 'C' ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' :
                  ['/','*','-','+'].includes(btn) ? 'bg-[#26311f] text-[var(--accent)] hover:bg-zinc-700' :
                  'bg-[#26311f]/50 text-[var(--text-main)] hover:bg-zinc-700'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
