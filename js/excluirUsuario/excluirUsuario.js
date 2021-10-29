btnExcluirUsuario.addEventListener('click', function (e) {
    e.preventDefault();

    // Enviando formulário para o back-end  
    const request = new XMLHttpRequest();

    let data = { id: 1 }

    data = JSON.stringify(data)

    request.open('DELETE', 'http://localhost:3000/usuario');
    request.setRequestHeader("Content-Type", "application/json");
    request.send(data)
})