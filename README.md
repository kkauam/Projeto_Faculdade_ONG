# ONG Transformar

Site institucional desenvolvido como **atividade acadêmica**, com o objetivo de praticar HTML semântico, CSS e JavaScript puro na construção de um site de múltiplas páginas para uma organização fictícia do terceiro setor.

## Sobre o projeto

A ONG Transformar é uma organização fictícia que atua conectando recursos e voluntários a comunidades em situação de vulnerabilidade. O site apresenta a instituição, seus projetos sociais e um formulário de cadastro para voluntários e doadores.

## Páginas

- **`index.html`** — Página inicial, com apresentação institucional ("Quem Somos"), indicadores (KPIs) de impacto, diretrizes (missão e visão) e dados de contato.
- **`projetos.html`** — Painel com os projetos sociais em andamento (*Educação para o Futuro* e *Prato Cheio*), incluindo indicadores e barras de progresso.
- **`cadastro.html`** — Formulário de engajamento para voluntários e doadores, com máscaras de entrada (CPF, telefone, CEP) e preenchimento automático de endereço via [ViaCEP](https://viacep.com.br/).

## Estrutura de pastas

```
site-ong-transformar/
├── index.html            # Página inicial (Institucional, Indicadores e Dark Mode)
├── projetos.html         # Página de Projetos Sociais e Metas
├── cadastro.html         # Formulário acessível de engajamento e dados pessoais
├── package.json          # Metadados e scripts de build
├── build.js              # Pipeline de empacotamento modular e minificação
├── vite.config.js        # Configuração para empacotamento multi-page
├── .gitignore            # Ignora pastas de distribuição e dependências
├── css/
│   ├── style.css         # Ponto de entrada (Main CSS) que importa os módulos
│   └── modules/          # Arquitetura modular de estilos
│       ├── variables.css # Variáveis de tema (Modo Claro e Modo Escuro)
│       ├── base.css      # Reset e estilos estruturais
│       ├── layout.css    # Topo, rodapé, grids e hero
│       ├── components.css# Cards, botões, badges, forms e alertas
│       └── animations.css# Keyframes, transições e regras de responsividade
├── js/
│   ├── ui.js             # Gerenciamento de tema (Dark Mode) e barras de progresso
│   └── cadastro.js       # Máscaras de regex, validação e busca de CEP (ViaCEP)
└── imagem/
    ├── logo.jpg
    └── imagem_tranformar.jpg
```

## Tecnologias utilizadas

- **HTML5** semântico (`<header>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<address>`), com atributos de acessibilidade WAI-ARIA (`aria-label`, `aria-labelledby`, `aria-current`, `aria-live`).
- **CSS3 Modular e Responsivo**, estruturado com variáveis (*Custom Properties*), suporte a Dark Mode, CSS Grid, Flexbox e animações fluidas.
- **JavaScript Puro (Vanilla JS)**:
  - `ui.js` — alternância acessível de Dark Mode com persistência (`localStorage`), detecção de preferências do sistema e animação de progresso.
  - `cadastro.js` — validações dinâmicas, máscaras com regex para CPF/Telefone/CEP e consumo assíncrono da API pública ViaCEP.
- **Node.js Pipeline (Build & Minify)** — script `build.js` que processa, empacota e minifica HTML, CSS e JS para a pasta `/dist` (redução média de ~25% no payload).

## Como executar

### Desenvolvimento:
Basta abrir o arquivo `index.html` diretamente no navegador, ou servir a pasta com uma extensão como o *Live Server* do VS Code.

### Compilação para Produção (Build):
Execute o comando abaixo para gerar a pasta `/dist` otimizada e minificada:
```bash
npm run build
```

## Deploy em Produção

O projeto está publicado e acessível publicamente através da **Vercel**:
🔗 **[https://faculdade-ong.vercel.app](https://faculdade-ong.vercel.app)**

## Autor

Kauam — [github.com/kkauam](https://github.com/kkauam)
