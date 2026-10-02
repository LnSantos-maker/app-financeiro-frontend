import React, { useState } from 'react';
import { Smartphone, GraduationCap, MonitorPlay, Wifi, Car, Utensils, Home, Tv, Music, Coffee, Film, Zap, CreditCard, ShoppingBag } from 'lucide-react';

export function TransactionIcon({ categoria, tipo, size = 20, className = '' }) {
  const [imgError, setImgError] = useState(false);

  const getSvgBankLogo = (catString) => {
    if (!catString) return null;
    const b = catString.toLowerCase();
    
    if (b.includes('nu')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#8A05BE"/>
        <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="45" fontWeight="bold" fill="white" textAnchor="middle">nu</text>
      </svg>
    );

    if (b.includes('inter')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#FF7A00"/>
        <text x="50" y="62" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="900" fill="white" textAnchor="middle">inter</text>
      </svg>
    );

    if (b.includes('ita')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#EC7000"/>
        <rect x="10" y="10" width="80" height="80" rx="20" fill="#003399"/>
        <text x="50" y="62" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="#FFCC00" textAnchor="middle">Itaú</text>
      </svg>
    );

    if (b.includes('bradesco')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#CC092F"/>
        <circle cx="50" cy="40" r="15" fill="white"/>
        <rect x="35" y="60" width="30" height="8" rx="4" fill="white"/>
      </svg>
    );

    if (b.includes('santander')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#EC0000"/>
        <path d="M50 30 C 65 30, 70 50, 70 50 L 30 50 C 30 50, 35 30, 50 30 Z" fill="white"/>
        <circle cx="50" cy="65" r="10" fill="white"/>
      </svg>
    );

    if (b.includes('c6')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#242424"/>
        <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="50" fontWeight="bold" fill="white" textAnchor="middle">C6</text>
      </svg>
    );

    if (b.includes('brasil') || b.includes('bb')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#003DA5"/>
        <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="50" fontWeight="900" fill="#FAEA00" textAnchor="middle">bb</text>
      </svg>
    );

    if (b.includes('caixa')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#005CA9"/>
        <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="bold" fill="#F39200" textAnchor="middle">X</text>
      </svg>
    );

    if (b.includes('xp')) return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="25" fill="#000000"/>
        <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="45" fontWeight="bold" fill="#FFC800" textAnchor="middle">XP</text>
      </svg>
    );

    return null;
  };

  const getBrandLogoUrl = (catString) => {
    if (!catString) return null;
    const cat = catString.toLowerCase();
    // Other common brands using clearbit fallback
    if (cat.includes('netflix')) return 'https://logo.clearbit.com/netflix.com';
    if (cat.includes('prime') || cat.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
    if (cat.includes('spotify')) return 'https://logo.clearbit.com/spotify.com';
    if (cat.includes('ifood')) return 'https://logo.clearbit.com/ifood.com.br';
    if (cat.includes('uber')) return 'https://logo.clearbit.com/uber.com';
    if (cat.includes('mercado livre')) return 'https://logo.clearbit.com/mercadolivre.com.br';
    if (cat.includes('shopee')) return 'https://logo.clearbit.com/shopee.com.br';
    if (cat.includes('apple')) return 'https://logo.clearbit.com/apple.com';
    if (cat.includes('google')) return 'https://logo.clearbit.com/google.com';
    if (cat.includes('mcdonalds')) return 'https://logo.clearbit.com/mcdonalds.com';
    if (cat.includes('smartfit')) return 'https://logo.clearbit.com/smartfit.com.br';
    return null;
  };

  const getFallbackIcon = (catString, tipo) => {
    if (tipo === 'Receita') return <Zap size={size} />;
    if (tipo === 'Cartao') return <CreditCard size={size} />;
    
    if (!catString) return <ShoppingBag size={size} />;
    const cat = catString.toLowerCase();
    if (cat.includes('celular') || cat.includes('telefone')) return <Smartphone size={size} />;
    if (cat.includes('faculdade') || cat.includes('escola') || cat.includes('curso') || cat.includes('educacao')) return <GraduationCap size={size} />;
    if (cat.includes('cinema') || cat.includes('filme')) return <Film size={size} />;
    if (cat.includes('restaurante') || cat.includes('comida') || cat.includes('mercado') || cat.includes('padaria') || cat.includes('lanche')) return <Utensils size={size} />;
    if (cat.includes('gasolina') || cat.includes('carro') || cat.includes('transporte') || cat.includes('estacionamento') || cat.includes('pedagio')) return <Car size={size} />;
    if (cat.includes('internet') || cat.includes('wifi') || cat.includes('net')) return <Wifi size={size} />;
    if (cat.includes('aluguel') || cat.includes('casa') || cat.includes('condominio') || cat.includes('luz') || cat.includes('agua')) return <Home size={size} />;
    if (cat.includes('musica') || cat.includes('show')) return <Music size={size} />;
    if (cat.includes('cafe')) return <Coffee size={size} />;
    if (cat.includes('tv') || cat.includes('streaming')) return <Tv size={size} />;
    
    return <ShoppingBag size={size} />;
  };

  const svgLogo = getSvgBankLogo(categoria);
  if (svgLogo) {
    return svgLogo;
  }

  const brandLogoUrl = getBrandLogoUrl(categoria);

  if (brandLogoUrl && !imgError) {
    return (
      <img 
        src={brandLogoUrl} 
        alt={categoria} 
        style={{ width: size, height: size }}
        className={`object-contain rounded-sm ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return getFallbackIcon(categoria, tipo);
}
