try {
    document.querySelector('button[id="btnLogin"]').disabled = true
    document.querySelector('button[id="btnLogin"]').hidden = true
    document.querySelector('button[id="btnCadastro"]').disabled = true
    document.querySelector('button[id="btnCadastro"]').hidden = true
    document.querySelector('header').style = "padding: 30px 20%;"
    document.querySelector('.action').disabled = false
    document.querySelector('.action').hidden = false
} catch (err) {
    console.log(err)
}

function menuToggle() {
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active')
    if (window.location.href === 'http://localhost:3000/') {
        if (toggleMenu.classList[1] === 'active') {
            document.querySelector('section img').style = "top: 40%";
        } else {
            document.querySelector('section img').style = "top: 30%";
        }
    }
}
