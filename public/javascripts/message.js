let btn = document.getElementById("messageCancel");
let msg = document.getElementById("msgPanel");

btn.addEventListener('click', function (evt) {
    msg.style.display = "none";
});