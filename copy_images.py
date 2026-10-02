import os
import shutil

source_dir = r"C:\Users\luanb\.gemini\antigravity-ide\brain\e058055f-ed07-40fa-bf31-4a34335443e8"
dest_dir = r"c:\Users\luanb\OneDrive\Documentos\projeto_programa_financeiro\frontend\public\img"

os.makedirs(dest_dir, exist_ok=True)

images = {
    "cartao_3d.jpg": "cartao_3d_1790818818351.jpg",
    "extrato_3d.jpg": "extrato_3d_1790818828016.jpg",
    "metas_3d.jpg": "metas_3d_1790818837717.jpg",
    "planilha_3d.jpg": "planilha_3d_1790818848223.jpg"
}

for new_name, old_name in images.items():
    src = os.path.join(source_dir, old_name)
    dst = os.path.join(dest_dir, new_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {old_name} to {new_name}")
    else:
        print(f"Not found: {src}")
