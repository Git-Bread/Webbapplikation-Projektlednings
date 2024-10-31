let url = "http://127.0.0.1:3000";
export {uploadProfileImg, uploadFile}
import { reLog } from "./login.mjs";

//filereader to process file data into DataURL to later turn into blob and then be decrypt it so its usable
async function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    }) ;
}

//uploadsd profile image
async function uploadProfileImg(img) {
    //gets files
    let file = img[0].files[0];
    let usableFile;

    //file conversion, needs try catch due to many potential error vectors
    try {
        usableFile = await readFile(file);   
    } catch (error) {
        console.log("invalid file, ignoring for serverside error");
        let errorHandler = document.getElementById("profileUploadError");
        errorHandler.innerHTML = "Invalid file, please try again";
        errorHandler.style.display = "block";
        return
    }

    //makes sure the file isent to large for the database (16MB), might be prudent to lower it but it has error handling so whatever
    if(file.size > 16000000) {
        let errorHandler = document.getElementById("profileUploadError");
        errorHandler.innerHTML = "File to large, please choose a file under 16MB";
        errorHandler.style.display = "block";
        return;
    }

    //server call
    let user = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/uploadPicture", {
        method: 'PUT',
        body: JSON.stringify({username: user.username, img: usableFile}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //response error handling
    if(res.error) {
        let errorHandler = document.getElementById("profileUploadError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        await reLog(user.username); //refresh
    }
}

//uploading files to database group
async function uploadFile(newFile) {
    let file = newFile[0].files[0];
    let usableFile;

    //making sure the file works
    try {
        usableFile = await readFile(file);   
    } catch (error) {
        console.log("invalid file, ignoring for serverside error");
        let errorHandler = document.getElementById("fileUploadError");
        errorHandler.innerHTML = "Invalid file, please try again";
        errorHandler.style.display = "block";
        return
    }

    if(file.size > 16000000) {
        let errorHandler = document.getElementById("fileUploadError");
        errorHandler.innerHTML = "File to large, please choose a file under 16MB";
        errorHandler.style.display = "block";
        return;
    }

    //server call
    let user = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/groupUploadFile", {
        method: 'PUT',
        body: JSON.stringify({username: user.username, groupname: document.getElementById("groupname").innerHTML, file: usableFile, fileName: file.name}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //error handling
    if(res.error) {
        let errorHandler = document.getElementById("fileUploadError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        await reLog(user.username);
    }
}