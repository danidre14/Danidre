let rolesList;
let adminPanel;
let adminPanelMessage;
let settingsPanel;
window.onload = function() {
    rolesList = document.getElementById('rolesList');
    adminPanel = document.getElementById('adminPanel');
    adminPanelMessage = document.getElementById('adminPanelMessage');
    settingsPanel = document.getElementById('settingsPanel');

    loadUserList();
    // loadAdminPanel();
}

// const loadAdminPanel = function() {
//     let listH = ``;
//     listH += `<button class="bounded button" onclick="updateLastSeen()">Update Last Seen</button>`;
//     listH += `<button class="bounded button" onclick="resetUserRoles()">Reset User Roles</button>`;
//     adminPanel.innerHTML = listH; 
// }
const getImagePath = async function(username) {
    try {
        let request = await axios(`/api/uploads/avatars/${username}`);
        let requestOK = request && request.status === 200 && request.statusText === 'OK';
        if (requestOK) {
            let data = await request.data;
            // do something with data
            return data.path;
        }
        return '../images/UsersIcon.png';
    } catch {
        return '../images/UsersIcon.png';
    }
}

const loadUserList = async function() {
    try {
        let request = await axios('/settings/roles_List');
        let requestOK = request && request.status === 200 && request.statusText === 'OK';
        if(!requestOK) {
            return console.log("Can't get list"); //error occurred
        }
        const data = await request.data;
        if(data === null || data === undefined) return console.log("Can't get list"); //error occurred
        const roles = data.roles;

        let listH = '';
        for(const i in roles) { const role = roles[i];
            let directUsersH = ``;

            for(const j in role.users) { const user = role.users[j];
                directUsersH += `<div class="bounded userTab">
                    <div>
                        <a href="/u/${user.username}" target="_blank" rel="noreferrer">
                            <img src="${await getImagePath(user.username)}" onerror="if (this.src != '/images/UsersIcon.png') this.src = '/images/UsersIcon.png';">
                            <span>${user.username}</span>
                        </a>
                    </div>
                    <div style="padding-left:var(--mini-spacing)">
                        <button class="bounded button" onclick="removeRoleFromUser('${role.name}', '${user.username}')">-</button>
                    </div>
                </div>`
            };
            listH += `<div class="bounded roleBox">
                <div class="div-space-between div">
                    <div>
                        <span class="roleName">${role.name}</span>
                    </div>
                    <div> 
                        <button class="bounded button" onclick="editRole('${role.name}')">Change</button>
                        <button class="bounded button" onclick="removeRole('${role.name}')">Delete</button>
                    </div>
                </div>
                <div class="bounded roleContent">${directUsersH}
                    <div style="display:flex;flex-wrap:wrap;align-content:flex-end;height:60px;padding-left:var(--mini-spacing)">
                        <button style="white-space:pre;" class="bounded button" onclick="addRoleToUser('${role.name}')">Add User</button>
                    </div>
                </div>
                <div class="div-space-between div">
                    <button class="bounded button" onclick="addRoleToAllUsers('${role.name}')">Add To All</button>
                    <button class="bounded button" onclick="removeRoleFromAllUsers('${role.name}')">Remove From All</button>
                </div>
            </div>`;
        }
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
            let request = await axios({
                method: 'post',
                url: `/settings/roles_List`,
                data: {roleName: roleName}
            });

            let requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                let data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadUserList();
            }
        }
    } catch (e) {
        console.log("Can't add role:", e.message);
    }
}

async function editRole(oldRoleName) {
    try {
        if(!confirm(`Change role name for "${oldRoleName}"?`)) return;

        const newRoleName = prompt("Enter role name:", oldRoleName) || oldRoleName;
        
        if(newRoleName.trim() !== '' && newRoleName !== oldRoleName) {        
            let request = await axios({
                method: 'put',
                url: `/settings/roles_List`,
                data: {oldRoleName: oldRoleName, roleName: newRoleName}
            });

            let requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                let data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadUserList();
            }
        }
    } catch (e) {
        console.log("Can't edit role:", e.message);
    }
}

async function removeRole(roleName) {
    try {
        if(confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            let request = await axios({
                method: 'delete',
                url: `/settings/roles_List`,
                data: {roleName: roleName}
            });

            let requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                let data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadUserList();
            }
        }
    } catch (e) {
        console.log("Can't delete role:", e.message);
    }
}

async function updateLastSeen() {
    try {
        if(confirm(`Are you sure you want to update last seen?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            let request = await axios({
                method: 'put',
                url: `/settings/api/update_last_seen`,
                data: {passkey: passkey}
            });

            let requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                let data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    adminPanelMessage.innerHTML = `<pre>${data.msg}</pre>`;
                loadUserList();
            }
        }
    } catch (e) {
        console.log("Can't reset roles:", e.message);
    }
}

async function resetUserRoles() {
    try {
        if(confirm(`Are you sure you want to reset all user roles?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            let request = await axios({
                method: 'delete',
                url: `/settings/api/reset_user_roles`,
                data: {passkey: passkey}
            });

            let requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                let data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    adminPanelMessage.innerHTML = data.msg;
                loadUserList();
            }
        }
    } catch (e) {
        console.log("Can't reset roles:", e.message);
    }
}

async function addRoleToUser(roleName) {
    try {
        const userName = prompt("Enter username:", '') || "";
        if(userName.trim() === '') return;
        let request = await axios({
            method: 'post',
            url: `/settings/api/add_role_to_user`,
            data: {roleName: roleName, userName: userName}
        });

        let requestOK = request && request.status === 200 && request.statusText === 'OK';
        if (requestOK) {
            let data = await request.data;
            // do something with data
            if(data.res === "Error")
                alert(data.msg);
            else if(data.res === "Success")
                console.log(data.msg);
            loadUserList();
        }
    } catch (e) {
        console.log("Can't add role to user:", e.message);
    }
}

async function removeRoleFromUser(roleName, userName) {
    try {
        if(!confirm(`Remove role "${roleName}" from "${userName}"?`)) return;

        let request = await axios({
            method: 'delete',
            url: `/settings/api/remove_role_from_user`,
            data: {roleName: roleName, userName: userName}
        });

        let requestOK = request && request.status === 200 && request.statusText === 'OK';
        if (requestOK) {
            let data = await request.data;
            // do something with data
            if(data.res === "Error")
                alert(data.msg);
            else if(data.res === "Success")
                console.log(data.msg);
            loadUserList();
        }
    } catch (e) {
        console.log("Can't remove role from user:", e.message);
    }
}

async function addRoleToAllUsers(roleName) {
    try {
        if(confirm(`Are you sure you want to add role to all users?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            let request = await axios({
                method: 'post',
                url: `/settings/api/add_role_to_all_users`,
                data: {roleName: roleName, passkey: passkey}
            });

            let requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                let data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadUserList();
            }
        }
    } catch (e) {
        console.log("Can't add role to all users:", e.message);
    }
}

async function removeRoleFromAllUsers(roleName) {
    try {
        if(confirm(`Are you sure you want to remove role from all users?`)) {
            const passkey = await promptValue("password", "Enter key", "") || "";
            if(passkey.trim() === "") return;
            let request = await axios({
                method: 'delete',
                url: `/settings/api/remove_role_from_all_users`,
                data: {roleName: roleName, passkey: passkey}
            });

            let requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                let data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success")
                    console.log(data.msg);
                loadUserList();
            }
        }
    } catch (e) {
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