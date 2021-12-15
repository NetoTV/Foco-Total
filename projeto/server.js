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
        maxAge: 1000 * 60 * 10 * 6 * 24 // session max age in miliseconds
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

// app.get('/', (req, res) => {
//     const sess = req.session;
//     console.log('não aconteceu nada')
//     if (sess.emailUsuario && sess.senhaUsuario) {
//         console.log('entrando no if')
//         if (sess.emailUsuario) {
//             res.write(`<h1>Welcome ${sess.emailUsuario} </h1><br>`)
//             console.log('logado')
//             res.end('sucess')
//         }
//     } else {
//         res.sendFile(__dirname + "/src/telas/usuarios/loginUsuario.html")
//     }
// })

app.get('/', (req, res) => {
    const sess = req.session;
    if (sess.emailUsuario && sess.senhaUsuario) {
        if (sess.emailUsuario) {
            res.sendFile(__dirname + "/src/telas/usuarios/index.html")
        }
    } else {
        res.sendFile(__dirname + "/src/telas/usuarios/index.html")
    }
})

// GET DE STYLES
app.get('/css/styleHome', (req, res) => {
    res.sendFile(__dirname + "/src/css/styleHome.css")
})

app.get('/css/styleLogin', (req, res) => {
    res.sendFile(__dirname + "/src/css/stylelogin.css")
})

app.get('/css/styles', (req, res) => {
    res.sendFile(__dirname + "/src/css/styles.css")
})

app.get('/css/styleMenuLogado', (req, res) => {
    res.sendFile(__dirname + "/src/css/styleMenuLogado.css")
})
// GET DE IMAGES

app.get('/img/logo', (req, res) => {
    res.sendFile(__dirname + "/src/images/logo.png")
})

app.get('/img/homeImage', (req, res) => {
    res.sendFile(__dirname + "/src/images/homeImage.png")
})

// icone de usuario
app.get('/img/userImage', (req, res) => {
    res.sendFile(__dirname + "/src/images/menu-lateral/user.png")
})

app.get('/img/userLogOut', (req, res) => {
    res.sendFile(__dirname + "/src/images/menu-lateral/log-out.png")
})

app.get('/img/question', (req, res) => {
    res.sendFile(__dirname + "/src/images/menu-lateral/question.png")
})

app.get('/img/editData', (req, res) => {
    res.sendFile(__dirname + "/src/images/menu-lateral/edit.png")
})

app.get('/img/defaultUserProfile', (req, res) => {
    res.sendFile(__dirname + "/src/images/menu-lateral/default_user-profile.png")
})

// GET DE LOGIN

app.get('/login', (req, res) => {
    const sess = req.session;
    if (sess.emailUsuario && sess.senhaUsuario) {
        if (sess.emailUsuario) {
            res.sendFile(__dirname + "/src/telas/usuarios/index.html")
        }
    } else {
        res.sendFile(__dirname + "/src/telas/usuarios/loginUsuario.html")
    }
})

app.get('/js/validarLogin', (req, res) => {
    res.sendFile(__dirname + "/src/js/loginUsuario/validarLogin.js")
})

// GET DESLOGAR

app.get('/js/deslogarUsuario', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect("/")
    });
})

// GET CADASTRAR-SE

app.get('/cadastrar', (req, res) => {
    const sess = req.session;
    if (sess.emailUsuario && sess.senhaUsuario) {
        if (sess.emailUsuario) {
            res.sendFile(__dirname + "/src/telas/usuarios/minhasTarefas.html")
        }
    } else {
        res.sendFile(__dirname + "/src/telas/usuarios/cadastroDeUsuarios.html")
    }
})

app.get('/js/validarCadastro', (req, res) => {
    res.sendFile(__dirname + "/src/js/cadastroDeUsuarios/validarCadastro.js")
})

// GET EDITAR USUARIO

app.get('/editarUsuario', (req, res) => {
    const sess = req.session;
    console.log(sess)
    if (sess.emailUsuario && sess.senhaUsuario) {
        if (sess.emailUsuario) {
            res.sendFile(__dirname + "/src/telas/usuarios/editarUsuario.html")
        }
    } else {
        res.sendFile(__dirname + "/src/telas/usuarios/loginUsuario.html")
    }
})

