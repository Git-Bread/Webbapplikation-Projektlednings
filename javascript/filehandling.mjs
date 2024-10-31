let url = "http://127.0.0.1:3000";
export {uploadProfileImg, uploadFile}
import { reLog } from "./login.mjs";
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

async function uploadFile(newFile) {
    let file = newFile[0].files[0];

    let usableFile;
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

    console.log(file)

    let user = JSON.parse(localStorage.getItem("loginData"));
    let res = await fetch(url + "/groupUploadFile", {
        method: 'PUT',
        body: JSON.stringify({username: user.username, groupname: document.getElementById("groupname").innerHTML, file: usableFile, fileName: file.name}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    if(res.error) {
        let errorHandler = document.getElementById("fileUploadError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        await reLog(user.username);
    }
}