import React, { useState } from 'react';
import { Smartphone, GraduationCap, MonitorPlay, Wifi, Car, Utensils, Home, Tv, Music, Coffee, Film, Zap, CreditCard, ShoppingBag } from 'lucide-react';

export function TransactionIcon({ categoria, tipo, size = 20, className = '' }) {
  const [imgError, setImgError] = useState(false);

  const getBrandDomain = (catString) => {
    const cat = catString.toLowerCase();
    if (cat.includes('vivo')) return 'vivo.com.br';
    if (cat.includes('tim')) return 'tim.com.br';
    if (cat.includes('claro')) return 'claro.com.br';
    if (cat.includes('netflix')) return 'netflix.com';
    if (cat.includes('prime')) return 'amazon.com';
    if (cat.includes('spotify')) return 'spotify.com';
    if (cat.includes('ifood')) return 'ifood.com.br';
    if (cat.includes('uber')) return 'uber.com';
    if (cat.includes('99')) return '99app.com';
    if (cat.includes('nubank') || cat.includes('nu')) return 'nubank.com.br';
    if (cat.includes('itau')) return 'itau.com.br';
    if (cat.includes('bradesco')) return 'bradesco.com.br';
    if (cat.includes('santander')) return 'santander.com.br';
    if (cat.includes('inter')) return 'bancointer.com.br';
    if (cat.includes('c6')) return 'c6bank.com.br';
    if (cat.includes('xp')) return 'xpi.com.br';
    if (cat.includes('mercado livre')) return 'mercadolivre.com.br';
    if (cat.includes('amazon')) return 'amazon.com';
    if (cat.includes('shopee')) return 'shopee.com.br';
    if (cat.includes('aliexpress')) return 'aliexpress.com';
    if (cat.includes('apple')) return 'apple.com';
    if (cat.includes('google')) return 'google.com';
    if (cat.includes('playstation') || cat.includes('psn')) return 'playstation.com';
    if (cat.includes('xbox')) return 'xbox.com';
    if (cat.includes('mcdonalds') || cat.includes('mc donald')) return 'mcdonalds.com';
    if (cat.includes('burger king') || cat.includes('bk')) return 'burgerking.com.br';
    if (cat.includes('smartfit') || cat.includes('smart fit')) return 'smartfit.com.br';
    if (cat.includes('gympass')) return 'gympass.com';
    if (cat.includes('azul')) return 'voeazul.com.br';
    if (cat.includes('gol')) return 'voegol.com.br';
    if (cat.includes('latam')) return 'latamairlines.com';
    if (cat.includes('steam')) return 'steampowered.com';
    return null;
  };

  const getFallbackIcon = (catString, tipo) => {
    if (tipo === 'Receita') return <Zap size={size} />;
    if (tipo === 'Cartao') return <CreditCard size={size} />;
    
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

  const brandDomain = getBrandDomain(categoria);

  if (brandDomain && !imgError) {
    return (
      <img 
        src={`https://logo.clearbit.com/${brandDomain}`} 
        alt={categoria} 
        style={{ width: size, height: size }}
        className={`object-contain rounded-sm ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return getFallbackIcon(categoria, tipo);
}