app.get('/js/validarUsuario', (req, res) => {
    res.sendFile(__dirname + "/src/js/editarUsuario/validarUsuario.js")
})

app.get('/js/excluirUsuario', (req, res) => {
    res.sendFile(__dirname + "/src/js/excluirUsuario/excluirUsuario.js")
})

// GET FALE CONOSCO

app.get('/js/faleConosco', (req, res) => {
    res.sendFile(__dirname + "/src/js/faleConosco/faleConosco.js")
})

// GET MINHAS TAREFAS

app.get('/minhasTarefas', (req, res) => {
    const sess = req.session;
    if (sess.emailUsuario && sess.senhaUsuario) {
        if (sess.emailUsuario) {
            res.sendFile(__dirname + "/src/telas/usuarios/minhasTarefas.html")
        }
    } else {
        res.sendFile(__dirname + "/src/telas/usuarios/loginUsuario.html")
    }
})

// GET FALE CONOSCO

app.get('/faleConosco', (req, res) => {
    res.sendFile(__dirname + "/src/telas/usuarios/faleconosco.html")
})

// GET CALENDARIO

app.get('/css/evo-calendar', (req, res) => {
    res.sendFile(__dirname + "/src/css/evo-calendar.min.css")
})

app.get('/css/evo-calendar-royal-navy', (req, res) => {
    res.sendFile(__dirname + "/src/css/evo-calendar.royal-navy.min.css")
})

app.get('/js/evo-calendar', (req, res) => {
    res.sendFile(__dirname + "/src/js/calendario/js/evo-calendar.min.js")
})

app.get('/js/controleDeEventos', (req, res) => {
    res.sendFile(__dirname + "/src/js/SistemaDeEventos/controleDeEventos.js")
})

// OUTROS

app.get('/js/controleHeader', (req, res) => {
    res.sendFile(__dirname + "/src/js/outros/controleHeader.js")
})

app.get('/js/verificarLogado', (req, res) => {
    const sess = req.session;
    if (sess.emailUsuario && sess.senhaUsuario) {
        if (sess.emailUsuario) {
            res.sendFile(__dirname + "/src/js/loginUsuario/verificarLogado.js")
        }
    } else {
        res.end()
    }
})

app.get('/js/verificarLogadoEditarUsuario', (req, res) => {
    const sess = req.session;
    if (sess.emailUsuario && sess.senhaUsuario) {
        if (sess.emailUsuario) {
            res.sendFile(__dirname + "/src/js/editarUsuario/verificarLogadoEditar.js")
        }
    } else {
        res.end()
    }
})

app.get('/js/getDados', (req, res) => {
    const sess = req.session;
    if (sess.emailUsuario && sess.senhaUsuario) {
        if (sess.emailUsuario) {
            connection.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");
                let sql = `select emailUsuario, nomeUsuario from tb_usuarios
                where emailUsuario = '${sess.emailUsuario}';`;
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    try {
                        if (sess.emailUsuario === result[0].emailUsuario) {
                            res.json({
                                nomeUsuario: `${result[0].nomeUsuario}`,
                                emailUsuario: `${result[0].emailUsuario}`
                            });
                        }
                    } catch (e) {
                        console.log(e);
                        res.end();
                    }
                });
            });
        }
    } else {
        res.end()
    }
})

app.post('/login', (req, res) => {
    const sess = req.session;
    const { emailUsuario, senhaUsuario } = req.body

    if (validarDados('Pedro Henrique', senhaUsuario, emailUsuario, 'on')) {
        //Mandar para o banco de dados
        console.log('Passou em todos testes')
        connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            let sql = `select emailUsuario, senhaUsuario from tb_usuarios
            where emailUsuario = '${emailUsuario}' && senhaUsuario = '${senhaUsuario}' ;`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                try {
                    if (emailUsuario === result[0].emailUsuario && senhaUsuario === result[0].senhaUsuario) {
                        console.log("Login realizado com sucesso!");
                        sess.emailUsuario = emailUsuario
                        sess.senhaUsuario = senhaUsuario
                        res.end('sucess')
                    }
                } catch (e) {
                    console.log('Dados inválidos!');
                    res.end('dataInvalid');
                    console.log(e);
                }
            });
        });
    }
});

