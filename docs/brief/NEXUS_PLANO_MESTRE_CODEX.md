# NEXUS — PLANO MESTRE DE CORREÇÃO E EVOLUÇÃO DO FRONT-END

## PAPEL E MISSÃO
Você é o Codex trabalhando diretamente no repositório existente do projeto **NEXUS**. Atue como **diretor de arte digital, product designer sênior, motion designer e engenheiro front-end sênior**. Não quero apenas recomendações: **audite o projeto, proponha uma sequência segura e implemente as melhorias priorizadas**, verificando visual e tecnicamente cada etapa. Trabalhe sobre o código atual, não reconstrua o produto do zero.

O NEXUS é um produto financeiro com uma **landing page editorial/experimental** e um **painel interno funcional**. **Neste ciclo, o foco é finalizar e refinar a EXPERIÊNCIA PÚBLICA (landing, carregamento e entrada no app)**. O dashboard ainda não está pronto para uma reformulação completa: preserve seus fluxos e deixe a revisão profunda do interior para uma fase posterior. Pode corrigir inconsistências globais de identidade que apareçam no dashboard, sem transformar isso numa reescrita.

**Materiais que devem acompanhar este briefing:** (1) vídeo de navegação atual da NEXUS, com cerca de 67 segundos; (2) imagem `NEXUS-logo-oficial-referencia.png` — símbolo **N** branco angular sobre fundo preto, escolhido pelo proprietário como marca canônica. Se não encontrar esses arquivos no workspace, peça a inclusão no repositório ou aponte exatamente onde devem ser colocados; jamais invente um logo substituto.

### Referências, cada uma com um papel específico
- **https://www.igloo.inc** — referência de direção de arte singular, tipografia expressiva, composição, identidade integrada às cenas 3D, transições visuais sofisticadas e relação entre arte e tecnologia.
- **https://lusion.co** — referência PRINCIPAL para **scroll cinematográfico**, cenas 3D ligadas ao movimento da página, objetos manipuláveis, câmera, profundidade, parallax verdadeiro, respostas sutis ao ponteiro e continuidade entre cenas.
- **https://www.hatom.com** — referência PRINCIPAL para **preloading, entrada, transições entre estados e sutileza cinematográfica**. Buscamos a qualidade de orquestração e atmosfera, **não uma cópia literal do loader nem uma animação longa**.
- **https://reactbits.dev** e **https://github.com/DavidHDev/react-bits** — catálogo técnico para efeitos tipográficos, reveals, microinterações e componentes animados. Estude o código dos componentes escolhidos e **customize-os profundamente**; não adicione vários demos prontos só para parecer avançado.

As referências ensinam **princípios**, não assets, layouts ou sequências para plagiar. A NEXUS precisa ter linguagem própria. **É proibido deixar com cara de site genérico de IA**: sem excesso de neon, glows, gradientes padronizados, cards de template, palavras vazias, animações em tudo, glassmorphism indiscriminado ou partículas sem conceito.

## LEITURA DO ESTADO ATUAL PELO VÍDEO
- **~0:02–0:15 — hero escuro:** título “Seu próximo movimento.”, composição 3D com objeto central, órbitas/anéis e várias cenas/títulos ao avançar a página. É a seção com maior força visual. A representação do N no 3D não corresponde fielmente ao logo principal. O objeto não comunica de maneira clara uma interação de arrastar/girar.
- **~0:16–0:26 — narrativa em fundos claros/verde:** “O dinheiro é seu. A direção também.”, “O mês tem muitas partes. Veja o todo.”, “Nem todo gasto precisa ocupar o mesmo espaço.” e “Mas pode começar.”. A composição é interessante, mas a **coreografia do scroll perde intensidade e continuidade** em comparação com o começo.
- **~0:28–0:35 — autenticação:** modal de login/cadastro sobre a landing. A mudança para o estado seguinte não tem uma transição de identidade suficientemente coesa.
- **~0:36–0:39 — carregamento pós-login:** fundo muito claro/quase branco com um N pequeno e solto no centro. Parece uma interrupção, não um capítulo da experiência. **Isto não deve ser apenas embelezado: o fluxo de loading precisa ser revisto.**
- **~0:40 em diante — dashboard:** linguagem de UI clara/navy, cards e gráficos funcionais. Ainda está em construção. A identidade da barra lateral e a landing não parecem completamente uma mesma família.

Essas observações vêm da gravação; antes de alterar código, verifique o comportamento real no browser, especialmente interações, responsividade e tempos de carregamento. Não confunda hipóteses com bugs confirmados.

