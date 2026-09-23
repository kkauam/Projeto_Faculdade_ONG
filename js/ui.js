(function () {
    document.querySelectorAll(".progresso span").forEach(function (barra) {
        const meta = barra.getAttribute("data-meta") || "70";
        barra.style.setProperty("--meta", meta + "%");
    });
})();
