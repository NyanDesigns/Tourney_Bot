////IMPORT////
//Import-"message.json"
const msg = require("./messages.json");

//Rgular-Expression//
//More info on reGex/ regExp - https://regexr.com
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

//Twitch-Variables//
//Bot-Variables
const userName = process.env.T_USERNAME;
const userPass = process.env.T_OAUTH_TOKEN;
const targetChannel = process.env.T_CHANNEL;
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
//Lurk-Variables
var lurkCount = 0;
var lurkers = [];


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


////Export////
module.exports = {
    regexpCommand, 
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
    lurkers
};