# NEXUS — Perspectiva em construção

## Premissa visual

O dinheiro disponível, os compromissos e os objetivos formam camadas de uma mesma escolha. A apresentação transforma um cofre fechado em uma composição aberta. O painel retoma esse objeto como assinatura discreta e prioriza os valores reais.

Paleta: papel azul acinzentado, grafite, metal e laranja. A fonte Archivo é local e licenciada sob OFL. Não há fotografias de catálogo, modelos externos, resultados financeiros inventados ou curvas de saldo simuladas na interface entregue.

## Referências e limites de observação

- Igloo: cena ao vivo renderizada neste ambiente; referência de objeto, materiais e mundo visual específico à marca. https://www.igloo.inc/
- Lusion: abertura observada, mas o navegador permaneceu no carregamento; não se afirma ter validado toda a coreografia de scroll. https://lusion.co/
- Hatom: abertura e símbolo de carregamento observados; percurso completo não verificado. https://www.hatom.com/
- React Bits: repertório indicado pelo usuário; nenhum componente foi copiado. https://reactbits.dev/

Os prints enviados são um mapa de competências de front-end, não um layout a reproduzir. Figma/Adobe XD não são necessários para alterar este repositório; não foram criados arquivos externos.

## Movimento e ciclo de vida

Um único MotionValue do scroll nativo coordena texto e posição das camadas. O mapeamento das opacidades é calculado na mesma referência de progresso usada pela cena, evitando divergência entre ViewTimeline e a geometria sticky neste navegador.

A cena procedural está separada da interface React. Não existe atualização de estado React por frame. Inclui descarte de geometrias, materiais e renderer; pausa em aba oculta/fora da tela; suspensão do desenho com login aberto; resolução limitada a DPR 1 em áreas pequenas e 1,5 nas maiores.

A abertura apresenta fases reais de preparação. Não há contador percentual fictício nem espera mínima artificial. O visitante pode continuar sem 3D, acessar a conta durante a preparação e desativar movimento. Redução de movimento, falha de WebGL e perda de contexto mantêm uma alternativa SVG com o mesmo conceito.

## Evidência de validação

Edge/Chromium no Windows: 11 testes comportamentais aprovados, cobrindo login/cadastro, teclado/foco, navegação do painel, troca de mês, fluxo de scroll, modo estático, movimento reduzido, ausência/perda de WebGL e composição em 360, 390, 768 e 1440px. Também houve inspeção visual em 1280x720.

As integrações financeiras dos testes usam dados interceptados. Não foram feitas transações reais nem validado o login real no Firebase.

Amostra local de 120 intervalos de requestAnimationFrame, 1440x1000/DPR 1: mediana 6,1 ms e p95 6,2 ms. É uma observação curta do ambiente desktop; não comprova Core Web Vitals, desempenho de GPU de celular ou fluidez em todos os dispositivos.

Build de produção aprovado. Permanecem 16 erros e 3 avisos na checagem geral de código legado; os módulos novos da experiência passam no ESLint. O aviso antigo de eval da calculadora não foi ocultado.

## Revisão de movimento — 28/10/2026

A direção foi reconstruída como um instrumento orbital: cofre em três camadas, anéis de orientação, marcações e peças instanciadas. A abertura usa grafite esverdeado, cobre e metal; os capítulos alternam papel quente, verde mineral e fundo profundo. A identidade do painel existente permanece nesta rodada.

Quatro atos no scroll nativo: visão geral, aproximação de câmera, separação das camadas com inversão da composição e recomposição. A câmera e os objetos usam progresso compartilhado, com interpolação dependente do tempo. Anéis têm movimento próprio em repouso. Entrada tipográfica por máscara, pré-carregamento com saída por recorte, ponte tipográfica horizontal e capítulos com transformação de escala/profundidade. `cinematic.css` concentra a direção de arte e a coreografia visual sobre os componentes editoriais de `experience.css`.

`ScrollOptics` calcula uma aproximação de motion blur baseada em velocidade (máximo 3,5px), suavizada e limitada à cena. Não é pós-processamento físico por buffers de velocidade. O efeito volta a zero em repouso; a iluminação da camada se reduz quando os títulos ocupam o centro. Controles e textos não recebem blur.

13 testes passaram em Edge/Windows: incluem os quatro atos, reversão, mudança visual em repouso, blur durante movimento e retorno a zero, além dos fluxos anteriores. Medição breve durante scroll em 1440x900: mediana de intervalo rAF 6,1ms, p95 6,2ms. Não equivale a custo de renderização da GPU, teste em celular físico ou Web Vitals. Build e ESLint dos módulos alterados aprovados. Gravação do percurso feita no navegador; nenhuma transação real executada.
## Peças e chegada à conta — revisão de 28/10
As três peças editoriais agora são geometrias Three.js com materiais metálicos, clearcoat e iluminação de ambiente pré-calculada. Arraste e setas mudam a orientação da geometria e, consequentemente, o reflexo. Não há simulação de ray tracing em tempo real. Scroll vertical continua nativo no toque. Cada cena pausa fora da viewport e descarta recursos no desmontar; a geometria anterior serve como alternativa se WebGL falhar.
A abertura pública foi substituída por uma única composição de abertura de diafragma. O vídeo enviado foi inspecionado em quadros: a referência de pós-login apresenta marca sobre campo luminoso e saída discreta. AccountArrival só é ativado por onLoginSuccess; aguarda a preparação inicial de configuração/dados do Dashboard. Reabrir uma sessão persistida não ativa essa animação. Autenticação real não foi executada nesta revisão.
13 testes anteriores passaram e um teste adicional confirmou mudança do render após arraste e teclado. Build e lint dos módulos novos passaram.
