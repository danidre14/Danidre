const attemptDeletingPost = async function() {
    const name = document.getElementById('name').value;
    const code = document.getElementById('code').value;
    
    try {
        if(confirm(`Are you sure you want to delete the post?`)) {
            const passkey = await promptDialog(`Enter key`, "", {lock: ['lock'], type: 'password'}) || '';
            if(passkey.trim() === "") return;
            const request = await axios({
                method: 'delete',
                url: `/posts`,
                data: {
                    name: name,
                    code: code,
                    passkey: passkey
                }
            });

            const requestOK = request && request.status === 200;
            if (requestOK) {
                const data = await request.data;
                // do something with data
                if(data.res === "Error")
                    alert(data.msg);
                else if(data.res === "Success") {
                    console.log(data.msg);
                    goToPosts();
                } else {
                    console.log(data.msg);
                }
            } else {
                console.log("Can't delete");
            }
        }
    } catch (e) {
        console.log("Can't delete post", e.message);
    }
}

const editPost = async function(title, content, name, code, summary, image) {
    try {
        const request = await axios({
            method: 'put',
            url: `/posts`,
            data: {
                title: title,
                content: content,
                name: name,
                code: code,
                summary: summary,
                image: image
            }
        });

        const requestOK = request && request.status === 200;
        if (requestOK) {
            const data = await request.data;
            // do something with data
            if(data.res === "Error")
                alert(data.msg);
            else if(data.res === "Success") {
                console.log(data.msg);
                goToPosts();
            }
        } else {
            console.log("Can't edit");
        }
    } catch (e) {
        console.log("Can't edit post", e.message);
    }
}