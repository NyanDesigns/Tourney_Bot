//Load-.ENV-MODULE//
require('dotenv').config();

//Import-"commands.js"//
const com = require("./commands.js");
//Import-"constants.js"//
const con = require("./constants.js");
//Import-Twitch.api(tmi.js)//
const tmi = require('tmi.js');
const { channel } = require('tmi.js/lib/utils');

//Bot-Connect-to-Twitch
const client = new tmi.client(con.opts);

client.connect().catch(console.error);

//Bot-Funtions
client.connect();

client.on('message', (channel, context, message) => {

	//Check-'message' = self
	const isBot = context.username.toLowerCase() !== userName.toLowerCase();
	if ( !isBot ) return;

	//Message-Handlers
	if(message.match(regexpCommand)){
		const [raw, command, argument] = message.match(regexpCommand);
		const { response } = com.commands[command] || {};
	
		if ( typeof response === 'function' ) {
			client.say(channel, response(argument));
		} else if ( typeof response === 'string' ) {
			client.say(channel, response);
		}	
	}

  });