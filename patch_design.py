import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Substituições de Design System
    replacements = {
        'bg-[#1a1a1d]': 'bg-[var(--bg-main)]',
        'bg-[#0a0a0a]': 'bg-[var(--bg-main)]',
        'bg-[#1f1f23]': 'bg-[var(--bg-card)]',
        'bg-[#1c1c1f]': 'bg-[var(--bg-card)]',
        'bg-[#24252a]': 'bg-[var(--bg-card)]',
        
        'border-[#2c2c31]': 'border-[var(--border-card)]',
        'border-[#303138]': 'border-[var(--border-card)]',
        'border-[#3b3b44]': 'border-[var(--border-card)]',
        
        'text-zinc-100': 'text-[var(--text-main)]',
        'text-zinc-300': 'text-[var(--text-main)]',
        'text-zinc-400': 'text-[var(--text-sec)]',
        'text-zinc-500': 'text-[var(--text-sec)]',
        'text-zinc-600': 'text-[var(--text-sec)]',
        
        'bg-emerald-500/10': 'bg-[var(--accent)]/10',
        'text-emerald-400': 'text-[var(--accent)]',
        'text-emerald-500': 'text-[var(--accent)]',
        'bg-emerald-500': 'bg-[var(--accent)]',
        
        'rounded-[8px]': 'rounded-[12px]',
        'rounded-xl': 'rounded-[12px]',
        'rounded-2xl': 'rounded-[12px]',
        'shadow-lg': 'shadow-premium',
        'shadow-xl': 'shadow-premium',
        
        # Logo genérico -> SVG Nexus
        '<div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/30">\\s*<span className="text-emerald-400 font-bold text-lg">PF</span>\\s*</div>': 
        '<div className="w-10 h-10 bg-[var(--bg-card)] rounded-[12px] flex items-center justify-center shrink-0 border border-[var(--border-card)] shadow-premium"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450" width="24" height="28"><g stroke="#2aa198" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="200,60 320,130 320,268 200,338 80,268 80,130" strokeWidth="4" /><circle cx="200" cy="199" r="14" fill="#2aa198" /><path d="M 200,180 L 200,80" strokeWidth="12" /><path d="M 186,207 L 100,257" strokeWidth="12" /><path d="M 214,207 L 300,257" strokeWidth="12" /></g></svg></div>'
    }

    new_content = content
    for old, new in replacements.items():
        if old.startswith('<div'):
            new_content = re.sub(old, new, new_content)
        else:
            new_content = new_content.replace(old, new)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

files = [
    r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\Login.jsx',
    r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\Dashboard.jsx',
    r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\dashboard\HomeView.jsx'
]

for f in files:
    try:
        patch_file(f)
        print(f"Patched {f}")
    except Exception as e:
        print(f"Error patching {f}: {e}")
