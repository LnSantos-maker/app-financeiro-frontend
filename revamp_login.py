import re

def rewrite_login():
    path = r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\Login.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add blobs and change right column background to bg-main
    old_right = '<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-card)]">'
    new_right = '''<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-main)] relative overflow-hidden">
          {/* Animated Glow Blobs */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-cyan-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="w-full max-w-md relative z-10 backdrop-blur-xl bg-[#181a20]/60 p-10 rounded-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">'''
    
    content = content.replace(old_right, new_right)
    
    # We replaced `<MotionWrapper className="w-full max-w-md">` logic. We need to actually keep MotionWrapper.
    # Let's do it safer:
    
    content = content.replace(
        '<MotionWrapper className="w-full max-w-md">',
        '<MotionWrapper className="w-full">'
    )
    
    # Also fix 2FA input
    content = content.replace(
        'bg-[var(--bg-main)] border-b border-zinc-700',
        'bg-[#0a0c10] border border-white/5 rounded-xl shadow-inner'
    )
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

rewrite_login()
print("Login completely revamped!")
