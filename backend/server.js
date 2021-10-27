const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json({ extend: true }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/usuarios', (req, res) => {
    const dadosUsuario = req.body;
    const nomeUsuario = dadosUsuario.nomeCompleto;
    const senhaUsuario = dadosUsuario.senhaUsuario;
    const emailUsuario = dadosUsuario.emailUsuario;
    const termosDeUso = dadosUsuario.termosDeUso;
    if (validarDados(nomeUsuario, senhaUsuario, emailUsuario, termosDeUso)) {
        //Mandar para o banco de dados
        console.log('Passou em todos testes')
        console.log(nomeUsuario, senhaUsuario, emailUsuario, termosDeUso)
    }
    res.end()
})

function validarDados(nome, senha, email, termosDeUso) {
    function validarTamanhoNome() {
        const nomeTamanho = nome.length;

        if (nomeTamanho < 50) {
            return true;
        }
        else {
            return false;
        }
    }

    function validarCaracteresNome() {
        {
            const re = /(?=^.{2,60}$)^[A-ZÀÁÂĖÈÉÊÌÍÒÓÔÕÙÚÛÇ´][a-zàáâãèéêìíóôõùúç´]+(?:[ ](?:das?|dos?|de|e|[A-Z][a-z]+))*$/;

            const nomeValor = nome;

            if (re.test(nomeValor)) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    function verificarNullNome() {
        const nomeValor = nome;

        if (nomeValor !== '') {
            return true;
        } else {
            return false;
        }
    }

    function validarCaracteresSenha() {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        const senhaValor = senha;

        if (re.test(senhaValor)) {
            return true;
        } else {
            return false;
        }
    }

    function verificarNullSenha() {
        const senhaValor = senha;

        if (senhaValor !== '') {
            return true;
        } else {
            return false;
        }
    }

    function validarTamanhoMinimoEmail() {
        const emailTamanho = email.length;

        if (emailTamanho > 3) {
            return true;
        } else {
            return false;
        }
    }

    function validarCaracteresEmail() {

        // email@email.com -> email@email.com.br
        const re = /\S+@\S+\.\S+/;

        const emailValor = email;

        if (re.test(emailValor)) {
            return true;
        } else {
            return false;
        }
    }

    function verificarNullEmail() {
        const emailValor = email;

        if (email !== '') {
            return true;
        } else {
            return false;
        }
    }

    function validarContrato() {
        const termosDeUsoValor = termosDeUso;

        if (termosDeUsoValor === 'on') {
            return true;
        } else {
            return false;
        }
    }
    if (validarTamanhoNome() && validarCaracteresNome() && verificarNullNome() && validarCaracteresSenha() && verificarNullSenha() && validarTamanhoMinimoEmail() && validarCaracteresEmail() && verificarNullEmail() && validarContrato()) {
        return true;
    } else {
        console.log('Algo deu errado!')
        return false;
    }
}

app.listen(3000)