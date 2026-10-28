# App Financeiro — Frontend

Interface web do App Financeiro, feita com **React 19 + Vite + Tailwind CSS**. O estado é gerenciado com **Zustand** e a autenticação usa **Firebase**.

## Pré-requisitos

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org) (versão LTS)

## Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/LnSantos-maker/app-financeiro-frontend.git
cd app-financeiro-frontend

# 2. Instale as dependências
npm install

# 3. Crie seu arquivo de variáveis de ambiente
cp .env.example .env.local        # Windows (PowerShell): copy .env.example .env.local

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O app abre em `http://localhost:5173`.

## Variáveis de ambiente

| Variável | Descrição | Padrão em `npm run dev` |
|---|---|---|
| `VITE_API_URL` | URL base da API (backend) | `http://localhost:8000` |

Edite o `.env.local` (ele não é versionado). A leitura da variável está centralizada em [`src/config.js`](src/config.js).

> **Importante:** não aponte `VITE_API_URL` para a API de produção durante o desenvolvimento, porque isso altera dados reais. Peça ao responsável pela URL de um backend de **teste**.

### Backend e login

Este repositório contém **apenas o frontend**. Sem uma API respondendo em `VITE_API_URL`, telas que dependem de dados (login, saldo, transações etc.) não carregam. O login usa Firebase, então solicite ao responsável uma **conta de teste**.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve localmente o build de produção |
| `npm run lint` | Executa o ESLint |

## Estrutura

```
src/
  pages/        Telas (Login, Dashboard e views do dashboard)
  components/   Componentes reutilizáveis
  store/        Estado global (Zustand)
  config.js     Configuração da URL da API
  firebase.js   Configuração do Firebase
tests/          Testes end-to-end (Playwright)
```

## Fluxo de trabalho

1. Atualize a `main`: `git checkout main && git pull`.
2. Crie uma branch para a tarefa: `git checkout -b feat/nome-da-tarefa`.
3. Faça os commits. Antes de cada commit, o hook roda `npm run build`; se o build quebrar, o commit é bloqueado.
4. Envie a branch: `git push origin feat/nome-da-tarefa`.
5. Abra um **Pull Request** no GitHub para revisão. Não envie direto para a `main`.

Sugestão de mensagens de commit (Conventional Commits): `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`.

## Notas do template Vite

Este projeto foi iniciado a partir do template React + Vite, que oferece dois plugins oficiais:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/)

### React Compiler

O React Compiler não está habilitado neste template por causa do impacto no desempenho de dev e build. Para adicioná-lo, veja [esta documentação](https://react.dev/learn/react-compiler/installation).

### Expandindo a configuração do ESLint

Para uma aplicação de produção, recomendamos usar TypeScript com regras de lint com checagem de tipos. Veja o [template TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) e o [`typescript-eslint`](https://typescript-eslint.io).
