window.onload = function() {
    getList();
}

const getList = async function() {
    let request = await axios('/api/user_data');
    let requestOK = request && request.status === 200 && request.statusText === 'OK';
    if(!requestOK) {
        console.log('Must be logged in')

        return //unable to get username of logged in user
    }
    let user = await request.data;
    if(user === null || user === undefined) return
    
    let imagePath = await axios(`/api/uploads/avatars/${user.username}`);
    let path = '../images/UsersIcon.png';
    if(imagePath && imagePath.status === 200 && imagePath.statusText === 'OK') {
        path = imagePath.data.path;
    }

    console.log(path)
    document.getElementById("pfp").src = path;
}