app.post('/faleConosco', (req, res) => {
    const dados = req.body
    if (dados.nomeUsuario && dados.emailContato && dados.assuntoContato && dados.descricaoContato) {
        res.end('sucess')
    }
})

app.get('/js/getTarefas', (req, res) => {
    const sess = req.session;

    connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = `select * from tb_usuarios
        where emailUsuario = '${sess.emailUsuario}';`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            try {
                if (result.length > 0) {
                    connection.connect(function (err) {
                        if (err) throw err;
                        console.log("Connected!");
                        let sql = `select * from tb_tarefas
                        where idUsuario = '${result[0].idUsuario}';`;
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            try {
                                if (result.length > 0) {
                                    let dadosFormatados = []
                                    result.forEach((elemento, indice) => {
                                        let myDate = new Date(result[indice].dataAgenda);
                                        let dataAgendaFormatada = (myDate.getMonth() + 1) + '/' + myDate.getDate() + '/' + myDate.getFullYear()

                                        dadosFormatados[indice] = {
                                            idTarefa: elemento.idTarefa,
                                            nomeTarefa: elemento.nomeTarefa,
                                            descricao: elemento.descricao,
                                            dataAgenda: dataAgendaFormatada
                                        }
                                    })
                                    res.send(JSON.stringify(dadosFormatados))
                                }
                            } catch (e) {
                                console.log(e);
                                res.end();
                            }
                        });
                    });
                }
            } catch (e) {
                console.log(e);
                res.end();
            }
        });
    });
})

app.post('/novaTarefa', (req, res) => {
    const dados = req.body;
    const sess = req.session;
    const nomeEvento = dados.nomeEvento;
    const descricaoEvento = dados.descricaoEvento;
    const dataCriacao = dados.dataCriacao;
    const dataAgenda = dados.dataAgenda;
    console.log(dataAgenda)
    const diaAgenda = dataAgenda.slice(3, 5)
    const mesAgenda = dataAgenda.slice(0, 2)
    const anoAgenda = dataAgenda.slice(6, 10)
    const dataAgendaFormatada = `${anoAgenda}-${mesAgenda}-${diaAgenda}`
    const diaCriacao = dataCriacao.slice(3, 5)
    const mesCriacao = dataCriacao.slice(0, 2)
    const anoCriacao = dataCriacao.slice(6, 10)
    const dataCriacaoFormatada = `${anoCriacao}-${mesCriacao}-${diaCriacao}`
    console.log(sess.emailUsuario)

    connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = `select * from tb_usuarios
        where emailUsuario = '${sess.emailUsuario}';`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            try {
                if (result.length > 0) {
                    if (sess.emailUsuario === result[0].emailUsuario) {
                        let sql = `INSERT INTO tb_tarefas (nomeTarefa, descricao, dataCriacao, dataAgenda, idUsuario) VALUES ('${nomeEvento}', '${descricaoEvento}', '${dataCriacaoFormatada}', '${dataAgendaFormatada}', '${result[0].idUsuario}')`;
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            res.end('sucess')
                        })
                    }
                }
            } catch (e) {
                console.log(e);
                res.end();
            }
        });
    });
})

app.delete('/deletarTarefa', (req, res) => {
    const sess = req.session;
    const dados = req.body;

    connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = `select * from tb_tarefas
        where idTarefa = ${dados.idEvento};`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                try {
                    if (dados.idEvento == result[0].idTarefa) {
                        let sql = `delete from tb_tarefas where idTarefa = '${dados.idEvento}';`
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            res.end('sucess')
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
            }
            // try {
            //     if (result.length > 0) {
            //         if (dados.idEvento == result[0].idTarefa) {
            //             console.log('aqui')
            //             let sql = `delete * from tb_tarefas
            //             where idTarefa = ${dados.idEvento};`
            //             connection.query(sql, function (err, result) {
            //                 if (err) throw err;
            //                 res.end('sucess')
            //             })
            //         }
            //     }
            // } catch (e) {
            //     console.log(e);
            //     res.end();
            // }
        });
    });
})

