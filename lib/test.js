const {execute, hash, wait} = require("./utilz")

;
(async()=>{
    await wait(1000);
    console.log("performing login")
    let email = 'x@y..z'
    let password = "root";
    let full_name = "Abhay Bisht"
    let h = hash(password)
    console.log({h});

    let res = await execute(`select * from users`)
    // let res2 = await execute(`select * from users where email=?`, [email])
    console.log(res.length)
})();