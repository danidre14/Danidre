//TO RE-WRITE
const beforeUnload = function(e) {
    e.preventDefault();
    
    e.returnValue = '';
};
//===================================
async function promptDialog(text, def, options) {
    function execPrompt(text, def, type) {
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        var resize = function() {
            pwprompt.style.left = (((document.documentElement.clientWidth || window.innerWidth) / 2) - (pwprompt.offsetWidth / 2)) + "px";
            pwprompt.style.top = (((document.documentElement.clientHeight || window.innerHeight) / 2) - (pwprompt.offsetHeight / 2)) + "px";
        };

        /*creates a password-prompt instead of a normal prompt*/
        /* first the styling - could be made here or in a css-file. looks very silly now but its just a proof of concept so who cares */
        var width = 250;
        var height = 100;
        var pwprompt = document.createElement("div"); //creates the div to be used as a prompt
        pwprompt.id = "password_prompt"; //gives the prompt an id - not used in my example but good for styling with css-file

        var pwtext = document.createElement("div"); //create the div for the password-text
        pwtext.style.width = width + "px";
        pwtext.style.maxHeight = height + "px";
        pwtext.style.overflow = "auto";
        pwtext.style.wordWrap = "break-word";
        pwtext.style.color = "black";
        pwtext.innerText = text; //put inside the text
        pwprompt.appendChild(pwtext); //append the text-div to the password-prompt
        var pwinput = document.createElement("input"); //creates the password-input
        pwinput.value = def; //put inside the text
        pwinput.id = "password_id"; //give it some id - not really used in this example...
        pwinput.type = type || text; // makes the input of type password to not show plain-text
        pwinput.className = "input";
        pwprompt.appendChild(pwinput); //append it to password-prompt
        var pwokbutton = document.createElement("button"); //the ok button
        pwokbutton.innerText = "Ok";
        pwokbutton.className = "btn btn-primary bounded";
        var pwcancelb = document.createElement("button"); //the cancel-button
        pwcancelb.innerText = "Cancel";
        pwcancelb.className = "btn btn-primary bounded";
        pwprompt.appendChild(pwokbutton); //append the ok-button
        pwprompt.appendChild(pwcancelb); //append cancel-button first

        document.body.appendChild(pwprompt); //append the password-prompt so it gets visible
        window.addEventListener("resize", resize, false);
        pwinput.focus(); //focus on the password-input-field so user does not need to click 
        disableIds(true);

        pwprompt.style.position = "fixed"; //make it fixed as we do not want to move it around
        pwprompt.style.width = "auto";
        pwprompt.style.height = "auto";
        pwprompt.style.display = "block";
        pwprompt.style.left = (((document.documentElement.clientWidth || window.innerWidth) / 2) - (pwprompt.offsetWidth / 2)) + "px"; //let it apear in the middle of the page
        pwprompt.style.top = (((document.documentElement.clientHeight || window.innerHeight) / 2) - (pwprompt.offsetHeight / 2)) + "px"; //let it apear in the middle of the page
        pwprompt.style.padding = "16px"; //give it some space
        pwprompt.style.zIndex = 99999; //put it above everything else - just in case container
        pwprompt.className = "promptBody";

        window.scrollTo(scrollX, scrollY);

        /*now comes the magic: create and return a promise*/
        return new Promise(function (resolve, reject) {
            try {
                const submit = function() {
                    resolve(pwinput.value);
                    disableIds(false);
                    document.body.removeChild(pwprompt);  //as we are done clean up by removing the password-prompt
                    window.removeEventListener("resize", resize, false);
                }
                const cancel = function() {
                    reject(new Error('User cancelled'));
                    disableIds(false);
                    document.body.removeChild(pwprompt);  //as we are done clean up by removing the password-prompt
                    window.removeEventListener("resize", resize, false);
                }
                pwprompt.addEventListener('click', function handleButtonClicks(e) { //lets handle the buttons
                    if (e.target.tagName !== 'BUTTON') { return; } //nothing to do - user clicked somewhere else
                    pwprompt.removeEventListener('click', handleButtonClicks); //removes eventhandler on cancel or ok
                    if (e.target === pwokbutton) { //click on ok-button
                        submit();
                    } else {
                        cancel();
                    }

                });
                pwinput.addEventListener('keyup', function handleEnter(e) { //users dont like to click on buttons
                    if (e.keyCode == 13) { //if user enters "enter"-key on password-field
                        pwinput.removeEventListener('keyup', handleEnter);
                        submit();
                    } else if (e.keyCode == 27) { //user enters "Escape" on password-field
                        pwinput.removeEventListener('keyup', handleEnter);
                        cancel();
                    }
                });
            } catch {
                reject(new Error('Error occurred'));
            }
        });
    }
    const LOCK = options ? options.lock || [] : [];
    function disableIds(cond) {
        if(cond) {
            window.addEventListener('beforeunload', beforeUnload);
        } else {
            window.removeEventListener('beforeunload', beforeUnload);
        }
        try {
            for(var i in LOCK) {
                const elems = document.getElementsByClassName(LOCK[i]);
                for(const i in elems) {
                    elems[i].disabled = cond;
                }
            }
        } catch {}
    }
    const TYPE = options? options.type || 'text' : 'text';
    try {
        return await execPrompt(text, def || "", TYPE || 'text');
    } catch {
        return null;
    }
}

