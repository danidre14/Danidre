const regForm = document.getElementById("regForm");

const usName = document.getElementById("username");
const usMessage = document.getElementById("usMessage");
let uError = false;

const pWord = document.getElementById("password");
const pwMessage = document.getElementById("pwMessage");
let pError = false;

const p2Word = document.getElementById("password2");
const pw2Message = document.getElementById("pw2Message");
let p2Error = false;

const email = document.getElementById("email");
const email2 = document.getElementById("email2");
const e2Message = document.getElementById("e2Message");
let e2Error = false;

const sBtn = document.getElementById("sBtn");

regForm.addEventListener('input', function (evt) {
    valU();
    valP();
    valP2();
    valE2();

    if(!uError && !pError && !p2Error && !e2Error) 
        sBtn.disabled = false;
    else
        sBtn.disabled = true;
});

const valU = function() {
    uError = false;
    const value = usName.value;
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

const valP = function() {
    pError = false;
    const value = pWord.value;
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

const valP2 = function() {
    p2Error = false;
    const value1 = pWord.value;
    const value2 = p2Word.value;
    let message = "";
    if(value2.length !== 0) {
        if(value1 !== value2) {
            message += "-Passwords do not match";
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

const valE2 = function() {
    e2Error = false;
    const value1 = email.value;
    const value2 = email2.value;
    let message = "";
    if(value2.length !== 0) {
        if(value1 !== value2) {
            message += "-Emails do not match";
            e2Error = true;
        }
    } else {
        e2Error = true;
    }
    e2Message.innerHTML = message;
    if(message !== "") 
        e2Message.style.display = "block";
    else
        e2Message.style.display = "none";
}