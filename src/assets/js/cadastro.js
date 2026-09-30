(function () {
    const form = document.getElementById("form-engajamento");
    if (!form) return;

    form.noValidate = true;

    const campos = {
        nome: document.getElementById("nome"),
        cpf: document.getElementById("cpf"),
        telefone: document.getElementById("telefone"),
        cep: document.getElementById("cep"),
        endereco: document.getElementById("endereco"),
    };

    const config = {
        nome: {
            placeholder: "Seu nome completo",
            minlength: 3,
        },
        cpf: {
            placeholder: "000.000.000-00",
            maxlength: 14,
            mascara: mascaraCpf,
            padrao: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            mensagem: "Informe o CPF no formato 000.000.000-00.",
        },
        telefone: {
            placeholder: "(00) 00000-0000",
            maxlength: 15,
            mascara: mascaraTelefone,
            padrao: /^\(\d{2}\) \d{4,5}-\d{4}$/,
            mensagem: "Informe o telefone no formato (00) 00000-0000.",
        },
        cep: {
            placeholder: "00000-000",
            maxlength: 9,
            mascara: mascaraCep,
            padrao: /^\d{5}-\d{3}$/,
            mensagem: "Informe o CEP no formato 00000-000.",
        },
        endereco: {
            placeholder: "Rua, número, complemento e bairro",
        },
    };

    function somenteDigitos(valor) {
        return valor.replace(/\D/g, "");
    }

    function mascaraCpf(valor) {
        const d = somenteDigitos(valor).slice(0, 11);
        return d
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function mascaraTelefone(valor) {
        const d = somenteDigitos(valor).slice(0, 11);
        if (d.length <= 10) {
            return d
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        }
        return d
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    }

    function mascaraCep(valor) {
        const d = somenteDigitos(valor).slice(0, 8);
        return d.replace(/(\d{5})(\d)/, "$1-$2");
    }

    function aplicarMascara(input, formatar) {
        input.addEventListener("input", function () {
            const inicio = this.selectionStart;
            const antes = this.value.length;
            this.value = formatar(this.value);
            const depois = this.value.length;
            this.setSelectionRange(inicio + (depois - antes), inicio + (depois - antes));
        });
    }

    Object.keys(config).forEach(function (id) {
        const input = campos[id];
        const regra = config[id];

        input.required = true;
        if (regra.placeholder) input.placeholder = regra.placeholder;
        if (regra.maxlength) input.maxLength = regra.maxlength;
        if (regra.minlength) input.minLength = regra.minlength;
        if (regra.mascara) aplicarMascara(input, regra.mascara);
    });

    const mensagem = document.createElement("p");
    mensagem.setAttribute("role", "status");
    mensagem.setAttribute("aria-live", "polite");
    form.appendChild(mensagem);

    function mostrarMensagem(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.className = tipo === "erro" ? "feedback-erro" : "feedback-ok";
    }

    function validarCampo(id) {
        const input = campos[id];
        const regra = config[id];
        const valor = input.value.trim();

        if (!valor) {
            input.setCustomValidity("Preencha este campo.");
            return false;
        }

        if (regra.minlength && valor.length < regra.minlength) {
            input.setCustomValidity("Informe pelo menos " + regra.minlength + " caracteres.");
            return false;
        }

        if (regra.padrao && !regra.padrao.test(valor)) {
            input.setCustomValidity(regra.mensagem);
            return false;
        }

        input.setCustomValidity("");
        return true;
    }

    async function buscarEnderecoPorCep() {
        const cep = somenteDigitos(campos.cep.value);
        if (cep.length !== 8) return;

        campos.endereco.placeholder = "Buscando endereço...";

        try {
            const resposta = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
            const dados = await resposta.json();

            if (dados.erro) {
                mostrarMensagem("CEP não encontrado. Preencha o endereço manualmente.", "erro");
                return;
            }

            const partes = [dados.logradouro, dados.bairro, dados.localidade, dados.uf].filter(Boolean);
            if (partes.length) {
                campos.endereco.value = partes.join(", ");
                campos.endereco.focus();
            }
            mostrarMensagem("", "ok");
        } catch (erro) {
            mostrarMensagem("Não foi possível consultar o CEP. Preencha o endereço manualmente.", "erro");
        } finally {
            campos.endereco.placeholder = config.endereco.placeholder;
        }
    }

    campos.cep.addEventListener("blur", buscarEnderecoPorCep);

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const ids = Object.keys(config);
        const invalido = ids.find(function (id) {
            return !validarCampo(id);
        });

        if (invalido) {
            campos[invalido].reportValidity();
            mostrarMensagem("Revise os campos destacados antes de enviar.", "erro");
            return;
        }

        mostrarMensagem(
            "Cadastro confirmado, " + campos.nome.value.trim() + "! Em breve a ONG Transformar entra em contato.",
            "ok"
        );
        form.reset();
    });
})();