//===================================
async function alertDialog(text, options) {
    function execAlert(text) {
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        var resize = function() {
            pwprompt.style.left = (((document.documentElement.clientWidth || window.innerWidth) / 2) - (pwprompt.offsetWidth / 2)) + "px";
            pwprompt.style.top = (((document.documentElement.clientHeight || window.innerHeight) / 2) - (pwprompt.offsetHeight / 2)) + "px";
        };

        /*creates a password-prompt instead of a normal prompt*/
        /* first the styling - could be made here or in a css-file. looks very silly now but its just a proof of concept so who cares */
        var width = 250;
        var height = 100;
        var pwprompt = document.createElement("div"); //creates the div to be used as a prompt
        pwprompt.id = "password_prompt"; //gives the prompt an id - not used in my example but good for styling with css-file

        var pwtext = document.createElement("div"); //create the div for the password-text
        pwtext.style.width = width + "px";
        pwtext.style.maxHeight = height + "px";
        pwtext.style.overflow = "auto";
        pwtext.style.wordWrap = "break-word";
        pwtext.style.color = "black";
        pwtext.innerText = text; //put inside the text
        pwprompt.appendChild(pwtext); //append the text-div to the password-prompt
        var pwokbutton = document.createElement("button"); //the ok button
        pwokbutton.innerText = "Ok";
        pwokbutton.className = "btn btn-primary bounded";
        pwprompt.appendChild(pwokbutton); //append the ok-button

        document.body.appendChild(pwprompt); //append the password-prompt so it gets visible
        window.addEventListener("resize", resize, false);

        disableIds(true);

        pwprompt.style.position = "fixed"; //make it fixed as we do not want to move it around
        pwprompt.style.width = "auto";
        pwprompt.style.height = "auto";
        pwprompt.style.display = "block";
        pwprompt.style.left = (((document.documentElement.clientWidth || window.innerWidth) / 2) - (pwprompt.offsetWidth / 2)) + "px"; //let it apear in the middle of the page
        pwprompt.style.top = (((document.documentElement.clientHeight || window.innerHeight) / 2) - (pwprompt.offsetHeight / 2)) + "px"; //let it apear in the middle of the page
        pwprompt.style.padding = "16px"; //give it some space
        pwprompt.style.zIndex = 99999; //put it above everything else - just in case container
        pwprompt.className = "promptBody";


        window.scrollTo(scrollX, scrollY);

        /*now comes the magic: create and return a promise*/
        return new Promise(function (resolve, reject) {
            try {
                const submit = function() {
                    resolve();
                    disableIds(false);
                    document.body.removeChild(pwprompt);  //as we are done clean up by removing the password-prompt
                    window.removeEventListener("resize", resize, false);
                }
                pwprompt.addEventListener('click', function handleButtonClicks(e) { //lets handle the buttons
                    if (e.target.tagName !== 'BUTTON') { return; } //nothing to do - user clicked somewhere else
                    pwprompt.removeEventListener('click', handleButtonClicks); //removes eventhandler on cancel or ok
                    if (e.target === pwokbutton) { //click on ok-button
                        submit();
                    }
                });
            } catch {
                reject(new Error('Error occurred'));
            }
        });
    }
    const LOCK = options ? options.lock || [] : [];
    function disableIds(cond) {
        if(cond) {
            window.addEventListener('beforeunload', beforeUnload);
        } else {
            window.removeEventListener('beforeunload', beforeUnload);
        }
        try {
            for(var i in LOCK) {
                const elems = document.getElementsByClassName(LOCK[i]);
                for(const i in elems) {
                    elems[i].disabled = cond;
                }
            }
        } catch {}
    }
    try {
        return await execAlert(text);
    } catch {
        return undefined;
    }
}