## PRINCÍPIOS INEGOCIÁVEIS
1. **Uma marca, uma geometria.** O N da imagem enviada é o logo oficial. Pode haver versão flat, extrudada/3D, animada, monocromática e lockup com “NEXUS”, mas todas devem preservar a **mesma silhueta e proporções essenciais**. Não invente novas letras N.
2. **Originalidade com intenção.** Cada efeito deve reforçar leitura, significado, marca ou percepção de qualidade. Remova efeitos decorativos ruins em vez de multiplicá-los.
3. **Landing de estúdio criativo, app de produto confiável.** O dashboard não precisa virar um laboratório de WebGL.
4. **Performance e usabilidade são parte do design.** 3D fluido, scroll utilizável, teclado, touch, contraste, mobile, `prefers-reduced-motion` e fallback sem WebGL.
5. **Não quebrar o produto.** Preserve autenticação, rotas, APIs, lógica financeira, formulários, navegação, textos essenciais e integrações. Não altere backend nem credenciais. Evite dependências sem justificativa.
6. **Não inventar tecnologia existente.** Detecte o stack real; adapte a proposta à arquitetura atual. Não migre de framework por estética.

## FASE 0 — AUDITORIA INICIAL (OBRIGATÓRIA)
Inspecione package.json, rotas, componentes, estilos, assets, fontes, renderização 3D, lógica de scroll, loader(s), autenticação, estados pós-login, perfis mobile, erros no console e scripts de build/test. Rode o projeto e compare com o vídeo.

Crie um relatório curto `docs/nexus-auditoria-frontend.md` com:
- mapa de páginas e componentes afetados;
- inventário de **todas as versões atuais de logo** e de onde são importadas;
- localização e gatilhos de todos os loaders/overlays;
- bibliotecas existentes (Motion/Framer Motion, GSAP, Lenis, Three.js/R3F, React Bits etc.);
- diagnóstico de performance, acessibilidade, responsividade e principais causas de jank;
- o que será preservado, modificado, adiado e riscos de regressão.

Crie uma branch de trabalho ou commits bem separados. Não pare apenas no relatório: prossiga com as fases prioritárias se o repositório permitir.

## FASE 1 — UNIFICAR COMPLETAMENTE A MARCA N
**Prioridade crítica.** Transforme a imagem fornecida em uma referência vetorial fiel. Não basta gerar um “N” com uma fonte qualquer. Trace/reconstrua os contornos com precisão, respeitando o recorte angular e as relações entre hastes/diagonais. Se a imagem de baixa resolução não permitir recuperar determinado detalhe, **não crie geometria aleatória**: documente a incerteza e preserve o máximo de fidelidade possível.

Crie uma fonte de verdade: `BrandMark` reutilizável (SVG ou componente equivalente), tokens de cor, padding e tamanhos. Faça o mesmo vetor alimentar:
- ícone/wordmark no header e footer;
- favicon e outras variantes necessárias;
- abertura/preloader;
- estado de autenticação;
- barra lateral do dashboard, no que for seguro alterar;
- 3D do hero, idealmente por **extrusão do SVG canônico**, geometria derivada do mesmo contorno ou aplicação visual consistente que não distorça a marca.

Reveja a cena 3D atual: se o objeto é um quadrado/placa decorativa, determine se ele pode ser mantido como suporte da marca; **o N nele deve continuar sendo exatamente o N oficial**. Não force trocar todos os objetos da página pelo logo; unifique a MARCA, não todos os elementos artísticos. Documente as variantes permitidas e proibidas em `docs/nexus-brand-motion.md`.

**Aceite:** screenshot do logo oficial, header, loader, 3D e sidebar devem mostrar a mesma identidade. Nenhum terceiro N arbitrário.

## FASE 2 — REDESENHAR PRELOADER INICIAL
**Objetivo:** transformar o carregamento inicial da landing em uma **abertura de marca elegante, discreta e tecnicamente honesta**, inspirada no cuidado do Hatom. Não quero um show longo antes de cada acesso.

**Direção visual sugerida (adapte à composição real):** fundo escuro quase preto, N oficial pequeno/médio em branco, uma linha/traço de progresso fino e preciso em laranja queimado ou off-white, ritmo calmo, uma mudança de escala/recorte que prepara a primeira cena. O N pode fazer a transição para sua posição no header ou para a composição hero, com continuidade espacial. **Sem branco piscando, sem spinner genérico, sem contador falso até 100%, sem loading eterno e sem exagero de blur.**

