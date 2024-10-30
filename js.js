//local url
let url = "http://127.0.0.1:3000";
const { Buffer } = require('node:buffer');
const { log } = require('node:console');

var login = false;
window.onload = async function() {
    let date = new Date();
    //localStorage.clear(); //manual log out
    if (date.getDay() != localStorage.getItem("loginTimer")) {
        localStorage.clear();
    }
    if(localStorage.getItem("loginData")) {
        login = true;
        if(document.getElementById("options")) {
            populate();
        }
    }

    if(document.getElementById("loginForm")) {
        document.getElementById("registerForm").addEventListener("submit", async ()=> {await register(document.getElementById("registerForm"))});
        document.getElementById("loginForm").addEventListener("submit", async ()=> {await loginCheck(document.getElementById("loginForm"))});
    }

    if(document.getElementById("pictureForm")) {
        document.getElementById("pictureForm").addEventListener("submit", async ()=> {await uploadProfileImg(document.getElementById("pictureForm"))});
    }

    if(document.getElementById("joinForm")) {
        document.getElementById("joinButton").addEventListener("click", async ()=> {await joinGroup(document.getElementById("joinForm"))});
        document.getElementById("createButton").addEventListener("click", async ()=> {await createGroup(document.getElementById("joinForm"))});
    }

    if (document.getElementById("options")) {
        let members = document.getElementById("members");
        let message = document.getElementById("message");
        let getFile = document.getElementById("getFile");
        let enterFile = document.getElementById("enterFile");

        document.getElementById("optionTable").children[0].addEventListener("click", () => {
            members.style.display = "none";
            message.style.display = "block";
            getFile.style.display = "none";
            enterFile.style.display = "none";
        })
        document.getElementById("optionTable").children[1].addEventListener("click", () => {
            members.style.display = "none";
            message.style.display = "none";
            getFile.style.display = "block";
            enterFile.style.display = "none";
        })
        document.getElementById("optionTable").children[2].addEventListener("click", () => {
            members.style.display = "none";
            message.style.display = "none";
            getFile.style.display = "none";
            enterFile.style.display = "block";
        })
        document.getElementById("optionTable").children[3].addEventListener("click", () => {
            members.style.display = "block";
            message.style.display = "none";
            getFile.style.display = "none";
            enterFile.style.display = "none";
        })
    }



    if(!document.getElementById("loginForm") && !login) {
        window.location = "login.html";
    }
    else if(document.getElementById("loginForm") && login) {
        window.location = "index.html";
    }

    if(document.getElementById("profile")) {
        let profile = document.getElementById("profile");
        let user = JSON.parse(localStorage.getItem("loginData"));
        profile.children[1].innerHTML = user.username;
        document.getElementById("userEmail").innerHTML = user.email;

        if(user.img) {
            let buff = Buffer.from(user.img);
            let image = buff.toString('base64');
            document.getElementById("profilePicture").src = atob(image);
        }
    }
}
async function loginCheck(login) {
    let res = await fetch(url + "/login", {
        method: 'POST',
        body: JSON.stringify({username: login[0].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        let errorHandler = document.getElementById("loginError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        let date = new Date();
        localStorage.setItem("loginData", JSON.stringify(res.userdata));
        localStorage.setItem("loginTimer", date.getDay());
        window.location.reload()
    }
}

async function register(register) {
    let res = await fetch(url + "/register", {
        method: 'POST',
        body: JSON.stringify({username: register[0].value, email: register[1].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        let errorHandler = document.getElementById("registerError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        await loginCheck(register);
    }
}

async function populate() {
    let login = JSON.parse(localStorage.getItem("loginData"));
    if(login.member) {
        let container = document.getElementById("groupList")
        for (let index = 0; index < login.member.length; index++) {
            let div = document.createElement("div");
            let p = document.createElement("h2");
            let button = document.createElement("button");
            button.innerHTML = "leave group";
            button.addEventListener("click", async ()=> {await leaveGroup(login.username, login.member[index])});
            let button2 = document.createElement("button");
            button2.innerHTML = "select group";
            button2.addEventListener("click", async ()=> {await selectGroup(login.username, login.member[index])});
            p.innerHTML = login.member[index];
            div.append(button);
            div.append(button2);
            container.append(p);
            container.append(div);
        }
    }
}

async function leaveGroup(login, group) {
    let res = await fetch(url + "/groupDelete", {
        method: 'DELETE',
        body: JSON.stringify({username: login, groupname: group}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        let errorHandler = document.getElementById("joinError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        reLog(login);
    }
}

async function joinGroup(join) {
    let login = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/groupJoin", {
        method: 'PUT',
        body: JSON.stringify({username: login.username, groupname: join[0].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        let errorHandler = document.getElementById("joinError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        reLog(login.username);
    }
}

async function createGroup(join) {
    let login = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/groupCreate", {
        method: 'POST',
        body: JSON.stringify({username: login.username, groupname: join[0].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        let errorHandler = document.getElementById("joinError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        await reLog(login.username);
    }
}

async function reLog(name) {
    let res = await fetch(url + "/login", {
        method: 'POST',
        body: JSON.stringify({username: name}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    localStorage.setItem("loginData", JSON.stringify(res.userdata));
    window.location.reload();
}

async function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    }) ;
}

async function uploadProfileImg(img) {
    let file = img[0].files[0];

    let usableFile;
    try {
        usableFile = await readFile(file);   
    } catch (error) {
        console.log("invalid file, ignoring for serverside error");
        let errorHandler = document.getElementById("profileUploadError");
        errorHandler.innerHTML = "Invalid file, please try again";
        errorHandler.style.display = "block";
        return
    }

    if(file.size > 16000000) {
        let errorHandler = document.getElementById("profileUploadError");
        errorHandler.innerHTML = "File to large, please choose a file under 16MB";
        errorHandler.style.display = "block";
        return;
    }


    let user = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/uploadPicture", {
        method: 'PUT',
        body: JSON.stringify({username: user.username, img: usableFile}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        let errorHandler = document.getElementById("profileUploadError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        await reLog(user.username);
    }
}

async function selectGroup(username, groupname) {  
    let res = await fetch(url + "/groupFetch", {
        method: 'POST',
        body: JSON.stringify({username: username, groupname: groupname}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        console.log("something went wrong");
    }
    let members = document.getElementById("members")
    let messageList = document.getElementById("message")
    let getFile = document.getElementById("getFile")

    document.getElementById("groupname").innerHTML = res.groupFile.name;

    for (let index = 0; index < res.groupFile.members.length; index++) {
        let p = document.createElement("p");
        p.innerHTML = res.groupFile.members[index];
        members.append(p);
    }

    for (let index = 0; index < res.groupFile.messages.length; index++) {
        let container = document.createElement("div");
        let user = document.createElement("h5");
        let message = document.createElement("p");
        user.innerHTML = res.groupFile.messages[index].user + " - " + res.groupFile.messages[index].time;
        message.innerHTML = res.groupFile.messages[index].message;
        container.append(user);
        container.append(message);
        messageList.append(container);
    }

    for (let index = 0; index < res.groupFile.files.length; index++) {
        let container = document.createElement("div");
        let user = document.createElement("h5");
        let file = document.createElement("a");
        user.innerHTML = res.groupFile.files[index].user + " - " + res.groupFile.files[index].time;
        file.innerHTML = res.groupFile.files[index].name;
        file.setAttribute("href", res.groupFile.files[index].file);
        file.setAttribute("download")
        container.append(user);
        container.append(file);
        messageList.append(container);
    }
}