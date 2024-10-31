export{populate}
import {leaveGroup, selectGroup} from "./group.mjs";

async function populate() {
    let login = JSON.parse(localStorage.getItem("loginData"));
    if(login.member) {
        let container = document.getElementById("groupList")
        for (let index = 0; index < login.member.length; index++) {
            let div = document.createElement("div");
            let biggerDiv = document.createElement("div");
            let p = document.createElement("h2");
            let button = document.createElement("button");
            button.innerHTML = "Leave Group";
            button.addEventListener("click", async ()=> {await leaveGroup(login.username, login.member[index])});
            let button2 = document.createElement("button");
            button2.innerHTML = "Select Group";
            button2.addEventListener("click", async ()=> {await selectGroup(login.username, login.member[index])});
            p.innerHTML = login.member[index];
            div.append(button);
            div.append(button2);
            biggerDiv.append(p);
            biggerDiv.append(div);
            container.append(biggerDiv);
        }
    }
}