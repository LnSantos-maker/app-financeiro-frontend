import re

def patch_login():
    path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\Login.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Backgrounds and containers
    content = content.replace('bg-[#0f171a]', 'bg-[var(--bg-main)]')
    content = content.replace('bg-[#162a30]', 'bg-[var(--bg-card)]')
    content = content.replace('border-[rgba(42,161,152,0.15)]', 'border-white/5')
    content = content.replace('shadow-[0_8px_32px_rgba(0,0,0,0.4)]', 'shadow-premium')
    
    # SVG colors (replace #2aa198 with teal-500 / var(--accent))
    content = content.replace('stroke="#2aa198"', 'stroke="var(--accent)"')
    content = content.replace('fill="#2aa198"', 'fill="var(--accent)"')
    
    # Form title
    content = content.replace('text-[#f8f9fa]', 'text-[var(--text-main)]')
    content = content.replace('text-[#94a3b8]', 'text-[var(--text-sec)]')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def patch_sidebar():
    path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\Dashboard.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Locate Sidebar section: <aside className="w-64 bg-[#1f1f23]
    content = re.sub(r'bg-\[var\(--bg-main\)\].*?border-zinc-800', 'bg-[var(--bg-card)] border-white/5', content)
    
    # Nav links (active and inactive)
    # The active state was usually bg-[var(--accent)]/10 text-[var(--accent)]
    content = content.replace('text-[var(--text-sec)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]', 'text-[var(--text-sec)] hover:bg-white/5 hover:text-[var(--text-main)] transition-all duration-300 hover:scale-[1.02]')
    content = content.replace('bg-[var(--accent)]/10 text-[var(--accent)]', 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

patch_login()
patch_sidebar()
print("Patched Login and Sidebar successfully!")
