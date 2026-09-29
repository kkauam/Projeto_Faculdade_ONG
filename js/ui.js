(function () {
    // 1. Barras de progresso nos projetos
    document.querySelectorAll(".progresso span").forEach(function (barra) {
        const meta = barra.getAttribute("data-meta") || "70";
        barra.style.setProperty("--meta", meta + "%");
    });

    // 2. Gerenciamento do Modo Escuro (Dark Mode)
    const temaSalvo = localStorage.getItem("tema_ong") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro");
    aplicarTema(temaSalvo);

    const btnTema = document.getElementById("btn-tema");
    if (btnTema) {
        atualizarBotaoTema(btnTema, temaSalvo);

        btnTema.addEventListener("click", function () {
            const temaAtual = document.documentElement.getAttribute("data-tema") === "escuro" ? "escuro" : "claro";
            const novoTema = temaAtual === "escuro" ? "claro" : "escuro";
            aplicarTema(novoTema);
            localStorage.setItem("tema_ong", novoTema);
            atualizarBotaoTema(btnTema, novoTema);
        });
    }

    function aplicarTema(tema) {
        if (tema === "escuro") {
            document.documentElement.setAttribute("data-tema", "escuro");
        } else {
            document.documentElement.removeAttribute("data-tema");
        }
    }

    function atualizarBotaoTema(botao, tema) {
        const ehEscuro = tema === "escuro";
        botao.setAttribute("aria-pressed", ehEscuro ? "true" : "false");
        botao.setAttribute("aria-label", ehEscuro ? "Alternar para modo claro" : "Alternar para modo escuro");
        botao.textContent = ehEscuro ? "☀️" : "🌙";
    }
})();
