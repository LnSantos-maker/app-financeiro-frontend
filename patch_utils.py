import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    replacements = {
        'bg-[#1a1a1d]': 'bg-[var(--bg-main)]',
        'bg-[#0a0a0a]': 'bg-[var(--bg-main)]',
        'bg-[#1f1f23]': 'bg-[var(--bg-card)]',
        'bg-[#1c1c1f]': 'bg-[var(--bg-card)]',
        'bg-[#24252a]': 'bg-[var(--bg-card)]',
        'bg-zinc-900': 'bg-[var(--bg-card)]',
        'bg-zinc-800': 'bg-[#101e22]',
        
        'border-zinc-800': 'border-[var(--border-card)]',
        'border-[#2c2c31]': 'border-[var(--border-card)]',
        'border-[#303138]': 'border-[var(--border-card)]',
        'border-[#3b3b44]': 'border-[var(--border-card)]',
        'border-zinc-700': 'border-[var(--border-card)]',
        
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
        'shadow-none': 'shadow-premium',
    }

    for old, new in replacements.items():
        content = content.replace(old, new)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

files = [
    r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\dashboard\ConfiguracoesView.jsx',
    r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\dashboard\UtilitariosView.jsx'
]

for f in files:
    try:
        patch_file(f)
        print(f"Patched {f}")
    except Exception as e:
        print(f"Error patching {f}: {e}")
