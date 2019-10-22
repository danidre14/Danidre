let rolesList;
let highscoresList;
let adminPanelMessage;
let settingsPanel;
window.onload = function() {
    rolesList = document.getElementById('rolesList');
    highscoresList = document.getElementById('highscoresList');
    adminPanelMessage = document.getElementById('adminPanelMessage');
    settingsPanel = document.getElementById('settingsPanel');

    loadRoleList();
    loadHighScoreList();
}
const resizeDiv = function(divId) {
    const div = document.getElementById(divId);
    if(div.style.display === "block") div.style.display = "none";
    else  div.style.display = "block";
}

const loadHighScoreList = async function() {
    try {
        const request = await axios('/api/games/highscores/highscores_list');
        const requestOK = request && request.status === 200 && request.statusText === 'OK';
        if(!requestOK) {
            return console.log("Can't get list"); //error occurred
        }
        const data = await request.data;
        if(data === null || data === undefined) return console.log("Can't get list"); //error occurred
        const highscores = data.highscores;

        let listH = '';
        let notFound = true;
        for(const i in highscores) { const highscore = highscores[i];
        if(notFound) notFound = false;

            listH += `<div class="bounded">
                <div class="div-space-between div">
                    <div>
                        <span>${highscore.name}</span>
                        <button class="bounded button" onclick="toggleHighscoreOrder('${highscore.name}', '${highscore.order}')">Order: ${highscore.order}</button>
                        <button class="bounded button" onclick="getHighscoreKey('${highscore.key}')">Key</button>
                        <button class="bounded button" onclick="editHighscore('${highscore.name}')">Edit</button>
                        <button class="bounded button" onclick="removeHighscore('${highscore.name}')">Del</button>
                    </div>
                </div>
            </div>`;
        }
        if(notFound) listH += "Nothing from API."
        listH += `<button class="bounded button" onclick="addHighscore()">Add Highscore</button>`

        highscoresList.innerHTML = listH;
    } catch (e) {
        console.log("Can't access anything:", e.message);
    }
}

