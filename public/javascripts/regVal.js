let regForm = document.getElementById("regForm");

let usName = document.getElementById("username");
let usMessage = document.getElementById("usMessage");
let uError = false;

let pWord = document.getElementById("password");
let pwMessage = document.getElementById("pwMessage");
let pError = false;

let p2Word = document.getElementById("password2");
let pw2Message = document.getElementById("pw2Message");
let p2Error = false;

let sBtn = document.getElementById("sBtn");

regForm.addEventListener('input', function (evt) {
    valU();
    valP();
    valP2();

    if(!uError && !pError && !p2Error) 
        // sBtn.style.display = "block";
        sBtn.disabled = false;
    else
        sBtn.disabled = true;
        // sBtn.style.display = "none";
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

valP2 = function() {
    p2Error = false;
    let value1 = pWord.value;
    let value2 = p2Word.value;
    let message = "";
    if(value2.length !== 0) {
        if(value1 !== value2) {
            message += "-Password do not match";
            p2Error = true;
        }
    } else {
        p2Error = true;
    }
    pw2Message.innerHTML = message;
    if(message !== "") 
        pw2Message.style.display = "block";
    else
        pw2Message.style.display = "none";
}