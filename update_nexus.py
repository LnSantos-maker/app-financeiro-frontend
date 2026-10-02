import re

def update_nexus():
    # 1. Update Dashboard.jsx
    dash_path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\Dashboard.jsx'
    with open(dash_path, 'r', encoding='utf-8') as f:
        dash_content = f.read()

    # Update Avatar
    old_avatar = '''<div className="w-10 h-10 rounded-full bg-[#2a2b30] flex items-center justify-center border border-[var(--border-card)] overflow-hidden shadow-md">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="User" className="w-8 h-8 object-cover mt-1" />
        </div>'''
    new_avatar = '''<div className="w-12 h-12 rounded-[12px] bg-[#0a0c10] flex items-center justify-center border border-teal-500/30 overflow-hidden shadow-[0_0_15px_rgba(45,212,191,0.2)]">
          <img src="/img/nexus_logo.jpg" alt="NEXUS Logo" className="w-full h-full object-cover" />
        </div>'''
    dash_content = dash_content.replace(old_avatar, new_avatar)

    # Update Finanza Title
    dash_content = dash_content.replace('<h1 className="text-2xl font-bold tracking-tight text-[#e3e4e8]">Finanza</h1>', '<h1 className="text-2xl font-bold tracking-[0.2em] text-[#e3e4e8]">NEXUS</h1>')
    dash_content = dash_content.replace('stroke="#d4af37"', 'stroke="#2dd4bf"')

    with open(dash_path, 'w', encoding='utf-8') as f:
        f.write(dash_content)

    # 2. Update Login.jsx
    login_path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\Login.jsx'
    with open(login_path, 'r', encoding='utf-8') as f:
        login_content = f.read()

    login_content = login_content.replace('Private<br/><span className="font-bold">Finance.</span>', '<span className="font-bold tracking-[0.2em]">NEXUS</span>')
    login_content = login_content.replace('Private <span className="font-bold">Finance</span>', '<span className="font-bold tracking-[0.2em]">NEXUS</span>')
    login_content = login_content.replace('powered by Finanza ecosystem', 'powered by NEXUS ecosystem')
    
    # Wait, the word Finanza could be somewhere else
    login_content = login_content.replace('Finanza', 'NEXUS')

    with open(login_path, 'w', encoding='utf-8') as f:
        f.write(login_content)

update_nexus()
print("Nexus updated!")
