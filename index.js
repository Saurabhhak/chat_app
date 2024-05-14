global.__isDev__ = (process.env.NODE_ENV || "").toLowerCase() !== "production";

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser'); // Import cookieParser
const fs = require("node:fs");
const formidable = require('formidable');
const {generateToken, addUser, performLogin, setCookieToken, setupDB, isTokenValid} = require("./lib/utilz.js")
const {router} = require("./lib/router.js");
const { attachSocketDataEvents } = require('./lib/socket.js');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicDirectoryPath = path.join(__dirname, 'public');
console.log({publicDirectoryPath})
// to log every request
app.use((req, res, next) => {
    // console.log(req.method, req.url)
    res.on("close", () => {
        console.log(res.statusCode, req.method, req.url)
    })
    next();
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(async function checkAuthentication(req, res, next) {
    // return next();
    // if (req.url != "/chat") return next();

    if (req.url == "/chat") {
        let isValid = false;
        if(!!req.cookies.utoken){
            isValid = await isTokenValid(req.cookies.utoken);
        }

        if (!isValid) {
            if(__isDev__) console.log("authentication failed")
            return res.redirect('/login');
        }
    }
    next();
});

app.use(router);

app.use((req, res, next) => {
    let url = req.url
    let filepath = path.join(publicDirectoryPath, url)
    // if ()
    // console.log({ filepath })
    if (!filepath.endsWith(".html") && fs.existsSync(filepath + ".html")) {
        res.sendFile(filepath + ".html")
    } else
        next();
})

app.use(express.static(publicDirectoryPath));

const userSockets = {}

// Handle socket connections
io.on('connection', (socket) => {
    attachSocketDataEvents(socket, userSockets);
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected!');
    });
});

// Define the port to listen on
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}\n'${__isDev__ ? "DEVELOPMENT":"PRODUCTION"}' MODE`);
    setupDB();
});
