let currentScrollPos = window.pageYOffset;
if (currentScrollPos < 70) {
    document.getElementById("headerComControle").style.top = "0";
} else if (currentScrollPos > 140) {
    document.getElementById("headerComControle").style.top = "-200px";
}

else {
    document.getElementById("headerComControle").style.top = "-180px";
}
prevScrollpos = currentScrollPos;

window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;
    if (currentScrollPos < 70) {
        document.getElementById("headerComControle").style.top = "0";
    } else if (currentScrollPos > 140) {
        document.getElementById("headerComControle").style.top = "-200px";
    }

    else {
        document.getElementById("headerComControle").style.top = "-180px";
    }
    prevScrollpos = currentScrollPos;
}