**Arquitetura correta:**
- definir quais recursos são realmente críticos para mostrar o primeiro viewport: DOM, fontes essenciais, cena/mesh principal em qualidade adequada, materiais/shaders críticos;
- carregar o restante em background/lazy load;
- mostrar progresso **real** por assets/grupos ou fases honestas, quando cabível; não prender a interface em um timer artificial;
- se o hero renderizar depois do HTML, reservar espaço e usar placeholder visual refinado sem layout shift;
- revelar o site assim que estiver utilizável, sincronizando overlay, texto e canvas numa timeline única;
- preferir versão curta em visitas com cache/navegação interna; evitar replay obrigatório;
- tratar falha de asset, WebGL indisponível e demora excessiva com fallback/continuação útil, nunca tela travada;
- remover corretamente overlays, event listeners, RAF, bloqueios de scroll e estados temporários após o final.

**Aceite:** primeira visita faz sentido; visitas seguintes não desperdiçam tempo; nenhuma tela branca; 100% significa pronto; landing utilizável mesmo quando um recurso não crítico falha.

## FASE 3 — TRANSIÇÃO PÓS-LOGIN COM SUTILEZA HATOM
**Objetivo:** corrigir especificamente o trecho ~0:36–0:39. **A tela branca com N solto deve desaparecer.** A autenticação é uma mudança de contexto, não uma nova landing cinematográfica.

**Proposta de coreografia (orientação, não cópia):**
1. Usuário envia login; botão mostra loading real e mantém feedback. O modal NÃO fecha antes da autenticação ser confirmada.
2. Em sucesso, modal perde ênfase com um fade/leve deslocamento; uma superfície escura/neutra da identidade NEXUS assume a cena **sem flash branco**.
3. O N oficial aparece ou permanece alinhado, com pequeno movimento de escala/posição ou traço geométrico de confirmação; usar easing refinado, sem giro extravagante.
4. Preparar shell do dashboard em paralelo; quando dados essenciais/rota estiverem prontos, revelar a interface usando máscara/clip/fade/slide contido. Se viável sem jank, o N do overlay encontra a posição do logo na sidebar (transição de elemento compartilhado/FLIP).
5. Se o carregamento do dashboard levar mais tempo, exibir progresso/estado real; não usar animação para esconder lentidão. Erro de login mantém o usuário no formulário com mensagem acessível. Logout/navegação devem ser previsíveis e mais curtos.

Defina estados explícitos `idle → submitting → authenticated → transitioning → dashboard-ready` com caminhos `error`, `cancelled` e fallback. Integre ao mecanismo de auth/router existente; evite corridas entre promises, navegação e desmontagem de componentes. Uma transição visual breve (~0,6–1,2 s **após** confirmação e prontidão, como faixa de referência, não espera forçada) é suficiente. Respeite movimento reduzido.

**Aceite:** login com sucesso tem transição elegante, contínua e curta; erro não dispara a transição; nenhum flash branco; nenhuma tela vazia; botão/modal continuam funcionais com teclado e leitor de tela.

## FASE 4 — RECONSTRUIR A COREOGRAFIA DO SCROLL NA LANDING
**Objetivo:** a tecnologia visual precisa continuar **durante a navegação normal da página**, não ficar restrita ao hero. Usar o scroll como playhead para mover cena/câmera, texto e composição, sem sequestrar o scroll do usuário. Referência Lusion (principal), com sensibilidade editorial Igloo.

**Mapa narrativo já existente — preserve a estrutura e o copy salvo melhorias justificadas:**
- **Hero “Seu próximo movimento.”:** scroll controla mudança de enquadramento/câmera/escala do objeto principal; orbitais reagem com profundidade; tipografia revela por blocos e tem ritmo coerente. O objeto pode ter parallax delicado com o ponteiro.
- **Sequência escura (“Cada escolha…”, “Por trás de cada número, uma escolha.”, “O agora. O depois.”):** evitar cortes arbitrários e telas que parecem independentes. Criar continuidade entre posição do 3D, foco de câmera, movimentos de texto e recortes; usar transições guiadas pelo progresso do usuário. Permitir desfazer animação ao rolar para cima.
- **“O dinheiro é seu. A direção também.”:** passagem intencional dark → off-white, transição de atmosfera/contraste, tipografia entrando em camadas sutis. Uma pausa visual é positiva; não animar tudo.
- **“O mês tem muitas partes. Veja o todo.”:** painel/cartão demonstrativo pode ganhar parallax, inclinação/inércia leve ou montagem em profundidade sincronizada com scroll. Não dificultar leitura nem interação.
- **“Nem todo gasto precisa ocupar o mesmo espaço.”:** as três barras/volumes 3D devem responder ao scroll (montagem, posicionamento, volume/perspectiva), com microinteração de ponteiro. Amarrar movimento ao conceito de hierarquia de gastos; não usar giro gratuito.
- **“Mas pode começar.”:** chegada editorial com grande tipografia e CTA consistente, destaque por contraste, reveal com timing fino; transição para modal de login intencional.

