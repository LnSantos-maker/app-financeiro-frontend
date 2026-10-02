import os

frontend_dir = os.path.dirname(__file__)
search_str = 'http://localhost:8000'
replace_str = 'https://app-financeiro-10tz.onrender.com'

for root, dirs, files in os.walk(os.path.join(frontend_dir, 'src')):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            if search_str in content:
                content = content.replace(search_str, replace_str)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {file_path}')