async function addHighscore() {
    try {
        const highscoreName = prompt("Enter highscore name:", '') || "";
        if(highscoreName.trim() !== '') {
            const request = await axios({
                method: 'post',
                url: `/api/games/highscores/highscores_list`,
                data: {highscoreName: highscoreName}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadHighScoreList();
            }
        }
    } catch (e) {
        loadHighScoreList();
        console.log("Can't add highscore:", e.message);
    }
}

async function editHighscore(oldHighscoreName) {
    try {
        if(!confirm(`Change highscore name for "${oldHighscoreName}"?`)) return;

        const newHighscoreName = prompt("Enter highscore name:", oldHighscoreName) || oldHighscoreName;
        
        if(newHighscoreName.trim() !== '' && newHighscoreName !== oldHighscoreName) {        
            const request = await axios({
                method: 'put',
                url: `/api/games/highscores/highscores_list`,
                data: {oldHighscoreName: oldHighscoreName, highscoreName: newHighscoreName}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadHighScoreList();
            }
        }
    } catch (e) {
        loadHighScoreList();
        console.log("Can't edit highscore:", e.message);
    }
}

async function removeHighscore(highscoreName) {
    try {
        if(confirm(`Are you sure you want to delete the highscore "${highscoreName}"?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            const request = await axios({
                method: 'delete',
                url: `/api/games/highscores/highscores_list`,
                data: {highscoreName: highscoreName, passkey: passkey}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadHighScoreList();
            }
        }
    } catch (e) {
        loadHighScoreList();
        console.log("Can't delete highscore:", e.message);
    }
}

async function toggleHighscoreOrder(highscoreName) {
    try {
        if(!confirm(`Change order of "${highscoreName}"?`)) return;
               
        const request = await axios({
            method: 'put',
            url: `/api/games/highscores/highscores_list_order`,
            data: {highscoreName: highscoreName}
        });

        const requestOK = request && request.status === 200 && request.statusText === 'OK';
        if (requestOK) {
            const data = await request.data;
            // do something with data
            if(data.res === "Error")
                alert(data.msg);
            else if(data.res === "Success")
                console.log(data.msg);
            loadHighScoreList();
        }
    } catch (e) {
        loadHighScoreList();
        console.log("Can't change order method:", e.message);
    }
}

const getHighscoreKey = function(highscoreKey) {
    alert(`API Key: "${highscoreKey}"`);
}

const getImagePath = async function(username) {
    try {
        const request = await axios(`/api/uploads/avatars/${username}`);
        const requestOK = request && request.status === 200 && request.statusText === 'OK';
        if (requestOK) {
            const data = await request.data;
            // do something with data
            return data.path;
        }
        return '../images/UsersIcon.png';
    } catch {
        return '../images/UsersIcon.png';
    }
}


const loadRoleList = async function() {
    try {
        const request = await axios('/settings/roles_List');
        const requestOK = request && request.status === 200 && request.statusText === 'OK';
        if(!requestOK) {
            return console.log("Can't get list"); //error occurred
        }
        const data = await request.data;
        if(data === null || data === undefined) return console.log("Can't get list"); //error occurred
        const roles = data.roles;

        let listH = '';
        let notFound = true;
        for(const i in roles) { const role = roles[i];
            if(notFound) notFound = false;
            let directUsersH = ``;

            for(const j in role.users) { const user = role.users[j];
                directUsersH += `<div class="bounded userTab">
                    <div>
                        <a href="/u/${user.username}" target="_blank" rel="noreferrer">
                            <img src="${await getImagePath(user.username)}"this.src = '/images/UsersIcon.png';">
                            <span>${user.username}</span>
                        </a>
                    </div>
                    ${ i == 0 ? '' : `
                    <div style="padding-left:var(--mini-spacing)">
                        <button class="bounded button" onclick="removeRoleFromUser('${role.name}', '${user.username}')">-</button>
                    </div>
                    `}
                </div>`
            };
            listH += `<div class="bounded roleBox">
                <div class="div-space-between div">
                    <div>
                        <span class="roleName">${role.name}: ${role.users.length}</span>
                    </div>
                    ${ i == 0 ? '' : `
                    <div> 
                        <button class="bounded button" onclick="editRole('${role.name}')">Change</button>
                        <button class="bounded button" onclick="removeRole('${role.name}')">Delete</button>
                    </div>
                    `}
                </div>
                <div class="bounded roleContent">${directUsersH}
                    ${ i == 0 ? '' : `
                    <div style="display:flex;flex-wrap:wrap;align-content:flex-end;height:60px;padding-left:var(--mini-spacing)">
                        <button style="white-space:pre;" class="bounded button" onclick="addRoleToUser('${role.name}')">Add User</button>
                    </div>
                    `}
                </div>
                ${ i == 0 ? '' : `
                <div class="div-space-between div">
                    <button class="bounded button" onclick="addRoleToAllUsers('${role.name}')">Add To All</button>
                    <button class="bounded button" onclick="removeRoleFromAllUsers('${role.name}')">Remove From All</button>
                </div>
                `}
            </div>`;
        }
        if(notFound) listH += "Nothing from API."
        listH += `<button class="bounded button" onclick="addRole()">Add Role</button>`
        
        rolesList.innerHTML = listH;
    } catch (e) {
        console.log("Can't access anything:", e.message);
    }
}


async function addRole() {
    try {
        const roleName = prompt("Enter role name:", '') || "";
        if(roleName.trim() !== '') {
            const request = await axios({
                method: 'post',
                url: `/settings/roles_List`,
                data: {roleName: roleName}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadRoleList();
            }
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't add role:", e.message);
    }
}

async function editRole(oldRoleName) {
    try {
        if(!confirm(`Change role name for "${oldRoleName}"?`)) return;

        const newRoleName = prompt("Enter role name:", oldRoleName) || oldRoleName;
        
        if(newRoleName.trim() !== '' && newRoleName !== oldRoleName) {        
            const request = await axios({
                method: 'put',
                url: `/settings/roles_List`,
                data: {oldRoleName: oldRoleName, roleName: newRoleName}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadRoleList();
            }
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't edit role:", e.message);
    }
}

async function removeRole(roleName) {
    try {
        if(confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            const request = await axios({
                method: 'delete',
                url: `/settings/roles_List`,
                data: {roleName: roleName, passkey: passkey}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadRoleList();
            }
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't delete role:", e.message);
    }
}

async function updateLastSeen() {
    try {
        if(confirm(`Are you sure you want to update last seen?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            const request = await axios({
                method: 'put',
                url: `/settings/api/update_last_seen`,
                data: {passkey: passkey}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    adminPanelMessage.innerHTML = `<pre>${data.msg}</pre>`;
                loadRoleList();
            }
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't reset roles:", e.message);
    }
}

async function resetUserRoles() {
    try {
        if(confirm(`Are you sure you want to reset all user roles?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            const request = await axios({
                method: 'delete',
                url: `/settings/api/reset_user_roles`,
                data: {passkey: passkey}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    adminPanelMessage.innerHTML = data.msg;
                loadRoleList();
            }
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't reset roles:", e.message);
    }
}

async function addRoleToUser(roleName) {
    try {
        const userName = prompt("Enter username:", '') || "";
        if(userName.trim() === '') return;
        const request = await axios({
            method: 'post',
            url: `/settings/api/add_role_to_user`,
            data: {roleName: roleName, userName: userName}
        });

        const requestOK = request && request.status === 200 && request.statusText === 'OK';
        if (requestOK) {
            const data = await request.data;
            // do something with data
            if(data.res === "Error")
                alert(data.msg);
            else if(data.res === "Success")
                console.log(data.msg);
            loadRoleList();
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't add role to user:", e.message);
    }
}

async function removeRoleFromUser(roleName, userName) {
    try {
        if(!confirm(`Remove role "${roleName}" from "${userName}"?`)) return;

        const request = await axios({
            method: 'delete',
            url: `/settings/api/remove_role_from_user`,
            data: {roleName: roleName, userName: userName}
        });

        const requestOK = request && request.status === 200 && request.statusText === 'OK';
        if (requestOK) {
            const data = await request.data;
            // do something with data
            if(data.res === "Error")
                alert(data.msg);
            else if(data.res === "Success")
                console.log(data.msg);
            loadRoleList();
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't remove role from user:", e.message);
    }
}

async function addRoleToAllUsers(roleName) {
    try {
        if(confirm(`Are you sure you want to add role to all users?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            const request = await axios({
                method: 'post',
                url: `/settings/api/add_role_to_all_users`,
                data: {roleName: roleName, passkey: passkey}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadRoleList();
            }
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't add role to all users:", e.message);
    }
}

async function removeRoleFromAllUsers(roleName) {
    try {
        if(confirm(`Are you sure you want to remove role from all users?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            const request = await axios({
                method: 'delete',
                url: `/settings/api/remove_role_from_all_users`,
                data: {roleName: roleName, passkey: passkey}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadRoleList();
            }
        }
    } catch (e) {
        loadRoleList();
        console.log("Can't remove role from all users:", e.message);
    }
}



//===================================
async function promptValue(type, text, def) {
    function execPrompt(type, text, def) {
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        var resize = function() {
            pwprompt.style.left = ((window.innerWidth / 2) - (pwprompt.offsetWidth / 2)) + "px";
            pwprompt.style.top = ((window.innerHeight / 2) - (pwprompt.offsetHeight / 2)) + "px";
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
        pwinput.type = type; // makes the input of type password to not show plain-text
        pwinput.className = "input";
        pwprompt.appendChild(pwinput); //append it to password-prompt
        var pwokbutton = document.createElement("button"); //the ok button
        pwokbutton.innerText = "Ok";
        pwokbutton.className = "button2 bounded";
        var pwcancelb = document.createElement("button"); //the cancel-button
        pwcancelb.innerText = "Cancel";
        pwcancelb.className = "button2 bounded";
        pwprompt.appendChild(pwokbutton); //append the ok-button
        pwprompt.appendChild(pwcancelb); //append cancel-button first

        settingsPanel.appendChild(pwprompt); //append the password-prompt so it gets visible
        window.addEventListener("resize", resize, false);
        pwinput.focus(); //focus on the password-input-field so user does not need to click 
        disableIds(true);

        pwprompt.style.position = "fixed"; //make it fixed as we do not want to move it around
        pwprompt.style.width = "auto";
        pwprompt.style.height = "auto";
        pwprompt.style.display = "block";
        pwprompt.style.left = ((window.innerWidth / 2) - (pwprompt.offsetWidth / 2)) + "px"; //let it apear in the middle of the page
        pwprompt.style.top = ((window.innerHeight / 2) - (pwprompt.offsetHeight / 2)) + "px"; //let it apear in the middle of the page
        pwprompt.style.border = "1px solid black"; //give it a border
        pwprompt.style.padding = "16px"; //give it some space
        pwprompt.style.zIndex = 99999; //put it above everything else - just in case container
        pwprompt.className = "promptBody";

        window.scrollTo(scrollX, scrollY);

        /*now comes the magic: create and return a promise*/
        return new Promise(function (resolve, reject) {
            const submit = function() {
                resolve(pwinput.value);
                disableIds(false);
                settingsPanel.removeChild(pwprompt);  //as we are done clean up by removing the password-prompt
                window.removeEventListener("resize", resize, false);
            }
            const cancel = function() {
                reject(new Error('User cancelled'));
                disableIds(false);
                settingsPanel.removeChild(pwprompt);  //as we are done clean up by removing the password-prompt
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
                    submit();
                } else if (e.keyCode == 27) { //user enters "Escape" on password-field
                    cancel();
                }
            });
        });
    }
    function disableIds(cond) {
        const elems = document.getElementsByClassName("button")
        for(const i in elems) {
            elems[i].disabled = cond;
        }
    }
    try {
        return await execPrompt(type, text, def || "");
    } catch {
        return null;
    }
}