window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;
    if (currentScrollPos < 70) {
        document.getElementById("headerComControle").style.top = "0";
    } else {
        document.getElementById("headerComControle").style.top = "-180px";
    }
    prevScrollpos = currentScrollPos;
}