let btn = document.getElementById("messageCancel");
let msg = document.getElementById("msgPanel");
let fade;
let grace;


function cancelFade() {
    clearTimeout(fade);
    // Remove the event handler from the msgPanel
    msg.removeEventListener("mousemove", cancelFade);
}

grace = setTimeout(function(){
    // Attach an event handler to the msgPanel
    msg.addEventListener("mousemove", cancelFade);
    fade = setTimeout(function(){
        msg.style.display = "none";
        msg.removeEventListener("mousemove", cancelFade);
    }, 4000);
}, 1000);


btn.addEventListener('click', function (evt) {
    clearTimeout(fade);
    clearTimeout(grace);
    msg.removeEventListener("mousemove", cancelFade);
    msg.style.display = "none";
});