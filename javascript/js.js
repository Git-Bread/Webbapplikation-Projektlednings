//local url
let url = "http://127.0.0.1:3000";
import {loginCheck, register, reLog} from "./login.mjs";
import {populate} from "./populate.mjs";
import {joinGroup, createGroup, selectGroup} from "./group.mjs";
import {uploadProfileImg, uploadFile} from "./filehandling.mjs";
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

    if(document.getElementById("messageForm")) {
        document.getElementById("messageForm").addEventListener("submit", async ()=> {await uploadMessage(document.getElementById("messageForm"))});
    }

    if(document.getElementById("fileUpload")) {
        document.getElementById("fileUpload").addEventListener("submit", async ()=> {await uploadFile(document.getElementById("fileUpload"))});
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
            localStorage.setItem("selected", 0)
        })
        document.getElementById("optionTable").children[1].addEventListener("click", () => {
            members.style.display = "none";
            message.style.display = "none";
            getFile.style.display = "block";
            enterFile.style.display = "none";
            localStorage.setItem("selected", 1)
        })
        document.getElementById("optionTable").children[2].addEventListener("click", () => {
            members.style.display = "none";
            message.style.display = "none";
            getFile.style.display = "none";
            enterFile.style.display = "block";
            localStorage.setItem("selected", 2)
        })
        document.getElementById("optionTable").children[3].addEventListener("click", () => {
            members.style.display = "block";
            message.style.display = "none";
            getFile.style.display = "none";
            enterFile.style.display = "none";
            localStorage.setItem("selected", 3)
        })
        const event = new Event("click");
        switch(localStorage.getItem("selected")) {
            case "0":
                console.log("ran");
                document.getElementById("optionTable").children[0].dispatchEvent(event);
                break;
            case "1":
                document.getElementById("optionTable").children[1].dispatchEvent(event);
                break;
            case "2":
                document.getElementById("optionTable").children[2].dispatchEvent(event);
                break;
            case "3":
                document.getElementById("optionTable").children[3].dispatchEvent(event);
                break;
        }

        if (localStorage.getItem("lastGroup")) {
            let oldGroup = JSON.parse(localStorage.getItem("lastGroup"));
            console.log(oldGroup);
            selectGroup(oldGroup.username, oldGroup.groupname);
        }
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

async function uploadMessage(message) {
    let login = JSON.parse(localStorage.getItem("loginData"));
    console.log(document.getElementById("groupname").innerHTML);
    let res = await fetch(url + "/groupMessage", {
        method: 'POST',
        body: JSON.stringify({username: login.username, groupname: document.getElementById("groupname").innerHTML, message: message[0].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        let errorHandler = document.getElementById("messageError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        await reLog(login.username);
    }
}