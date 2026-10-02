import re

def revamp_home():
    path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\dashboard\HomeView.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Refactor Header Buttons
    content = content.replace('bg-[#292a2f] text-zinc-200 hover:bg-[#34353a]', 'bg-[#181a20] text-slate-300 hover:bg-white/5 border border-white/5')
    content = content.replace('bg-[#8ebc9e] text-emerald-950 hover:bg-[#7fae8f]', 'bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20')
    content = content.replace('bg-[#c27676] text-[#3b1c1c] hover:bg-[#b06767]', 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20')
    content = content.replace('bg-[var(--accent)] hover:bg-emerald-300 text-[var(--text-main)]', 'bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-[0_4px_20px_rgba(13,148,136,0.3)] hover:scale-[1.02]')

    # Topbar Date Selector
    content = content.replace('bg-[#232429] border border-[var(--border-card)]', 'backdrop-blur-md bg-[#181a20]/80 border border-white/5')

    # Refactor Overview Cards (Saldo Livre, Total Guardado, Balanço)
    # The current regex looks for: bg-gradient-to-br from-[#1b4349] to-[#122b2f] border border-[#275960]
    old_card_style = 'bg-gradient-to-br from-[#1b4349] to-[#122b2f] border border-[#275960]'
    new_card_style = 'bg-gradient-to-br from-[#181a20] to-[#0f1115] border border-white/5 shadow-premium shadow-black/40 backdrop-blur-xl'
    content = content.replace(old_card_style, new_card_style)

    # Skeleton & Loading logic for cards
    # Replace the `<p className="text-4xl font-bold` with skeleton checks
    content = content.replace(
        '<p className="text-4xl font-bold text-white mb-2 relative z-10">{(saldoReal || 0).toLocaleString(\'pt-BR\', { style: \'currency\', currency: \'BRL\' })}</p>',
        '{saldoReal === undefined || saldoReal === null ? <div className="h-10 w-40 bg-slate-800 rounded animate-pulse mb-2 relative z-10"></div> : <p className="text-4xl font-bold text-white mb-2 relative z-10">{(saldoReal || 0).toLocaleString(\'pt-BR\', { style: \'currency\', currency: \'BRL\' })}</p>}'
    )
    
    content = content.replace(
        '<p className="text-4xl font-bold text-white mb-2">{(totalGuardado || 0).toLocaleString(\'pt-BR\', { style: \'currency\', currency: \'BRL\' })}</p>',
        '{totalGuardado === undefined || totalGuardado === null ? <div className="h-10 w-40 bg-slate-800 rounded animate-pulse mb-2"></div> : <p className="text-4xl font-bold text-white mb-2">{(totalGuardado || 0).toLocaleString(\'pt-BR\', { style: \'currency\', currency: \'BRL\' })}</p>}'
    )

    content = content.replace(
        '<p className={`text-4xl font-bold mb-6 ${(balancoReal?.balanco || 0) >= 0 ? \'text-white\' : \'text-rose-300\'}`}>\n            {(balancoReal?.balanco || 0).toLocaleString(\'pt-BR\', { style: \'currency\', currency: \'BRL\' })}\n          </p>',
        '{!balancoReal ? <div className="h-10 w-40 bg-slate-800 rounded animate-pulse mb-6"></div> : <p className={`text-4xl font-bold mb-6 ${(balancoReal?.balanco || 0) >= 0 ? \'text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]\' : \'text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]\'}`}>{(balancoReal.balanco || 0).toLocaleString(\'pt-BR\', { style: \'currency\', currency: \'BRL\' })}</p>}'
    )

    # 50/30/20 Refactor
    content = content.replace(
        'bg-[var(--bg-main)] border border-zinc-800 rounded-[12px] p-5 cursor-pointer hover:bg-black/40',
        'bg-[#0a0c10] border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-[#0f1115] shadow-inner transition-all'
    )

    # Change Progress Bars to be thicker
    content = content.replace('h-2 w-full', 'h-3 w-full shadow-inner')
    content = content.replace('h-full transition-all duration-1000', 'h-full transition-all duration-1000 rounded-full shadow-[0_0_10px_currentColor]')
    
    # Icons Glow and Line Charts in Cards
    # In Saldo Card, I'll inject an SVG line chart
    saldo_card_chart = '''<svg className="absolute bottom-0 left-0 w-full h-24 opacity-20 pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d="M0,80 C100,20 200,100 300,40 C350,10 380,60 400,30 L400,100 L0,100 Z" fill="url(#gradientTeal)"/>
            <path d="M0,80 C100,20 200,100 300,40 C350,10 380,60 400,30" stroke="#2dd4bf" strokeWidth="3" fill="none"/>
            <defs>
              <linearGradient id="gradientTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>'''
    
    content = content.replace(
        '<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-400/10 blur-3xl rounded-full pointer-events-none"></div>',
        '<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 blur-3xl rounded-full pointer-events-none"></div>\n          ' + saldo_card_chart
    )

    # Inner boxes in Balanço card
    content = content.replace('bg-[#153439] rounded-[12px] p-3 border border-[#235359]', 'bg-[#0a0c10] rounded-xl p-3 border border-white/5 shadow-inner')
    content = content.replace('text-[#8ebc9e]', 'text-teal-400')
    content = content.replace('text-[#c27676]', 'text-rose-400')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

revamp_home()
print("HomeView updated successfully!")
