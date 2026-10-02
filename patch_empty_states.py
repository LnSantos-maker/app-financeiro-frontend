import re

def patch_cartoes():
    path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\dashboard\CartoesView.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    empty_old = r'<div className="bg-zinc-800 p-6 rounded-2xl text-\[var\(--text-main\)\] mb-6 border border-zinc-700 shadow-\[0_0_30px_rgba\(212,175,55,0.15\)\]">\s*<CreditCard size=\{48\} />\s*</div>'
    empty_new = '''<div className="relative mb-8 flex justify-center items-center">
            <div className="absolute inset-0 bg-[var(--accent)]/10 blur-[60px] rounded-full"></div>
            <img src="/img/cartao_3d.jpg" alt="Cartão" className="relative z-10 w-[240px] h-[240px] object-cover rounded-full border border-[var(--accent)]/20 shadow-[0_0_40px_rgba(42,161,152,0.3)]" style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }} />
          </div>'''
    content = re.sub(empty_old, empty_new, content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def patch_extrato():
    path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\dashboard\ExtratoView.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    empty_old = r'<Search size=\{48\} className="mb-4 text-zinc-300 opacity-50" />'
    empty_new = '''<div className="relative mb-6 flex justify-center items-center">
                <div className="absolute inset-0 bg-[var(--accent)]/10 blur-[60px] rounded-full"></div>
                <img src="/img/extrato_3d.jpg" alt="Extrato" className="relative z-10 w-[200px] h-[200px] object-cover rounded-full border border-[var(--accent)]/20 shadow-[0_0_40px_rgba(42,161,152,0.3)]" style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }} />
              </div>'''
    content = re.sub(empty_old, empty_new, content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def patch_metas():
    path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\dashboard\MetasView.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    empty_old = r'<div className="bg-zinc-800 p-6 rounded-2xl text-\[var\(--text-main\)\] mb-6 border border-zinc-700 shadow-\[0_0_30px_rgba\(212,175,55,0.15\)\]">\s*<Target size=\{48\} />\s*</div>'
    empty_new = '''<div className="relative mb-8 flex justify-center items-center">
            <div className="absolute inset-0 bg-[var(--accent)]/10 blur-[60px] rounded-full"></div>
            <img src="/img/metas_3d.jpg" alt="Metas" className="relative z-10 w-[240px] h-[240px] object-cover rounded-full border border-[var(--accent)]/20 shadow-[0_0_40px_rgba(42,161,152,0.3)]" style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }} />
          </div>'''
    content = re.sub(empty_old, empty_new, content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def patch_planilha():
    path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\dashboard\PlanilhaView.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    empty_old = r'<div className="bg-zinc-800 p-6 rounded-2xl text-\[var\(--text-main\)\] mb-6 border border-zinc-700 shadow-\[0_0_30px_rgba\(212,175,55,0.15\)\]">\s*<CheckSquare size=\{48\} />\s*</div>'
    empty_new = '''<div className="relative mb-8 flex justify-center items-center">
            <div className="absolute inset-0 bg-[var(--accent)]/10 blur-[60px] rounded-full"></div>
            <img src="/img/planilha_3d.jpg" alt="Planilha" className="relative z-10 w-[240px] h-[240px] object-cover rounded-full border border-[var(--accent)]/20 shadow-[0_0_40px_rgba(42,161,152,0.3)]" style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }} />
          </div>'''
    content = re.sub(empty_old, empty_new, content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

try:
    patch_cartoes()
    patch_extrato()
    patch_metas()
    patch_planilha()
    print("Patched empty states!")
except Exception as e:
    print(f"Error: {e}")
