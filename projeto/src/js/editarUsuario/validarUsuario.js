const request = new XMLHttpRequest();

request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200 && request.responseURL === "http://localhost:3000/js/getDados") {
        const usuario = (JSON.parse(request.response))
        document.querySelector('.cta h3').textContent = `${usuario.nomeUsuario}`
        document.getElementsByName("nomeCompleto")[0].value = `${usuario.nomeUsuario}`
        document.getElementsByName("emailUsuario")[0].value = `${usuario.emailUsuario}`
    }
}

request.open('GET', '/js/getDados');
request.setRequestHeader("Content-Type", "application/json");
request.send()

class Validacao {
    constructor() {
        this.validations = [
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-only-letters',
            'data-equal',
            'data-password-validate'
        ]
    }

    // iniciar a validação de todos os campos
    validate(form) {

        // resgata todas validações
        let currentValidations = document.querySelectorAll('form .error-validation')

        if (currentValidations.length > 0) {
            this.cleanValidations(currentValidations);
        }

        // pegar os inputs
        let inputs = form.getElementsByTagName('input')

        // HTMLCollection -> array
        let inputsArray = [...inputs]

        // loop nos inputs e validação mediante ao que for encontrado
        inputsArray.forEach(function (input) {

            // loop em todas as validações existentes
            for (let i = 0; this.validations.length > i; i++) {
                // verifica se a validação atual existe no input
                if (input.getAttribute(this.validations[i]) !== null) {
                    //limpando a string para virar um método
                    let method = this.validations[i].replace('data-', '').replace('-', '')

                    // valor do input
                    let value = input.getAttribute(this.validations[i])

                    // invocar o método
                    this[method](input, value)
                }
            }
        }, this)
    }

    // verifica se o input tem um número mínimo de caracteres
    minlength(input, minValue) {
        let inputLength = input.value.length;

        let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres!`

        if (inputLength < minValue) {
            this.printMessage(input, errorMessage)
        }
    }

    // verifica se o input passou do limite de caracteres   
    maxlength(input, maxValue) {
        let inputLength = input.value.length;

        let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres!`

        if (inputLength > maxValue) {
            this.printMessage(input, errorMessage)
        }
    }

    // valida e-mails
    emailvalidate(input) {

        // email@email.com -> email@email.com.br
        let re = /\S+@\S+\.\S+/;

        let email = input.value;

        let errorMessage = `Insira um e-mail válido!`

        if (!re.test(email)) {
            this.printMessage(input, errorMessage)
        }
    }

    // valida se o campo tem apenas letras
    onlyletters(input) {
        let re = /(?=^.{2,60}$)^[A-ZÀÁÂĖÈÉÊÌÍÒÓÔÕÙÚÛÇ´][a-zàáâãèéêìíóôõùúç´]+(?:[ ](?:das?|dos?|de|e|[A-Z][a-z]+))*$/;

        let inputValue = input.value;

        let errorMessage = `Verifique se os dados preenchidos são válidos!`

        if (!re.test(inputValue)) {
            this.printMessage(input, errorMessage)
        }
    }



    // verifica se o input é requerido
    required(input) {
        let inputValue = input.value;

        if (inputValue === '') {
            let errorMessage = `Este campo é obrigatório`

            this.printMessage(input, errorMessage)
        }
    }

    // verifica se dois campos são iguais
    equal(input, inputName) {
        let inputToCompare = document.getElementsByName(inputName)[0]
        let errorMessage = `Este campo precisa estar igual ao ${inputName}`;

        if (inputName === 'senhaUsuarioNova') {
            errorMessage = `Este campo precisa estar igual ao campo senha!`;
        }


        if (input.value != inputToCompare.value) {
            this.printMessage(input, errorMessage)
        }
    }

    // valida o campo senha
    passwordvalidate(input) {
        let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        let inputValue = input.value;

        let errorMessage = `A senha precisa ter ao menos 6 caracteres, uma letra e um número! (Não é permitido caracteres especiais).`

        if (!re.test(inputValue)) {
            this.printMessage(input, errorMessage)
        }
    }

    // método para imprimir mensagens de erro na tela
    printMessage(input, msg) {

        // quantidade de erros
        let errorsQty = input.parentNode.querySelector('.error-validation')

        if (errorsQty === null) {
            let template = document.querySelector('.error-validation').cloneNode(true)

            template.textContent = msg;

            let inputParent = input.parentNode

            template.classList.remove('template')

            inputParent.appendChild(template);
        }
        if (errorsQty !== null) {
            document.body.style.height = '114vh'
        }
    }

    // limpa as validações da tela
    cleanValidations(validations) {
        validations.forEach(el => el.remove())
    }
}

let btnCadastro = document.getElementById('btnCadastro')

let validator = new Validacao();

// evento que dispara as validações
btnEditarUsuario.addEventListener('click', function (e) {
    e.preventDefault();

    let form = document.getElementById('formEditarUsuario')

    validator.validate(form);
    // Validando dados
    if (document.querySelectorAll('.error-validation').length === 1) {
        // Enviando formulário para o back-end

        let data = {
            nomeCompleto: document.querySelector('input[name="nomeCompleto"]').value,
            senhaUsuario: document.querySelector('input[name="senhaUsuarioAtual"]').value,
            senhaUsuarioNova: document.querySelector('input[name="senhaUsuarioNova"]').value,
            emailUsuario: document.querySelector('input[name="emailUsuario"]').value
        }

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200 && request.responseURL === "http://localhost:3000/usuario") {
                setTimeout(function () {
                    if (request.responseText === "sucess") {
                        alert('Dados alterados com sucesso!')
                        window.location.href = "/login";
                    }
                }, 250);
                setTimeout()
            }
        }

        data = JSON.stringify(data)
        console.log(data)
        request.open('POST', 'http://localhost:3000/usuario');
        request.setRequestHeader("Content-Type", "application/json");
        request.send(data)
    }
})

let btnExcluirUsuario = document.getElementById('btnExcluirUsuario')

btnExcluirUsuario.addEventListener('click', function (e) {
    e.preventDefault();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200 && request.responseURL === "http://localhost:3000/usuario") {
            setTimeout(function () {
                if (request.responseText === "sucess") {
                    alert('Usuário excluido com sucesso!')
                    window.location.href = "/login";
                }
            }, 250);
            setTimeout()
        }
    }

    request.open('DELETE', 'http://localhost:3000/usuario');
    request.setRequestHeader("Content-Type", "application/json");
    request.send()
});