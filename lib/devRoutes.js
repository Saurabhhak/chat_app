const { isTable , execute } = require("./utilz");

function setupDEVroutes(router){
    router.post("/api/db", async (req, res, next)=>{
        const {action, data} = req.body;
        if (action == "execute"){
            let result;
            try {
                result = await execute(data);
            } catch (error) {
                result = error.toString()
                console.error("ERROR IN EXECUTE DEV ROUTE", req.body, error);
            }
            return res.json(result);
        } 
        else if(action == "istable"){
            let {table} = data;
            let result = await isTable(table);
            return res.json({result})
        }
    
        next();
    })
}

module.exports = {
    setupDEVroutes
}