import React, { useState, useEffect } from 'react';
import { Calculator, StickyNote, Save, Trash2 } from 'lucide-react';

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
      } catch (e) {
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
        <h1 className="text-2xl font-bold text-zinc-100">Utilitários</h1>
        <p className="text-zinc-400">Suas ferramentas de produtividade diária.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* Bloco de Notas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col shadow-none">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl"><StickyNote size={20} /></div>
            <h2 className="text-xl font-bold text-zinc-100">Bloco de Notas</h2>
          </div>
          <textarea 
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Anotações rápidas, lembretes..."
            className="flex-1 w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
          <div className="mt-4 flex justify-between items-center text-sm text-zinc-500">
            <span>Salvo automaticamente</span>
            <button onClick={() => setNota('')} className="text-zinc-400 hover:text-rose-500 transition-colors flex items-center gap-1"><Trash2 size={16} /> Limpar</button>
          </div>
        </div>

        {/* Calculadora */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col shadow-none">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl"><Calculator size={20} /></div>
            <h2 className="text-xl font-bold text-zinc-100">Calculadora Rápida</h2>
          </div>
          
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="text-right text-3xl font-mono text-zinc-100 overflow-x-auto overflow-y-hidden whitespace-nowrap">{calcDisplay}</div>
          </div>

          <div className="grid grid-cols-4 gap-3 flex-1">
            {botoesCalc.map((btn, idx) => (
              <button 
                key={idx}
                onClick={() => handleCalc(btn)}
                className={`text-xl font-bold rounded-xl transition-colors ${
                  btn === '=' ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400' :
                  btn === 'C' ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' :
                  ['/','*','-','+'].includes(btn) ? 'bg-zinc-800 text-emerald-400 hover:bg-zinc-700' :
                  'bg-zinc-800/50 text-zinc-100 hover:bg-zinc-700'
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
