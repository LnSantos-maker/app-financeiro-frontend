const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

code = code.replace(/export default function App\(\) \{[\s\S]*?const \[dataSelecionada, setDataSelecionada\] = useState\(new Date\(\)\);/, 
  "import { MotionWrapper } from '../components/ui/MotionWrapper';\n\nexport default function Dashboard({ emailLogin, onLogout, mostrarNotificacao }) {\n  const [dataSelecionada, setDataSelecionada] = useState(new Date());");

code = code.replace(/const mostrarNotificacao = [\s\S]*?3500\); \};\n/, "");

code = code.replace(/<button onClick=\{[^}]*setIsAutenticado\(false\)[^}]*\}[\s\S]*?Sair do Aplicativo <LogOut size=\{18\} \/><\/button>/, 
  "<button onClick={onLogout} className=\"w-full bg-[#090b10] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 font-bold py-4 rounded-xl mt-2 transition-all border border-slate-800 hover:border-rose-500/30 flex justify-center items-center gap-2\">Sair do Aplicativo <LogOut size={18} /></button>");

// Remove login screen render
code = code.replace(/if \(!isAutenticado\) \{[\s\S]*?\/\/ 6\. RENDERIZAÇÃO DO APLICATIVO INTERNO/m, "// 6. RENDERIZAÇÃO DO APLICATIVO INTERNO");

// Remove toast from render
code = code.replace(/\{toast\.visivel && \([\s\S]*?<\/[dD]iv>\s*\)\}/m, "");

fs.writeFileSync('src/pages/Dashboard.jsx', code);
console.log('Dashboard refactored successfully.');
