
const input = document.querySelector(".message-input")
const messages = document.querySelector("#message-box")
function sendMessage(){
    let txt  = input.value;
    if (txt.slice()){
        messages.innerHTML += `<div class="chat-message">${txt}</div>`
    }
}

const friends = [
    {
        name:"ABHAY"
    },
    {
        name:"SAURABH"
    },
    {
        name:"SUMO"
    },
    {
        name:"SUMO"
    },
    {
        name:"SUMO"
    },
    {
        name:"SUMO"
    },
    {
        name:"SUMO"
    },
    {
        name:"SUMO"
    },
    {
        name:"SUMO"
    },
    {
        name:"SUMO"
    },
]

function createUser(userInfo){

    let {name = false, id=""} = userInfo
    if(!name){
        return console.error(`userInfo.name is invalid : '${name}'`)
    }

    return `
                <div class="user-info" id="${id}">

                    <div class="ui-logo centered"><span class="material-symbols-outlined">person</span></div>
                    <div class="ui-name">${name}</div>
                </div>`
}

function attachClickToUsers(){
    for(let user of $("#user-cart").children){
        user.addEventListener("click", e =>{
            // e.stopPropagation();
            let me = e.target;
            while(me.className != "user-info"){
                me = me.parentNode; 
            }
            let name = me.children[1].textContent;
            setActiveUser({name})
        })
    }
}

// const userData = (name) => ({name});

function loadUsers(users){
    const user_cart = $("#user-cart")
    user_cart.innerHTML = "";
    for (let user of users){
        // console.log({user})
        let {name=false} = user
        if(!name) {
            console.log(`USER '${name}' is invalid`)
            continue;
        }
        let userHTML = createUser({name})
        user_cart.innerHTML += userHTML;
    }
    attachClickToUsers();
}

const $ = q => document.querySelector(q);

function search_friends(search_str){
    const friends_founded = [];
    // let search_str = $("")
    for(let friend of friends){
        let {name=""} = friend;
        if(!name) continue;
        let a=name.toLowerCase().trim()
        let b = search_str.toLowerCase()
        if(a.startsWith(b)){
            friends_founded.push({name});
        }
    }

    loadUsers(friends_founded);
}

$("#mp-search-input").addEventListener("input", e =>{
    let value = e.target.value.trim();
    if($("#new-id").checked){
        // serach from db
        search_user(value)
    } else{
        search_friends(value);
    }
    
})

function setActiveUser({name}={}){
    if(!name) return;
    $("#username-box").textContent=name
}

loadUsers(friends)

async function postData(url, data) {
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

var i = 1;
function search_user(search_str){
    i += 1;
    let myId = i;
    return new Promise(async (resove, reject)=>{
        // const search_str = $("#mp-search-input").value.trim()
        const data = await postData("/api/search", {search_str})
        // console.log({data})  
        if(myId != i) return;
        
        const {result} = data || {}

        console.log({result})
        loadUsers(result);
        resove();
        // uplaod current app. state

    })
}
