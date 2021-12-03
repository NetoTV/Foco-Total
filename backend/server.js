const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');

app.use(bodyParser.json({ extend: true }))

const RedisStore = connectRedis(session)

//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_foco_total',
    password: 'admin'
});

app.get('/verificarLogin', (req, res) => {
    const sess = req.session;
    console.log('não aconteceu nada')
    if (sess.emailUsuario && sess.senhaUsuario) {
        console.log('entrando no if')
        if (sess.emailUsuario) {
            console.log('logado')
            res.end('sucess')
        } else {
            console.log('deslogado')
            res.end('unlogged')
        }
    }
})

app.post('/login', (req, res) => {
    const sess = req.session;
    const { emailUsuario, senhaUsuario } = req.body
    sess.emailUsuario = emailUsuario
    sess.senhaUsuario = senhaUsuario

    if (validarDados('Pedro Henrique', sess.senhaUsuario, sess.emailUsuario, 'on')) {
        //Mandar para o banco de dados
        console.log('Passou em todos testes')
        connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = `select emailUsuario, senhaUsuario from tb_usuarios
            where emailUsuario = '${sess.emailUsuario}' && senhaUsuario = '${sess.senhaUsuario}' ;`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                try {
                    if (sess.emailUsuario === result[0].emailUsuario && sess.senhaUsuario === result[0].senhaUsuario) {
                        console.log("Login realizado com sucesso!");
                        res.end("sucess")
                    }
                } catch (e) {
                    console.log('Dados inválidos!');
                    res.end("invalidData");
                    console.log(e);
                }
            });
        });
    }
});

app.post('/usuario', (req, res) => {
    const dadosUsuario = req.body;
    const idUsuario = dadosUsuario.id;
    const nomeUsuario = dadosUsuario.nomeCompleto;
    const senhaUsuario = dadosUsuario.senhaUsuario;
    const emailUsuario = dadosUsuario.emailUsuario;
    const termosDeUso = 'on';
    if (validarDados(nomeUsuario, senhaUsuario, emailUsuario, termosDeUso)) {
        //Mandar para o banco de dados
        console.log('Passou em todos testes');
        console.log(`id: ${idUsuario}, nome: ${nomeUsuario}, senha: ${senhaUsuario}, email: ${emailUsuario}`);
    }
    res.end()
})

app.delete('/usuario', (req, res) => {
    const dadosUsuario = req.body;
    const idUsuario = dadosUsuario.id;
    console.log(`id: ${idUsuario}`)
    res.end()
})

app.post('/usuarios', (req, res) => {
    const dadosUsuario = req.body;
    const nomeUsuario = dadosUsuario.nomeCompleto;
    const senhaUsuario = dadosUsuario.senhaUsuario;
    const emailUsuario = dadosUsuario.emailUsuario;
    const termosDeUso = dadosUsuario.termosDeUso;
    if (validarDados(nomeUsuario, senhaUsuario, emailUsuario, termosDeUso)) {
        //Mandar para o banco de dados
        console.log('Passou em todos testes')
        // console.log(nomeUsuario, senhaUsuario, emailUsuario, termosDeUso)
        connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = `INSERT INTO tb_usuarios (nomeUsuario, emailUsuario, senhaUsuario) VALUES ('${nomeUsuario}', '${emailUsuario}', '${senhaUsuario}')`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Linha inserida com sucesso!");
            });
        });

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