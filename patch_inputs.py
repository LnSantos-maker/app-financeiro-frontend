import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace input classes
    content = re.sub(r'className="w-full bg-\[var\(--bg-card\)\].*?"', 'className="input-premium w-full px-4 py-3"', content)
    
    # Replace button classes
    content = re.sub(r'className="w-full bg-gradient-to-r.*?"', 'className="btn-premium w-full py-3.5 px-6 flex justify-between"', content)

    # For Password Input which has pr-10
    content = re.sub(r'className="input-premium w-full px-4 py-3"(.*?placeholder="••••••••")', r'className="input-premium w-full px-4 py-3 pr-10"\1', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_file(r'c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\src\pages\Login.jsx')