**Princípios de motion:**
- combinar scroll-linked (`scrub`) para cenas/objetos com scroll-triggered para conteúdo que deve entrar uma vez;
- usar pinning/sticky somente quando tiver justificativa narrativa, em trechos limitados, nunca transformar todo site em rolagem artificial;
- orientar a progressão no eixo scroll nativo, preservar wheel/touch/trackpad, barra de rolagem, links âncora, foco e botão voltar;
- evitar scroll snapping compulsório e smooth scrolling acumulado em várias bibliotecas;
- animações reversíveis e que não quebram em scroll rápido ou quando viewport muda;
- transições de tipografia preferindo transform/opacity/clip com muito cuidado; manter conteúdo acessível e SEO no DOM.

Crie um **motion storyboard** simples por seção com `estado inicial`, `scroll 0..1`, `câmera/3D`, `texto`, `saída`, `mobile/fallback`. A animação não pode ser produzida apenas por copiar o mesmo reveal em todas as seções.

## FASE 5 — 3D REALMENTE INTERATIVO, NÃO APENAS DECORATIVO
O objeto principal precisa parecer uma peça digital que o usuário pode explorar:
- desktop: drag horizontal/vertical com rotação limitada, damping/inércia sutil, retorno suave ao estado de repouso (ou preservar orientação intencionalmente), cursor/affordance de arraste; auto-movimento idle discreto;
- não misturar animação de scroll com drag numa disputa de transform: composição de camadas, valores base + offset interativo ou controlador único;
- hover e pointer parallax proporcionais, sem seguir mouse agressivamente;
- mobile: touch suportado sem capturar a rolagem vertical da página; fornecer affordance simples ou desativar drag quando conflita, mantendo experiência visual e fallback estático;
- câmera, escala, perspectiva, materiais e iluminação com acabamento profissional; reservar o laranja como acento consciente, não transformar tudo em neon;
- GLB/texturas comprimidas quando disponíveis, geometria compartilhada, animação pausada fora do viewport, DPR controlado, context loss e disposal tratados.

Se o WebGL atual for inviável de ajustar, proponha substituição localizada e justifique antes. Não replique a cena inteira como DOM 3D falso nem troque modelos valiosos por cubos genéricos.

## FASE 6 — SISTEMA VISUAL, MOTION TOKENS E PERFORMANCE
Crie **tokens centrais**, sem alterar arbitrariamente a identidade aprovada:
- cores: quase preto/navy, off-white, laranja de destaque e verde discreto, com funções claras para cada tonalidade; preserve o caráter editorial já existente;
- tipografia: escala responsiva com `clamp()`, diferenciação expressiva de títulos e legibilidade de UI, altura de linha, tracking, largura máxima de parágrafos;
- layout: spacing consistente, alinhamento, grids, safe areas, área de CTA, alinhamento das transições;
- motion: durações por categoria (micro ~160–240ms; UI ~280–450ms; seção ~600–1000ms; transições narrativas somente quando justificadas), easing, stiffness/damping e política de reduced motion;
- estados: hover, focus-visible, pressed, loading, disabled, error, empty, success.

**Escolha bibliotecas com critério:** preserve o stack existente. Use Motion/Framer Motion para microinterações/UI, GSAP + ScrollTrigger apenas se o projeto precisa de timelines complexas, Three.js/R3F para o 3D. Use React Bits para estudar/derivar efeitos específicos e editar seu código quando a licença permitir. **Não instale Motion, GSAP, Lenis, Three e outras soluções redundantes sem demonstrar necessidade.** DOM mantém textos, formulários, botões e links; canvas cuida de profundidade/cena.

