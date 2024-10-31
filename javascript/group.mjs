let url = "http://127.0.0.1:3000";
export {leaveGroup, joinGroup, createGroup, selectGroup}
import { reLog } from "./login.mjs";

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
        localStorage.removeItem("lastGroup");
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

async function selectGroup(username, groupname) {  
    localStorage.setItem("lastGroup", JSON.stringify({username, groupname}));
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
    let messageList = document.getElementById("messageBox")
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
        let date = new Date(res.groupFile.messages[index].time);
        user.innerHTML = res.groupFile.messages[index].user + " - " + date.getHours() + ":" + date.getMinutes() + " " + date.getDate() +"/"+ date.getMonth();
        message.innerHTML = res.groupFile.messages[index].message;
        container.append(user);
        container.append(message);
        messageList.append(container);
    }

    for (let index = 0; index < res.groupFile.files.length; index++) {
        let container = document.createElement("div");
        let user = document.createElement("h5");
        let file = document.createElement("a");
        let date = new Date(res.groupFile.messages[index].time);
        user.innerHTML = res.groupFile.files[index].user + " - " + date.getHours() + ":" + date.getMinutes() + " " + date.getDate() +"/"+ date.getMonth() + "/" + date.getFullYear();
        file.innerHTML = res.groupFile.files[index].name;
        file.setAttribute("download", res.groupFile.files[index].file);

        let buff = Buffer.from(res.groupFile.files[index].file);
        let refinedFile = buff.toString('base64');
        file.setAttribute("href", atob(refinedFile));
        file.setAttribute("download", res.groupFile.files[index].name);

        container.append(user);
        container.append(file);
        getFile.append(container);
    }
}