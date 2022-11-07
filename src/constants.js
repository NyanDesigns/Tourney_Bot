////IMPORT////

//Import-"gsKeys.json"
const gsKeys = require("./Jsons/gsKeys.json");
//Import-GoogleSheets.api//
const {google} = require('googleapis');


////EXPORT////

///Google-Sheets-Variables///
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

///Twitch-Variables///

//Account-Variables//
    //Logins
    const botName = process.env.B_USERNAME;
    const botPass = process.env.B_OAUTH_TOKEN;
    const botChannel = process.env.B_CHANNEL;
    const botChannelist = botChannel.split(',');
    const adChannel = process.env.A_CHANNEL;
    //Twitch-Options//
    const opts = {
        options: { debug: true,},
            connection: {
            reconnect: true,
            secure: true,
            },
            //Bot-Identity-Login
            identity: {
                username: botName,
                password: botPass
            },
            //Target-Channel
            channels: botChannelist
            };

//Cooldown-Variables
    var hornyJail = [];
    var activePP = true;
    var ppCooldown = 1;
    var activeViagra = true;
    var viagraCooldown = 2;

//Lurk-Variables
    var lurkCount = 0;
    var lurkers = [];

//Rgular-Expression//
    //More info on reGex/ regExp - https://regexr.com
    const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);


module.exports = { 
///Google-Sheets-Variables///
    gsClient, botSheet, ppUserRange,
//Account-Variables//
    botName, botPass, botChannel, botChannelist, adChannel, opts,
//Cooldown-Variables
    hornyJail,
    activePP, ppCooldown,
    activeViagra, viagraCooldown,
//Lurk-Variables
    lurkCount, lurkers,
//Rgular-Expression//
    regexpCommand 
};
