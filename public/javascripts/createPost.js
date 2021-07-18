const createPost = async function (title, content, name, code, summary, image) {
    try {
        const request = await axios({
            method: 'post',
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
            console.log("Can't post");
        }
    } catch (e) {
        console.log("Can't create post", e.message);
    }
}