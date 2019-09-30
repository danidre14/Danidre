const regForm = document.getElementById("regForm");

const name = document.getElementById("name");
const formName = document.getElementById("formName");
let nError = false;

const subject = document.getElementById("subject");
const formSubject = document.getElementById("formSubject");
let sError = false;

const message = document.getElementById("message");
const formMessage = document.getElementById("formMessage");
let mError = false;

const sBtn = document.getElementById("sBtn");

regForm.addEventListener('input', function (evt) {
    valN();
    valS();
    valM();

    if(!nError && !sError && !mError) 
        sBtn.disabled = false;
    else
        sBtn.disabled = true;
});

const valN = function() {
    nError = false;
    const value = name.value.trim();
    let msg = "";
    if(value.length !== 0) {
        if(value.length < 3 || value.length > 30) {
            msg += "-Must be 3-30 characters long";
            nError = true;
        } else {
            if(value.charAt(0).match(/^[a-z]+$/ig) === null) {
                msg += "-Name must start with a letter\n";
                nError = true;
            }
        }
    } else {
        nError = true;
    }
    formName.innerHTML = msg;
    if(msg !== "") 
        formName.style.display = "block";
    else
        formName.style.display = "none";
}

const valS = function() {
    sError = false;
    const value = subject.value.trim();
    let msg = "";
    if(value.length !== 0) {
        if(value.length < 5 || value.length > 50) {
            msg += "-Must be 5-50 characters long";
            sError = true;
        } else {
            if(value.charAt(0).match(/^[a-z]+$/ig) === null) {
                msg += "-Subject must start with a letter\n";
                sError = true;
            }
        }
    } else {
        sError = true;
    }
    formSubject.innerHTML = msg;
    if(msg !== "") 
        formSubject.style.display = "block";
    else
        formSubject.style.display = "none";
}

const valM = function() {
    mError = false;
    const value = message.value.trim();
    let msg = "";
    if(value.length !== 0) {
        if(value.length < 10 || value.length > 128) {
            msg += "-Must be 10-128 characters long";
            mError = true;
        } else {
            if(value.charAt(0).match(/^[a-z]+$/ig) === null) {
                msg += "-Message must start with a letter\n";
                mError = true;
            }
        }
    } else {
        mError = true;
    }
    formMessage.innerHTML = msg;
    if(msg !== "") 
        formMessage.style.display = "block";
    else
        formMessage.style.display = "none";
}