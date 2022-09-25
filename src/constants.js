//Rgular-Expression//
//More info on reGex/ regExp - https://regexr.com
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

//Twitch-Variables//
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

module.exports = {regexpCommand, userName, userPass, targetChannel, opts};