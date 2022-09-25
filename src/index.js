////IMOPRT////

//Load-.ENV-MODULE//
require('dotenv').config();

//Import-"commands.js"//
const com = require("./commands.js");
//Import-"constants.js"//
const con = require("./constants.js");
//Import-Twitch.api(tmi.js)//
const tmi = require('tmi.js');
const { channel } = require('tmi.js/lib/utils');



////TWITCH-FUNCTIONS////

//Bot-Connect-to-Twitch//
const client = new tmi.client(con.opts);
client.connect().catch(console.error);

client.connect();

//Bot-Announcments//
setInterval(() => {
	client.say(con.targetChannel,'Testing...1.2.4'); 
}, 5 * 1000);

//Bot-Replies//
//Bot-Listen-to-Twitch-chat
client.on('message', (channel, context, message, self) => {
	if ( self ) return; //Check-Self

	//Match-command-Type
	if(message.match(con.regexpCommand)){

		//Message-Handlers
		const [raw, command, argument] = message.match(con.regexpCommand);
		const { response } = com.commands[command] || {};
	
		if ( typeof response === 'function' ) {
			client.say(channel, response(argument));
		} else if ( typeof response === 'string' ) {
			client.say(channel, response);
		}	

	}

  });