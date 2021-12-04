document.querySelector('button[id="btnLogin"]').disabled = true
document.querySelector('button[id="btnLogin"]').hidden = true
document.querySelector('button[id="btnCadastro"]').disabled = true
document.querySelector('button[id="btnCadastro"]').hidden = true

// const request = new XMLHttpRequest();

// request.onreadystatechange = function () {
//     if (request.readyState == 4 && request.status == 200) {
//         console.log('teste')
//         if (request.responseText === "sucess") {
//             console.log('sucesso')
//         }
//     }
// }

// request.open('GET', 'http://localhost:3000/verificarLogin');
// request.setRequestHeader("Content-Type", "application/json");
// request.send()