//===================================
async function confirmDialog(text, options) {
    function execConfirm(text) {
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        var resize = function() {
            pwprompt.style.left = (((document.documentElement.clientWidth || window.innerWidth) / 2) - (pwprompt.offsetWidth / 2)) + "px";
            pwprompt.style.top = (((document.documentElement.clientHeight || window.innerHeight) / 2) - (pwprompt.offsetHeight / 2)) + "px";
        };

        /*creates a password-prompt instead of a normal prompt*/
        /* first the styling - could be made here or in a css-file. looks very silly now but its just a proof of concept so who cares */
        var width = 250;
        var height = 100;
        var pwprompt = document.createElement("div"); //creates the div to be used as a prompt
        pwprompt.id = "password_prompt"; //gives the prompt an id - not used in my example but good for styling with css-file

        var pwtext = document.createElement("div"); //create the div for the password-text
        pwtext.style.width = width + "px";
        pwtext.style.maxHeight = height + "px";
        pwtext.style.overflow = "auto";
        pwtext.style.wordWrap = "break-word";
        pwtext.style.color = "black";
        pwtext.innerText = text; //put inside the text
        pwprompt.appendChild(pwtext); //append the text-div to the password-prompt
        var pwokbutton = document.createElement("button"); //the ok button
        pwokbutton.innerText = "Ok";
        pwokbutton.className = "btn btn-primary bounded";
        var pwcancelb = document.createElement("button"); //the cancel-button
        pwcancelb.innerText = "Cancel";
        pwcancelb.className = "btn btn-primary bounded";
        pwprompt.appendChild(pwokbutton); //append the ok-button
        pwprompt.appendChild(pwcancelb); //append cancel-button first

        document.body.appendChild(pwprompt); //append the password-prompt so it gets visible
        window.addEventListener("resize", resize, false);
        
        disableIds(true);

        pwprompt.style.position = "fixed"; //make it fixed as we do not want to move it around
        pwprompt.style.width = "auto";
        pwprompt.style.height = "auto";
        pwprompt.style.display = "block";
        pwprompt.style.left = (((document.documentElement.clientWidth || window.innerWidth) / 2) - (pwprompt.offsetWidth / 2)) + "px"; //let it apear in the middle of the page
        pwprompt.style.top = (((document.documentElement.clientHeight || window.innerHeight) / 2) - (pwprompt.offsetHeight / 2)) + "px"; //let it apear in the middle of the page
        pwprompt.style.padding = "16px"; //give it some space
        pwprompt.style.zIndex = 99999; //put it above everything else - just in case container
        pwprompt.className = "promptBody";

        window.scrollTo(scrollX, scrollY);

        /*now comes the magic: create and return a promise*/
        return new Promise(function (resolve, reject) {
            try {
                const submit = function() {
                    resolve(true);
                    disableIds(false);
                    document.body.removeChild(pwprompt);  //as we are done clean up by removing the password-prompt
                    window.removeEventListener("resize", resize, false);
                }
                const cancel = function() {
                    reject(new Error('User cancelled'));
                    disableIds(false);
                    document.body.removeChild(pwprompt);  //as we are done clean up by removing the password-prompt
                    window.removeEventListener("resize", resize, false);
                }
                pwprompt.addEventListener('click', function handleButtonClicks(e) { //lets handle the buttons
                    if (e.target.tagName !== 'BUTTON') { return; } //nothing to do - user clicked somewhere else
                    pwprompt.removeEventListener('click', handleButtonClicks); //removes eventhandler on cancel or ok
                    if (e.target === pwokbutton) { //click on ok-button
                        submit();
                    } else {
                        cancel();
                    }
                });
            } catch {
                reject(new Error('Error occurred'));
            }
        });
    }
    const LOCK = options ? options.lock || [] : [];
    function disableIds(cond) {
        if(cond) {
            window.addEventListener('beforeunload', beforeUnload);
        } else {
            window.removeEventListener('beforeunload', beforeUnload);
        }
        try {
            for(var i in LOCK) {
                const elems = document.getElementsByClassName(LOCK[i]);
                for(const i in elems) {
                    elems[i].disabled = cond;
                }
            }
        } catch {}
    }
    try {
        return await execConfirm(text);
    } catch (e) {
        return false;
    }
}