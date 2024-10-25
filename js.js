//local url
let url = "http://127.0.0.1:3000";
const { Buffer } = require('node:buffer');

var login = false;
window.onload = async function() {
    let date = new Date();
    //localStorage.clear(); //manual log out
    if (date.getDay() > localStorage.getItem("loginTimer")) {
        localStorage.clear();
    }
    if(localStorage.getItem("loginData")) {
        populate();
        login = true;
    }

    if(document.getElementById("loginForm")) {
        document.getElementById("registerForm").addEventListener("submit", async ()=> {await register(document.getElementById("registerForm"))});
        document.getElementById("loginForm").addEventListener("submit", async ()=> {await login(document.getElementById("loginForm"))});
    }

    if(document.getElementById("pictureForm")) {
        document.getElementById("pictureForm").addEventListener("submit", async ()=> {await uploadProfileImg(document.getElementById("pictureForm"))});
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

function populate() {

}

async function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    }) ;
}

async function uploadProfileImg(img) {
    console.log(img);
    let file = img[0].files[0];
    let usableFile;
    try {
        usableFile = await readFile(file);   
    } catch (error) {
        console.log("invalid file, ignoring for serverside error");
    }


    let user = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/uploadPicture", {
        method: 'PUT',
        body: JSON.stringify({username: user.username, img: usableFile}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    console.log(res);
    if(res.error) {
        let errorHandler = document.getElementById("profileUploadError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        let res = await fetch(url + "/login", {
            method: 'POST',
            body: JSON.stringify({username: user.username}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        localStorage.setItem("loginData", JSON.stringify(res.userdata));
        window.location.reload();
    }
}

/*
let res = await fetch(url + "/managment/adminLoginPage", {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => response.json())
*/