**Performance, responsividade e acessibilidade (verificar no navegador):**
- medir antes/depois com Lighthouse/Performance e DevTools; capturar gargalos reais e documentar o ambiente de teste;
- acompanhar LCP (alvo recomendado ≤2,5s em boa parte das visitas), CLS (≤0,1) e INP (≤200ms em condições representativas); não inventar resultados nem sacrificar usabilidade para pontuação;
- testar desktop, notebook modesto, mobile pequeno, mobile intermediário, touch, teclado, Safari/Chrome/Firefox onde possível;
- evitar setState React a cada frame; usar motion values/refs/uniforms, RAF coordenado, transforms, observers e cleanup;
- lazy mount e pause para cenas invisíveis, limitar DPR e pós-processamento no mobile, fallback estático e `prefers-reduced-motion`;
- nenhum scrolljacking, nenhum bloqueio de foco indevido, nenhuma dependência desnecessária, nenhuma fonte/textura gigante sem otimização;
- preservar contraste, focus-visible, rótulos de inputs, `aria-live` para erros de login e diálogo modal com trap/focus restoration corretos;
- testar layout nos breakpoints e em zoom 200% sem overflow destrutivo.

## FASE 7 — DASHBOARD: APENAS CONSISTÊNCIA ESSENCIAL AGORA; REFORMA DEPOIS
**Neste ciclo NÃO redesenhe todas as páginas internas.** Apenas aplique o logo canônico e harmonize a conexão visual entre a entrada e a navegação interna, corrigindo erros graves introduzidos pelas fases anteriores. Documente para a etapa futura:
- sidebar e layout grid; cards/conteúdo excessivamente estreitos em Configurações;
- hierarquia tipográfica e legibilidade de saldos/legendas;
- tokens de cor funcionais, estados de cards, botões e contraste;
- estados vazios de Benefícios, Cofres, Planejamento etc.;
- tabelas, gráficos, navegação e feedback.

O interior deve ser um **sistema financeiro profissional, limpo e confiável**, não uma landing page 3D dentro de cada tela.

## ORDEM DE EXECUÇÃO, CONTROLE E ENTREGAS
**Ordem obrigatória:**
1. Auditoria + baseline e mapa dos assets.
2. Identidade N canônica em todo ponto que a representa.
3. Novo preloader inicial com progresso correto.
4. Login → dashboard: nova transição sem tela branca.
5. Scroll storytelling em seções, começando pelo hero e uma seção clara; depois completar o restante.
6. Drag/interatividade 3D integrada ao scroll.
7. Responsividade, performance, acessibilidade, limpeza e regressões.
8. Backlog detalhado do dashboard, sem implementá-lo agora.

Para cada fase, **implemente, execute build/lint/test existentes, valide no browser, faça screenshot/vídeo curtos de desktop/mobile e registre alterações**. Não faça refatoração total nem altere código não relacionado. Se uma recomendação não for factível, explique com evidências e execute uma alternativa compatível com o resultado desejado. Sempre prefira acabamento coeso a quantidade de efeitos.

**Entregáveis finais:**
- código implementado e executável;
- documentação de marca/motion e arquitetura dos novos loaders;
- lista de arquivos alterados e dependências novas com justificativa;
- comparativo visual antes/depois e evidências de validação;
- dados reais de performance disponíveis, com limitações declaradas;
- bugs/regressões encontrados e resolvidos;
- backlog separado de melhorias do dashboard.

### CRITÉRIOS FINAIS DE ACEITAÇÃO
- [ ] N canônico idêntico na navegação, no objeto 3D, no preloader e na entrada no app (variações somente de material/transformação fiel).
- [ ] O carregamento inicial não tem spinner genérico, flash branco, porcentagem falsa ou bloqueio excessivo.
- [ ] O login bem-sucedido substitui a tela branca pelo fluxo cinematográfico sutil e confiável; erros continuam acessíveis.
- [ ] Scroll tem narrativa e transições próprias ao longo de TODA a landing, incluindo as seções claras.
- [ ] Objeto 3D principal responde ao usuário com drag/inércia controlados sem prejudicar scroll/touch.
- [ ] Layout segue excelente em desktop e mobile, inclusive sem WebGL e com movimento reduzido.
- [ ] Site continua sendo reconhecidamente NEXUS — original, sem estética genérica de IA.
- [ ] Login, rotas, formulários, navegação e dashboard permanecem funcionando.
- [ ] O Codex entrega implementação e evidências, não apenas um documento de planejamento.

**COMECE pela auditoria do repositório e implementação das fases prioritárias. Não suponha a estrutura do projeto nem reivindique validações que não executou.**
