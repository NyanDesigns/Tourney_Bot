////IMPORT////

//Import-"gsKeys.json"
const gsKeys = require("./Jsons/gsKeys.json");
//Import-GoogleSheets.api//
const {google} = require('googleapis');
const { getDifference, joinObj } = require("./functions");


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
    const botSheet = process.env.B_SHEET;
    const twitchIdRange = process.env.B_S_twitchIdRange;
    const clientChannelRange = process.env.B_S_clientChannelRange;
    const loggerRange = process.env.B_S_loggerRange;
    const ppUserRange = process.env.B_S_ppUserRange;


///Twitch-Variables///

//Account-Variables//
    //Logins
    const botName = process.env.B_USERNAME;
    const botPass = process.env.B_OAUTH_TOKEN;
    const botChannel = process.env.B_CHANNEL;
    const botChannelist = botChannel.split(',');
    const adChannel = process.env.A_CHANNEL;

//CHECK-FOR-BOT-CHANNEL-LIST
    //Authorize-{Sheets}
    gsClient.authorize(function(e, tokens){
        if(e){
            console.log(e);
            return;
        } else {
            console.log('Connected to Google-Sheets api.');
            gsrun(gsClient);
        }
    });
    //Connect-to-{Sheets}
    async function gsrun(cl){
        const gsapi = google.sheets({version:'v4', auth: cl });
        //Get-{Sheet-Values}
        const [,...values] = (await gsapi.spreadsheets.values.get({ 
            spreadsheetId: botSheet, 
            range: clientChannelRange
        })).data.values;
        //Flattern-Tree
        const clientList = values.flat(1);			
        setTimeout(() => {

            //clientList-NEEDS-updating
            if (clientList.length > botChannelist.length){
                //1)Find-Channels-Need-Updating
                let updatedList = [];
                clientList.forEach( (clientList, i) => 
                updatedList.push(joinObj("#", clientList))
                );
                let updateList = getDifference(updatedList, botChannelist)
                //2)Log-Channels-Need-Updating
                console.log(`------------------------------------`);
                console.log(`Bot-Client-Channel-List-NEEDS-Update`);
                console.log(updateList);
                console.log(`------------------------------------`);
            } 
            //clientList-is-UPDATED
            else if (clientList.length == botChannelist.length){
                //1)Log-Updated-Message
                console.log(`----------------------------------`);
                console.log(`Bot-Client-Channel-List-is-UPDATED`);
                console.log(botChannelist);
                console.log(`----------------------------------`);
                
            }

        }, (7000));
    }


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
    var dailyChatters = [];
    var hornyJail = [];
    var ppCooldown = 1;
    var ppfightJail = [];
    var ppfightCooldown = 30;
    var viagrafightJail = [];
    var viagrafightCooldown = 15;
    var viagraJail = [];
    var viagraCooldown = 5;
    var boomerJail = [];
    var boomerCooldown = 10;

//Lurk-Variables
    var lurkCount = 0;
    var lurkers = [];

//Fight-variables
    var ppfightChallengersList = [];
    var ppfightOpponentList = [];
    var vfightChallengersList = [];
    var vfightOpponentList = [];

//Rgular-Expression//
    //More info on reGex/ regExp - https://regexr.com
    const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);


module.exports = { 
///Google-Sheets-Variables///
    gsClient, botSheet, ppUserRange,
    twitchIdRange, loggerRange,
//Account-Variables//
    botName, botPass, botChannel, botChannelist, adChannel, opts,
//Cooldown-Variables
    dailyChatters,
    hornyJail, ppCooldown,
    ppfightJail, ppfightCooldown,
    viagrafightJail, viagrafightCooldown,
    viagraJail, viagraCooldown,
    boomerJail, boomerCooldown,
//Lurk-Variables
    lurkCount, lurkers,
//Fight-variables
    ppfightChallengersList, ppfightOpponentList,
    vfightChallengersList, vfightOpponentList,
//Rgular-Expression//
    regexpCommand 
};
