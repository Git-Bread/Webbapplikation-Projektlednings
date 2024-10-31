let url = "http://127.0.0.1:3000";
export {leaveGroup, joinGroup, createGroup, selectGroup}
import { reLog } from "./login.mjs";

//leave group
async function leaveGroup(login, group) {
    let res = await fetch(url + "/groupDelete", {
        method: 'DELETE',
        body: JSON.stringify({username: login, groupname: group}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //error handling
    if(res.error) {
        let errorHandler = document.getElementById("joinError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    //removes from localstorage to prevent error while trying to load group that member is no longer associated with
    else if(res.message){
        localStorage.removeItem("lastGroup");
        reLog(login); //refresh
    }
}

//join group
async function joinGroup(join) {
    let login = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/groupJoin", {
        method: 'PUT',
        body: JSON.stringify({username: login.username, groupname: join[0].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //error handling
    if(res.error) {
        let errorHandler = document.getElementById("joinError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        reLog(login.username); //refresh
    }
}

//create new group
async function createGroup(join) {
    let login = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/groupCreate", {
        method: 'POST',
        body: JSON.stringify({username: login.username, groupname: join[0].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //error handling
    if(res.error) {
        let errorHandler = document.getElementById("joinError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        await reLog(login.username); //refresh
    }
}

//select group to fetch information from
async function selectGroup(username, groupname) {  
    localStorage.setItem("lastGroup", JSON.stringify({username, groupname}));
    let res = await fetch(url + "/groupFetch", {
        method: 'POST',
        body: JSON.stringify({username: username, groupname: groupname}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //generic error handling
    if(res.error) {
        console.log("something went wrong");
    }

    //getting containers for content
    let members = document.getElementById("members")
    let messageList = document.getElementById("messageBox")
    let getFile = document.getElementById("getFile")

    //inserting the group name
    document.getElementById("groupname").innerHTML = res.groupFile.name;

    //loop to insert all members
    for (let index = 0; index < res.groupFile.members.length; index++) {
        let p = document.createElement("p");
        p.innerHTML = res.groupFile.members[index];
        members.append(p);
    }

    //loop to insert all messages
    for (let index = 0; index < res.groupFile.messages.length; index++) {
        let container = document.createElement("div");
        let user = document.createElement("h5");
        let message = document.createElement("p");

        //time formating
        let date = new Date(res.groupFile.messages[index].time);
        user.innerHTML = res.groupFile.messages[index].user + " - " + date.getHours() + ":" + date.getMinutes() + " " + date.getDate() +"/"+ date.getMonth();

        message.innerHTML = res.groupFile.messages[index].message;
        container.append(user);
        container.append(message);
        messageList.append(container);
    }

    //loop to insert all files
    for (let index = 0; index < res.groupFile.files.length; index++) {
        let container = document.createElement("div");
        let user = document.createElement("h5");
        let file = document.createElement("a");
        let date = new Date(res.groupFile.messages[index].time);
        user.innerHTML = res.groupFile.files[index].user + " - " + date.getHours() + ":" + date.getMinutes() + " " + date.getDate() +"/"+ date.getMonth() + "/" + date.getFullYear();
        file.innerHTML = res.groupFile.files[index].name;

        //files need a download attribute and be specified as a href to be downloadable
        file.setAttribute("download", res.groupFile.files[index].file);
        let buff = Buffer.from(res.groupFile.files[index].file); //create a buffer from the dataURL as a intermediat step
        let refinedFile = buff.toString('base64'); //converts buffer to string with base64 encoding
        file.setAttribute("href", atob(refinedFile)); //decodes base64 data so its usable and puts it into href for download
        file.setAttribute("download", res.groupFile.files[index].name);

        container.append(user);
        container.append(file);
        getFile.append(container);
    }
}