# Human Token | Unico · Landing page (handoff)

Página estática em HTML + CSS + JS puro, sem build e sem dependências. Referência visual: Figma **Human Token – Live & Static**, página **Human Token – UI**, frame **Human Token01**.

## Estrutura

```
index.html
assets/
  css/styles.css     tokens de marca no :root + layout responsivo
  js/main.js         carrossel "How it works" + marquee de logos
  img/               hero.jpg (2x), avatar-1..3.png
  steps/             step-01..04.jpg (posters do carrossel)
  icons/             logo Unico, ícones da biblioteca Unico, sociais, pin
  logos/             10 logos de clientes (SVG, cinza #3E3A33)
```

Para rodar localmente: `python3 -m http.server` na pasta e abrir `http://localhost:8000`.

## Seções (ordem)

1. Header (sticky): Demo, Documentation, Get started
2. Hero: Human Token
3. Faixa de mensagem
4. How it works: carrossel com 4 passos
5. Privacy by Design
6. Identity, finally human (jornada)
7. Clientes: marquee automático
8. How we put the human back at the center (4 perguntas)
9. Use cases (6 cards)
10. Formulário de contato (`#contact`)
11. Footer

## Comportamento do carrossel "How it works"

Implementado em `assets/js/main.js`.

- Um passo por vez: mídia à esquerda, texto à direita.
- **Sem scroll-jacking.** A seção tem altura fixa e a página rola normalmente.
- **Autoplay** de 6 s por passo, com a barra da aba ativa funcionando como timer. Para mudar o tempo, altere `DURATION` no JS e `--step-duration` no CSS.
- O autoplay **pausa** com o mouse sobre a seção, com foco dentro dela e quando ela sai da tela (IntersectionObserver).
- Abas 01 a 04, setas ‹ ›, swipe no mobile e teclado (← → Home End). Qualquer interação do usuário interrompe o autoplay, e o botão Pause/Play religa.
- Com `prefers-reduced-motion`: sem autoplay e sem marquee.
- Transição em cross-fade de 300 ms.

## Pendências para a agência (buscar por `TODO(agency)` e `data-todo`)

| Item | Onde | O que fazer |
|---|---|---|
| Vídeos dos passos | `assets/steps/step-0X.mp4` | Exportar os motions da página **Human Token – Motion** do Figma (MP4 H.264, sem áudio, loop). O JS só carrega o vídeo se o arquivo existir; até lá aparecem os posters `.jpg`. |
| Motion do hero (opcional) | hero | Trocar o `<img>` por `<video autoplay muted loop playsinline poster="assets/img/hero.jpg">`. |
| URLs | header, jornada, footer | Demo, Documentation, Generate your token, Trust Center, Privacy Policy, Newsroom, Cookies Policy e redes sociais estão com `href="#"`. |
| Formulário | `#contact` | Conectar ao mesmo endpoint do formulário do unico.io (HubSpot/RD/Marketo). Os nomes dos campos são sugestões e a validação é a nativa do HTML. |
| Get started | header e hero | Hoje rolam até o formulário (`#contact`). Trocar se houver destino próprio. |
| Fontes | `<head>` | Geist e Geist Mono via Google Fonts. Se a política do site exigir self-host, baixar os .woff2 e trocar o `<link>` por `@font-face`. |
| SEO e analytics | `<head>` | Incluir canonical, og:url e og:image absolutos, tags de analytics e o banner de cookies padrão Unico. |

## Tokens de marca (em `:root`)

- Fundo `#FBFAF3` · seções brancas `#FFFFFF` · escuro `#1F1D1A` / `#2B2825`
- Texto `#14141A` · secundário `#4F4F4F` · terciário `#7A7A7A` / `#949494`
- Botão primário `#161616`, raio 8 px · cards com raio 16 px
- Acento Tea Green `#BED993`, usado só no chip "Human Token generated"
- Tipografia Geist 400/500/600

## Breakpoints

- Desktop ≥ 1200 px (container de 1280 px e margens de 80 px)
- Tablet de 768 a 1199 px (margens de 40 px, grids em 2 colunas)
- Mobile < 768 px (margens de 20 px, 1 coluna; a colagem do Privacy fica oculta e o carrossel aceita swipe)

## Testado

Chrome em 1440 px e 390 px. Sem erros de console; abas, setas, autoplay e marquee funcionando.
