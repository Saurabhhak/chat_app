const dbconfig = require("../dbconfig.json")
const {Client} = require("pg")

const connectionString = "postgres://postgres:root@localhost:5432/chat_app"
const client = new Client({connectionString});

client.connect();
const wait = (n=0) => new Promise(res => setTimeout(res, n));

;(async ()=>{

await wait(10);
let res = await client.query("insert into admins (id, name) values ($1,$2)", [3,"Sarthak"]);
console.log(res.rows);
res = await client.query("select * from admins");
console.log(res.rows);

await client.end();

})(client);