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
├── index.html
├── projetos.html
├── cadastro.html
├── css/
│   └── style.css
├── js/
│   ├── ui.js
│   └── cadastro.js
└── imagem/
    ├── logo.jpg
    └── imagem_tranformar.jpg
```

## Tecnologias utilizadas

- **HTML5** semântico (`<header>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<address>`), com atributos de acessibilidade (`aria-label`, `aria-labelledby`, `aria-current`).
- **CSS3**, com variáveis (custom properties), grid, animações e design responsivo.
- **JavaScript puro (vanilla)**, sem frameworks:
  - `ui.js` — anima as barras de progresso dos projetos.
  - `cadastro.js` — aplica máscaras de CPF, telefone e CEP, valida o formulário e busca o endereço automaticamente a partir do CEP usando a API pública ViaCEP.

## Como executar

Não há dependências nem processo de build. Basta abrir o arquivo `index.html` diretamente no navegador, ou servir a pasta com uma extensão como o *Live Server* do VS Code.

## Autor

Kauam — [github.com/kkauam](https://github.com/kkauam)
