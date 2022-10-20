////IMPORT////
//Import-"message.json"
const msg = require("./messages.json");
//Import-"gsKeys.json"
const gsKeys = require("./gsKeys.json");


//Rgular-Expression//
//More info on reGex/ regExp - https://regexr.com
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);


//Google-Sheets-Variables//
//Import-GoogleSheets.api//
const {google} = require('googleapis');
//gsClient
const gsClient = new google.auth.JWT(
	gsKeys.client_email, 
	null, 
	gsKeys.private_key, 
    //scape
	['https://www.googleapis.com/auth/spreadsheets']
);
//Document-Variables
const botSheet = '14U7s1e1TqmqeGNLgW74n1xc_txBY6abLgyvJx86PGLg'
const ppUserRange = '!pp!A1:B'


//Twitch-Variables//
//Logins
const userName = process.env.T_USERNAME;
const userPass = process.env.T_OAUTH_TOKEN;
const targetChannel = process.env.T_CHANNEL;
//Twitch-Options//
const opts = {
    options: { debug: true,},
        connection: {
        reconnect: true,
        secure: true,
        },
        //Bot-Identity-Login
        identity: {
            username: userName,
            password: userPass
        },
        //Target-Channel
        channels: [ targetChannel ]
        };

//Timer-Variables
const ask = msg.timedMessages.ask;
const askTime = msg.timedMessages.askTime;
const socials = msg.timedMessages.socials;
const socialsTime = msg.timedMessages.socialsTime;
const discord = msg.timedMessages.discord;
const discordTime = msg.timedMessages.discordTime;
const followMe = msg.timedMessages.followMe;
const followMeTime = msg.timedMessages.followMeTime;
const lovLurkers = msg.timedMessages.lovLurkers;
const lovLurkersTime = msg.timedMessages.lovLurkersTime;
const pp = msg.timedMessages.pp;
const ppTime = msg.timedMessages.ppTime;
const wisdom = msg.timedMessages.pp;
const wisdomTime = msg.timedMessages.ppTime;
//Cooldown-Variables
var active = true;
var ppCooldown = 1;
var viagraCooldown = 5;
//Lurk-Variables
var lurkCount = 0;
var lurkers = [];


////Export////
module.exports = {
    active,
    ppCooldown,
    viagraCooldown,
    wisdom,
    wisdomTime,
    gsClient,
    regexpCommand, 
    botSheet,
    ppUserRange,
    userName, 
    userPass, 
    targetChannel, 
    opts, 
    ask, 
    askTime, 
    socials, 
    socialsTime, 
    discord, 
    discordTime, 
    followMe, 
    followMeTime, 
    lovLurkers, 
    lovLurkersTime,
    lurkCount,
    lurkers,
    pp,
    ppTime
};
