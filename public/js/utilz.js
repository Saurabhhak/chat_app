
/**
 * 
 * @param {string} cssQuery
 * @returns {[Element]}
 */
export const $ = cssQuery => document.querySelector(cssQuery);

/**
 * 
 * @param {string} cssQuery
 * @returns {[Element]}
 */
export const $$ = cssQuery => document.querySelectorAll(cssQuery);

const input = document.querySelector(".message-input")
const messages = document.querySelector("#message-box")

export const data ={
    activeUser: {name:"Nobody", username:""},
    username:""
}

export const friends = [
    {
        name: "ABHAY"
    },
    {
        name: "SAURABH"
    },
    {
        name: "SUMO"
    },
]

function createUser(userInfo) {

    let { name = false, username = "" } = userInfo
    if (!name) {
        return console.error(`userInfo.name is invalid : '${name}'`)
    }

    return `
    <div class="user-info" data-username="${username}">
    
    <div class="ui-logo centered"><span class="material-symbols-outlined">person</span></div>
                    <div class="ui-name">${name}</div>
                    </div>`
}

function attachClickToUsers() {
    for (let user of $("#user-cart").children) {
        user.addEventListener("click", e => {
            // e.stopPropagation();
            let me = e.target;
            while (me.className != "user-info") {
                me = me.parentNode;
            }
            let name = me.children[1].textContent;
            let username = me.getAttribute("data-username");
            setActiveUser({ name , username })
        })
    }
}

export function renderUsers(users) {
    // console.table(users)
    const user_cart = $("#user-cart")
    user_cart.innerHTML = "";
    for (let user of users) {
        // console.log({user})
        let { name = false , username=false} = user
        if (!name || !username) {
            console.log(`USER '${name}' is invalid`)
            continue;
        }
        let userHTML = createUser({ name , username})
        user_cart.innerHTML += userHTML;
    }
    attachClickToUsers();
}

export function search_friends(search_str) {
    const friends_founded = [];
    // let search_str = $("")
    for (let friend of friends) {
        let { name = "" } = friend;
        if (!name) continue;
        let a = name.toLowerCase().trim()
        let b = search_str.toLowerCase()
        if (a.startsWith(b)) {
            friends_founded.push({ name });
        }
    }

    renderUsers(friends_founded);
}

function createMessage(message){
    let {body="", type="me" } = message;
    return `<div class="chat-message" data-type="${type}">${body}</div>`
}

function setActiveUser({ name , username } = {}) {
    if (!name) return;
    data.activeUser = {name, username};
    $("#username-box").textContent = name
    const chats = loadChat(username);
    $("#chat-box-pannel").setAttribute("data-state", "");
    loadChat(data.activeUser.username)
}

window.data = data

export function appendMessageOnView(message){
    let {body="", type="me" } = message;
    if (body) {
        messages.innerHTML += `<div class="chat-message" data-type="${type}">${body}</div>`
        messages.scrollTop = messages.scrollHeight;
    }
}   

export function appendChat(message){
    let {chatid, sender, body} = message;
    if(chatid == undefined) return console.error(`chatid not defined in message object`, {message});
    let chats = localStorage.getItem("chat-"+chatid) || "[]"
    chats = JSON.parse(chats);
    chats.push({sender, body});
    localStorage.setItem("chat-"+chatid, JSON.stringify(chats))
}

function loadChat(chatid){
    const chats = JSON.parse(localStorage.getItem("chat-"+chatid)||"[]")
    const messages = $("#message-box")
    messages.innerHTML = "";

    for(let message of chats){
        let {sender, body} = message;
        let msg = createMessage({body, type: (sender == data.username ? "me" : "you")});
        messages.innerHTML += msg;
    }
}

export async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const responseData = await response.json();
        // console.log('POST response:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error:', error);
    }
}

window.postData = postData;

var search_user_count = 1;
export function search_user(search_str) {
    search_user_count += 1;
    let myId = search_user_count;
    return new Promise(async (resove, reject) => {
        // const search_str = $("#mp-search-input").value.trim()
        const data = await postData("/api/searchuser", { search_str })

        // to prevent race condition in networiking
        if (myId != search_user_count) return;

        const { result } = data || {}

        // console.log({ result })
        renderUsers(result);
        resove();
        // uplaod current app. state

    })
}
