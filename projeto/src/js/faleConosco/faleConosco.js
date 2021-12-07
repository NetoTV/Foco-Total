if (!document.querySelector('div.action').hasAttribute('hidden')) {
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200 && request.responseURL === "http://localhost:3000/js/getDados") {
            const usuario = (JSON.parse(request.response))
            document.querySelector('.cta h3').textContent = `${usuario.nomeUsuario}`
            document.querySelector('input[name="nomeUsuario"]').value = `${usuario.nomeUsuario}`
            document.querySelector('input[name="emailContato"]').value = `${usuario.emailUsuario}`
        }
    }

    request.open('GET', '/js/getDados');
    request.setRequestHeader("Content-Type", "application/json");
    request.send()
}

let btnEnviarFormulario = document.getElementById('btnEnviarFormulario')

// evento que dispara as validações
btnEnviarFormulario.addEventListener('click', function (e) {
    e.preventDefault();
    const request = new XMLHttpRequest();
    // Validando dados
    if (document.querySelectorAll('.error-validation').length === 1) {
        // Enviando formulário para o back-end

        let data = {
            nomeUsuario: document.querySelector('input[name="nomeUsuario"]').value,
            emailContato: document.querySelector('input[name="emailContato"]').value,
            assuntoContato: document.querySelector('input[name="assuntoContato"]').value,
            descricaoContato: document.querySelector('textarea[name="descricaoContato"]').value
        }

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200 && request.responseURL === "http://localhost:3000/faleConosco") {
                setTimeout(function () {
                    if (request.responseText === "sucess") {
                        alert('Formulário enviado com sucesso!')
                        window.location.href = "/";
                    }
                }, 250);
                setTimeout(0)
            }
        }

        data = JSON.stringify(data)
        request.open('POST', 'http://localhost:3000/faleConosco');
        request.setRequestHeader("Content-Type", "application/json");
        request.send(data)
    }
})

let btnLimparFormulario = document.getElementById('btnLimparFormulario')

btnLimparFormulario.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector('input[name="nomeUsuario"]').value = ''
    document.querySelector('input[name="emailContato"]').value = ''
    document.querySelector('input[name="assuntoContato"]').value = ''
    document.querySelector('textarea[name="descricaoContato"]').value = ''

    document.querySelector('input[name="nomeUsuario"]').focus()
});