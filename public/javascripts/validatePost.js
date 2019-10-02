let title;
let content;
let name;
let code;
let summary;
let image;

const attemptSendingPost = function() {
    title = document.getElementById('title');
    content = document.getElementById('content');
    name = document.getElementById('name');
    code = document.getElementById('code');
    summary = document.getElementById('summary');
    image = document.getElementById('image');
    try {
        validateTitle();
        validateContent();
        validateName();
        validateCode();
        if (typeof createPost === 'function')
            createPost(title.value, content.value, name.value, code.value, summary.value, image.value);
        else if (typeof editPost === 'function')
            editPost(title.value, content.value, name.value, code.value, summary.value, image.value);
    } catch (e) {
        console.log('ok!', e.message)
    }
}
const goToPosts = async function () {
    window.location.replace('...');
}

const validateTitle = function() {
    let error = false;
    const string = title.value;
    let message = "";
    if(string.length < 5 || string.length > 50) {
        message += "-Post title must be 5-50 characters long";
        error = true;
    } else {
        if(string.charAt(0).match(/^[a-z]+$/ig) === null) {
            message += "-Post title must start with a letter\n";
            error = true;
        }
    }

    if (error) {
        alert(message)
        throw '';
    }
}
const validateContent = function() {
    let error = false;
    const string = content.value;
    let message = "";
    if(string.length < 3) {
        message += "-Content missing";
        error = true;
    }

    if (error) {
        alert(message)
        throw '';
    }
}
const validateName = function() {
    let error = false;
    const string = name.value;
    let message = "";
    if(string.length < 3 || string.length > 30) {
        message += "-Url name be 3-30 characters long";
        error = true;
    } else {
        if(string.charAt(0).match(/^[a-z]+$/ig) === null) {
            message += "-Url name must start with a letter\n";
            error = true;
        } else if(string.match(/^[a-z][a-z\d\_]+$/ig) === null) {
            message += "-Symbols/Spaces not allowed";
            error = true;
        } 
    }

    if (error) {
        alert(message)
        throw '';
    }
}
const validateCode = function() {
    let error = false;
    const string = code.value;
    let message = "";
    if(string.length < 2 || string.length > 15) {
        message += "-Url code be 2-15 characters long";
        error = true;
    } else {
        if(string.charAt(0).match(/^[a-z]+$/ig) === null) {
            message += "-Url code must start with a letter\n";
            error = true;
        } else if(string.match(/^[a-z][a-z\d]+$/ig) === null) {
            message += "-Symbols/Spaces not allowed";
            error = true;
        } 
    }

    if (error) {
        alert(message)
        throw '';
    }
}