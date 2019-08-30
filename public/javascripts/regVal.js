let regForm = document.getElementById("regForm");

let usName = document.getElementById("username");
let usMessage = document.getElementById("usMessage");
let uError = false;

let pWord = document.getElementById("password");
let pwMessage = document.getElementById("pwMessage");
let pError = false;

let sBtn = document.getElementById("sBtn");

regForm.addEventListener('input', function (evt) {
    valU();
    valP();

    if(!pError && !uError) 
        sBtn.style.display = "block";
    else
        sBtn.style.display = "none";
});

valU = function() {
    uError = false;
    let value = usName.value;
    let message = "";
    if(value.length !== 0) {
        if(value.length < 4 || value.length > 15) {
            message += "-Must be 4-15 characters long";
            uError = true;
        } else {
            if(value.charAt(0).match(/^[a-z]+$/ig) === null) {
                message += "-Username must start with a letter\n";
                uError = true;
            } else if(value.match(/^[a-z][a-z\d]+$/ig) === null) {
                message += "-Symbols/Spaces not allowed";
                uError = true;
            } 
        }
    } else {
        uError = true;
    }
    usMessage.innerHTML = message;
    if(message !== "") 
        usMessage.style.display = "block";
    else
        usMessage.style.display = "none";
}

valP = function() {
    pError = false;
    let value = pWord.value;
    let message = "";
    if(value.length !== 0) {
        if(value.length < 8) {
            message += "-Password too short. 8+ characters\n";
            pError = true;
        }
        if(value.search(/\d/) === -1) {
            message += "-Must contain at least one number\n";
            pError = true;
        }
        if(value.search(/[A-Z]/) === -1) {
            message += "-Must contain at least one uppercase letter\n";
            pError = true;
        }
    } else {
        pError = true;
    }
    pwMessage.innerHTML = message;
    if(message !== "") 
        pwMessage.style.display = "block";
    else
        pwMessage.style.display = "none";
}