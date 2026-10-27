// URL base da API. Defina VITE_API_URL no arquivo .env.local (veja .env.example).
// Fallback sem a variável:
//  - desenvolvimento (npm run dev): backend local, para não mexer em dados de produção por engano;
//  - build de produção: API de produção, para o deploy não quebrar caso a variável não esteja configurada.
const FALLBACK_URL = import.meta.env.PROD
  ? 'https://app-financeiro-10tz.onrender.com'
  : 'http://localhost:8000';

const rawUrl = import.meta.env.VITE_API_URL || FALLBACK_URL;

export const API_URL = rawUrl.replace(/\/+$/, '');
