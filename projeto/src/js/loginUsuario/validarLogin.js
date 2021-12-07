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

        if (inputName === 'senhaUsuario') {
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

    validarContrato() {
        const termoDeUso = document.querySelector('input[name="termosDeUso"]')

        if (termoDeUso.checked === false) {
            let errorMessage = `Você precisa aceitar os Termos de Uso para poder se cadastrar!`
            this.printMessage(termoDeUso, errorMessage)
        } else if (termoDeUso.checked === true) {
            return true;
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
    }

    // limpa as validações da tela
    cleanValidations(validations) {
        validations.forEach(el => el.remove())
    }
}

let btnLogins = document.getElementById('btnLogins')

let validator = new Validacao();

// evento que dispara as validações
btnLogins.addEventListener('click', function (e) {
    e.preventDefault();
    let form = document.getElementById('formLoginUsuario')
    validator.validate(form);
    // Validando dados
    if (document.querySelectorAll('.error-validation').length === 1) {
        // Enviando formulário para o back-end  
        const request = new XMLHttpRequest();

        let data = {
            emailUsuario: document.querySelector('input[name="emailUsuario"]').value,
            senhaUsuario: document.querySelector('input[name="senhaUsuario"]').value,
        }

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                if (request.responseText === "sucess") {
                    window.location.href = "/";
                } else if (request.response === "dataInvalid") {
                    let template = document.querySelector('.error-validation').cloneNode(true)
                    template.textContent = "Dados inválidos!";
                    let inputParent = document.querySelector('input[name="senhaUsuario"]').parentNode
                    template.classList.remove('template')
                    inputParent.appendChild(template);
                }
            }
        }

        data = JSON.stringify(data)
        console.log(data)
        request.open('POST', 'http://localhost:3000/login');
        request.setRequestHeader("Content-Type", "application/json");
        request.send(data)
    }
})