const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser'); // Import cookieParser
const fs = require("node:fs");
const formidable = require('formidable');
const { generateToken, addUser, performLogin, setCookieToken, execute, isTable, getUsernameFromToken } = require("./utilz.js")
const { Router } = require("express");
const { searchUser } = require("./utilz");
const { setupDEVroutes } = require('./devRoutes.js');


const router = Router()

if (global.__isDev__) setupDEVroutes(router)

router.post("/login", async (req, res, next) => {
    if (!req.body) return next();
    let user_email = req.body['user-email']
    let password = req.body['password']

    if (user_email && password) {
        // const isValid = await checkLogin(user_email, password)
        // if (! isValid) return;
        const token = await performLogin(user_email, password);
        if (!token) return res.send("LOGIN FAILED <BR> <a href=/login>RETRY</a>")
        setCookieToken(res, token);
        res.redirect("/")
    } else {
        next();
    }
})
router.post("/register", async (req, res, next) => {
    if (!req.body) return next();
    let user_email = req.body['user-email']
    let password = req.body['password']
    let full_name = req.body['full-name']

    if (user_email && password && full_name) {
        const result = await addUser({ user_email, password, full_name });
        if (!result) return res.send("Register Failed<br> <a href=/signup>Try Again</a>")
        return res.redirect("/")
    }
    next();w
})

router.get("/logout", (req, res, next) => {
    execute("delete from user_login_tokens where token=$1", [req.cookies.utoken]);
    res.cookie('utoken', '', { expires: new Date(0) });
    res.redirect("/")
})

router.post("/api/searchuser", async (req, res) => {
    let searchStr = req.body.search_str;
    // console.log(req.body);
    if (!searchStr) return res.json({ result: [], error: "EMPTY SERACH STR" })
    const result = await searchUser(searchStr)
    // console.log(result)
    // res.json({result:Array.from({length: 10}).map((a,i)=>({name:"Abhay"+i}))})
    res.json({ result })
})

router.post("/api/myusername", async (req, res, next)=>{
    let {utoken = ""} = req.cookies;
    if(!utoken.trim()) return res.json({error:400, message:`invalid user token : '${utoken}'`})
    let username = await getUsernameFromToken(utoken);
    if(!username) return res.json({error:401, message:`no username for given token : '${utoken}'`});
    return res.json({username})
})

router.get("/", (req, res) => res.redirect("/chat"))

module.exports = { router };












