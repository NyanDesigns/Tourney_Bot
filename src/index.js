try{
////IMOPRT////
///Files
	//Load-.ENV-MODULE//
	require('dotenv').config();
	///JS
	//Import-"commands.js"//
	const com = require("./handlers/command/socials");
	//Import-"constants.js"//
	const con = require("./constants");
	//Import-"timers.js"//
	const tmer = require('./handlers/timers');
	//Import-"timers.js"//
	const pp = require('./handlers/command/pp');
	///Json
	//Import-"message.json"
	const reaction = require("../src/Jsons/reaction.json");
	//Import-"message.json"
	const time = require("../src/Jsons/time.json");
///API
	//Import-Twitch.api(tmi.js)//
	const tmi = require('tmi.js');
	const { channel } = require('tmi.js/lib/utils');
	//Import-GoogleSheets.api//
	const {google} = require('googleapis');


////TWITCH////
//Bot-Connect-to-Twitch//
	const client = new tmi.client(con.opts);
	client.connect(
		console.log('Connected to Twitch api. / Index')
	).catch(console.error);


///Twitch-Timers///
	time.timers.forEach( (timer, i) => 
		tmer.timers(client, timer.msg, timer.time, con.adChannel)
	) 

///Twitch-Bot-Events///
//Raided
client.on("raided", (channel, username, viewers) => {
		//When-Raided
		client.say(channel, `Welcome ${username} and party of ${viewers}!~!`);
	});


///Twitch-Bot-Commands///
//Bot-Listen-to-Twitch-chat
client.on("message", (channel, userstate, message, self) => {
	if ( self ) return; //Check-Self
	//Retrieve-Username
	const userName = userstate.username

//Message-Event-Handler
	///Commannd-Event
	//!lurk/ Welcome-back
	if (con.lurkers.includes(userName)){
		//personalized-welcome-message
		client.say(channel, `Welcome back ${userName}~!`);
		//find-index-of-lurker
		const indexOfLurker = con.lurkers.findIndex(object => {
				return object.id === userName;
			});
		//remove-lurker-from-list
		con.lurkers.splice(indexOfLurker, 1);
	}
	///Message-Reaction-Event-Handler
	for (i = 0; i < reaction.reactions.length; i++) {
	if (message.includes(`${reaction.reactions[i].keyword}`)){
		//Reply-Reaction-msg
		client.say(channel, `${reaction.reactions[i].msg[Math.floor(Math.random() * reaction.reactions[i].msg.length)]}`);
	};
	} 

////Command-Handler
if(message.match(con.regexpCommand)){

	//!a / !b
	if (message.toLocaleLowerCase() === '!a') {
		client.say(channel, "B")
		setTimeout(() => {
			client.say(channel, "O")
		}, (1200));
		setTimeout(() => {
			client.say(channel, "0")
		}, (2300));
		setTimeout(() => {
			client.say(channel, "M")
		}, (3300));
		setTimeout(() => {
			client.say(channel, "E")
		}, (4400));
		setTimeout(() => {
			client.say(channel, "R")
		}, (5500));
	}; 
	if (message.toLocaleLowerCase() === '!b') {
		client.say(channel, "B")
		setTimeout(() => {
			client.say(channel, "O")
		}, (1200));
		setTimeout(() => {
			client.say(channel, "0")
		}, (2300));
		setTimeout(() => {
			client.say(channel, "M")
		}, (3300));
		setTimeout(() => {
			client.say(channel, "E")
		}, (4400));
		setTimeout(() => {
			client.say(channel, "R")
		}, (5500));
	}; 

	//!lurk
	if (message.toLocaleLowerCase() === '!lurk') {
		if (con.lurkers.includes(userName)) {
			//Already-Lurker
		} else {
			//New-Lurker
			client.say(channel, `Hope u enjoy ur time lurking, ${userName}!`);
			con.lurkers.push(`${userstate.username}`);
			con.lurkCount = con.lurkers.length; 
		}}	
	//!lurkers
	if (message.toLocaleLowerCase() === '!lurkers') {
		client.say(channel, `${con.lurkers.length} people are currently lurking~`);
		console.log(con.lurkers);
	}

	//!pp
	if (message.toLocaleLowerCase() === '!pp') {

		//IF-{userName}-is-NOT-in-{Horny-Jail}
		console.log(`//// Current-Horny-Jail-Residents: ${con.hornyJail}`);
		if(!con.hornyJail.includes(userName)) {

			//Execute-!pp
			pp.pp(client, channel, userName);

			//{Horny-Jail}-Cooldown
			con.hornyJail.push(userName);
			console.log(`//// Updated-Horny-Jail-Residents: ${con.hornyJail}`);
				//Remove-User-from-{Horny-Jail}
				setTimeout(() => {
					con.hornyJail = con.hornyJail.filter(u => u !== userName);
				}, (con.ppCooldown * 60 * 1000));

		} 
		//IF-{userName}-is-in-{Horny-Jail}
		else {
			client.say(channel, `${userName} bonk! => Horny-Jail => ${con.ppCooldown}-min!`)
		}

	}
	//!checkpp
	if (message.toLocaleLowerCase() === '!checkpp') {

		pp.checkpp(client, channel, userName)

	}
	//!checkppin
	if (message.toLocaleLowerCase() === '!checkppin') {

		pp.checkppin(client, channel, userName)

	}
	//!viagra
	if (message.toLocaleLowerCase() === '!viagra') {

		//IF-{userName}-is-NOT-in-{Horny-Jail}
		console.log(`//// Current-Horny-Jail-Residents: ${con.viagraJail}`);
		if(!con.viagraJail.includes(userName)) {

			//Execute-!pp
			pp.viagra(client, channel, userName);

			//{Horny-Jail}-Cooldown
			con.viagraJail.push(userName);
			console.log(`//// Updated-Horny-Jail-Residents: ${con.viagraJail}`);
				//Remove-User-from-{Horny-Jail}
				setTimeout(() => {
					con.viagraJail = con.viagraJail.filter(u => u !== userName);
				}, (con.viagraCooldown * 60 * 1000));

		} 
		//IF-{userName}-is-in-{Horny-Jail}
		else { 
			//client.timeout(channel, userName, 1, `${userName} bonk! => Horny-Jail => ${con.viagraCooldown}-min!`);
			client.say(channel, `${userName} bonk! => Horny-Jail => ${con.viagraCooldown}-min!`)
		}

	}
	
	//!socials/
	const [raw, command, argument] = message.match(con.regexpCommand);
	const { response } = com.commands[command] || {};
		if ( typeof response === 'function' ) {
			client.say(channel, response(argument));
		} else if ( typeof response === 'string' ) {
			client.say(channel, response);
		}	
	//!wisdom
	if (message.toLocaleLowerCase() === '!wisdom') {
		client.say(
			channel, 
			con.wisdom[Math.floor(Math.random() * con.wisdom.length)]); 
	}
	
}

});	
  
//Catch-&-Log-Error
} catch(e) {console.error(e);};