app.post('/usuario', (req, res) => {
    const sess = req.session;
    const dadosUsuario = req.body;
    const nomeUsuario = dadosUsuario.nomeCompleto;
    const senhaUsuario = dadosUsuario.senhaUsuario;
    const senhaUsuarioNova = dadosUsuario.senhaUsuarioNova;
    const emailUsuario = dadosUsuario.emailUsuario;
    const termosDeUso = 'on';

    if (senhaUsuarioNova !== '') {
        if (validarDados(nomeUsuario, senhaUsuarioNova, emailUsuario, termosDeUso)) {
            if (validarDados(nomeUsuario, senhaUsuario, emailUsuario, termosDeUso)) {
                connection.connect(function (err) {
                    if (err) throw err;
                    console.log("Connected!");
                    let sql = `select emailUsuario, senhaUsuario from tb_usuarios
                    where emailUsuario = '${sess.emailUsuario}' && senhaUsuario = '${senhaUsuario}';`;
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        try {
                            if (sess.emailUsuario === result[0].emailUsuario && senhaUsuario === result[0].senhaUsuario) {
                                sql = `UPDATE tb_usuarios set nomeUsuario = '${nomeUsuario}', senhaUsuario = '${senhaUsuarioNova}', emailUsuario = '${emailUsuario}' WHERE emailUsuario = '${sess.emailUsuario}';`
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;
                                    req.session.destroy(err => {
                                        if (err) {
                                            return console.log(err);
                                        }
                                    });
                                    res.end('sucess')
                                })
                            }
                        } catch (e) {
                            console.log(e);
                            res.end();
                        }
                    });
                });
            }
        }
    } else {
        if (validarDados(nomeUsuario, senhaUsuario, emailUsuario, termosDeUso)) {
            connection.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");
                let sql = `select emailUsuario, senhaUsuario from tb_usuarios
                where emailUsuario = '${sess.emailUsuario}' && senhaUsuario = '${senhaUsuario}';`;
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    try {
                        if (sess.emailUsuario === result[0].emailUsuario && senhaUsuario === result[0].senhaUsuario) {
                            sql = `UPDATE tb_usuarios set nomeUsuario = '${nomeUsuario}', emailUsuario = '${emailUsuario}' WHERE emailUsuario = '${sess.emailUsuario}';`
                            connection.query(sql, function (err, result) {
                                if (err) throw err;
                                req.session.destroy(err => {
                                    if (err) {
                                        return console.log(err);
                                    }
                                });
                                res.end('sucess')
                            })
                        }
                    } catch (e) {
                        console.log(e);
                        res.end()
                    }
                });
            });
        }
    }
})

app.delete('/usuario', (req, res) => {
    const sess = req.session;
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        let sql = `select emailUsuario from tb_usuarios
        where emailUsuario = '${sess.emailUsuario}';`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            try {
                if (sess.emailUsuario === result[0].emailUsuario) {
                    sql = `delete from tb_usuarios
                    where emailUsuario = '${sess.emailUsuario}';`
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        req.session.destroy(err => {
                            if (err) {
                                return console.log(err);
                            }
                        });
                        res.end('sucess')
                    })
                }
            } catch (e) {
                console.log(e);
                res.end();
            }
        });
    });
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
        connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            let sql = `select emailUsuario from tb_usuarios
            where emailUsuario = '${emailUsuario}'`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                if (result.length === 0) {
                    connection.connect(function (err) {
                        if (err) throw err;
                        console.log("Connected!");
                        let sql = `INSERT INTO tb_usuarios (nomeUsuario, emailUsuario, senhaUsuario) VALUES ('${nomeUsuario}', '${emailUsuario}', '${senhaUsuario}')`;
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log("Usuário criado com sucesso!");
                            res.end('sucess')
                        });
                    });
                } else {
                    res.end('alreadyExist')
                }
            });
        });
    }
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