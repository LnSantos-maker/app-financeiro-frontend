import { User, Sparkles, Bot, Shield, Zap, Smile, Star, Flame } from 'lucide-react';

export const AVATARES = [
  { id: 'avatar-1', nome: 'Executivo', icone: User, cor: 'from-teal-500 to-emerald-600', border: 'border-teal-500/40', textCor: 'text-teal-400' },
  { id: 'avatar-2', nome: 'Nexus Bot', icone: Bot, cor: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/40', textCor: 'text-cyan-400' },
  { id: 'avatar-3', nome: 'Estrategista', icone: Sparkles, cor: 'from-amber-400 to-orange-500', border: 'border-amber-500/40', textCor: 'text-amber-400' },
  { id: 'avatar-4', nome: 'Guardião', icone: Shield, cor: 'from-indigo-500 to-purple-600', border: 'border-indigo-500/40', textCor: 'text-indigo-400' },
  { id: 'avatar-5', nome: 'Velocidade', icone: Zap, cor: 'from-rose-500 to-pink-600', border: 'border-rose-500/40', textCor: 'text-rose-400' },
  { id: 'avatar-6', nome: 'Zen', icone: Smile, cor: 'from-emerald-400 to-teal-600', border: 'border-emerald-500/40', textCor: 'text-emerald-400' },
  { id: 'avatar-7', nome: 'Estrela', icone: Star, cor: 'from-yellow-400 to-amber-600', border: 'border-yellow-500/40', textCor: 'text-yellow-400' },
  { id: 'avatar-8', nome: 'Fogo', icone: Flame, cor: 'from-red-500 to-rose-700', border: 'border-red-500/40', textCor: 'text-red-400' },
];

export function AvatarBadge({ avatarId, nome, tamanho = 'md', className = '' }) {
  const av = AVATARES.find(a => a.id === avatarId) || AVATARES[0];
  const Icone = av.icone;
  
  const dimensoes = {
    sm: 'w-9 h-9 text-base',
    md: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-3xl'
  }[tamanho] || 'w-14 h-14';

  const iconSizes = {
    sm: 18,
    md: 26,
    lg: 38
  }[tamanho] || 26;

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${av.cor} p-0.5 shadow-[0_0_20px_rgba(45,212,191,0.2)] ${className}`}>
      <div className={`${dimensoes} rounded-2xl bg-[#0a0c10]/85 backdrop-blur-md flex items-center justify-center border border-white/10 text-white relative overflow-hidden group`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${av.cor} opacity-20`}></div>
        <Icone size={iconSizes} className={`${av.textCor} relative z-10 transition-transform group-hover:scale-110`} />
      </div>
    </div>
  );
}
