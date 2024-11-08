let url = "http://127.0.0.1:3000";
export{loginCheck, register, reLog};

//check initial login
async function loginCheck(login) {
    let res = await fetch(url + "/login", {
        method: 'POST',
        body: JSON.stringify({username: login[0].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //error handling
    if(res.error) {
        let errorHandler = document.getElementById("loginError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }

    //set localstorage to keep persistent login, not very safe
    else if(res.message){
        let date = new Date();
        localStorage.setItem("loginData", JSON.stringify(res.userdata));
        localStorage.setItem("loginTimer", date.getDay());
        window.location.reload()
    }
}

//registers new user
async function register(register) {
    let res = await fetch(url + "/register", {
        method: 'POST',
        body: JSON.stringify({username: register[0].value, email: register[1].value}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())

    //error handling
    if(res.error) {
        let errorHandler = document.getElementById("registerError");
        errorHandler.innerHTML = res.error;
        errorHandler.style.display = "block";
    }
    else if(res.message){
        setTimeout(1000);
        await loginCheck(register);
    }
}

//function for reloging to refresh the localstorage data, otherwise persistant login wont get new data
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