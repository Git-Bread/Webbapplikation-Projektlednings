//local url
let url = "http://127.0.0.1:3000";

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

    if(!document.getElementById("loginForm") && !login) {
        window.location = "login.html";
    }

    if(document.getElementById("profile")) {
        let profile = document.getElementById("profile");
        let user = localStorage.getItem("loginData");
        console.log(user.username);
        console.log(profile.children[0]);
        profile.children[1].innerHTML = user.username;
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
        window.location = "index.html";
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

/*
let res = await fetch(url + "/managment/adminLoginPage", {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => response.json())
*/