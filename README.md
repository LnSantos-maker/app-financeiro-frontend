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

# 3. Inicie o servidor de desenvolvimento apontando para a API publicada
npm run dev:conta-teste
```

O app abre em `http://localhost:5173`. Na tela de login, **crie uma conta de teste** (ou use a que o responsável passar) e use somente ela. Não é necessário criar nenhum arquivo `.env`.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API (backend) |

O valor é escolhido pelo modo de execução do Vite:

| Comando | `VITE_API_URL` usada |
|---|---|
| `npm run dev:conta-teste` | API publicada (definida em [`.env.conta-teste`](.env.conta-teste)) |
| `npm run dev` | `http://localhost:8000` (backend local, se você tiver um) |

Para usar outra URL, crie um arquivo `.env.local` na raiz com `VITE_API_URL=<url>` (ou copie o exemplo: `cp .env.example .env.local` no PowerShell/Git Bash/Mac/Linux, `copy .env.example .env.local` no cmd). Esse arquivo não é versionado. A leitura da variável está centralizada em [`src/config.js`](src/config.js).

### Backend e login

Este repositório contém **apenas o frontend**; o backend é mantido em outro lugar e você não precisa dele para trabalhar. Com `npm run dev:conta-teste`, o app conversa com a API publicada, e o login é feito pelo Firebase.

> **Importante:** como a API é a mesma usada pelos usuários reais, **use apenas contas de teste**. Nunca entre com contas de pessoas reais, e não apague nem altere dados que não sejam da sua conta de teste.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev:conta-teste` | Servidor de desenvolvimento usando a API publicada (recomendado) |
| `npm run dev` | Servidor de desenvolvimento usando a API em `localhost:8000` |
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
