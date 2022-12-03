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
	//functions
	const { joinObj } = require('./functions');
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
	time.timers.forEach((timer, i) => 
		tmer.timers(client, timer.msg, timer.time, con.adChannel)
	);

///Twitch-Bot-Events///
//Raided
client.on("raided", (channel, username, viewers) => {
		//When-Raided / SO			
		setTimeout(() => {
			client.say(con.adChannel, `Welcome ${username} and party of ${viewers} ~!`);
		}, (500));
		if (channel == "#xli24"){
			setTimeout(() => {
				client.say(con.adChannel, `/announce Check out our Raider's channel! // twitch.tv/${username}`);
			}, (1500));
		} else {
			setTimeout(() => {
				client.say(con.adChannel, `Check out our Raider's channel! // twitch.tv/${username}`);
			}, (1500));
		}		
	});


///Twitch-Bot-Commands///
//Bot-Listen-to-Twitch-chat
client.on("message", (channel, userstate, message, self) => {
	if ( self ) return; //Check-Self
	//Retrieve-Username
	const userName = userstate.username

//Message-Event-Handler
	//Twitch-Chat-[Logger.exe]
	if (channel == joinObj("#",con.adChannel)){
		//IF-{userName}-is-NOT-in-{daily-Chatters}
		//console.log(`//// Current-Daily-Chatters: ${con.dailyChatters}`);
		if(!con.dailyChatters.includes(userName)) {

			//Execute-!pp
			pp.logger(client, channel, userName);

			//{daily-Chatters}-Cooldown
			con.dailyChatters.push(userName);
			//console.log(`//// Updated-Daily-Chatters: ${con.dailyChatters}`);
				//Remove-User-from-{Horny-Jail}
				setTimeout(() => {
					con.dailyChatters = con.dailyChatters.filter(u => u !== userName);
				}, (24 * 60 * 60 * 1000));

		} 
		//IF-{userName}-is-in-{daily-Chatters}
		//DO-NOTHING
	}

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

//Command-Handler
	if(message.match(con.regexpCommand)){
		
		const [raw, command, argument] = message.match(con.regexpCommand);

		//!B
		if (command === 'B' || command.toLocaleLowerCase() === 'b') {

			//IF-{userName}-is-NOT-in-{boomer-Jail}
			console.log(`//// Current-Horny-Jail-Residents: ${con.boomerJail}`);
			if(!con.boomerJail.includes(userName)) {

				//Execute-BOOMER			
				client.say(channel, " 👶 0")
				setTimeout(() => {
					client.say(channel, " 🧔 O")
				}, (1200));
				setTimeout(() => {
					client.say(channel, " 👨‍🦳 M")
				}, (2300));
				setTimeout(() => {
					client.say(channel, " 🧓 E")
				}, (3400));
				setTimeout(() => {
					client.say(channel, " 👴 R")
				}, (4500));

				//{boomer-Jail}-Cooldown
				con.boomerJail.push(userName);
				console.log(`//// Updated-Horny-Jail-Residents: ${con.boomerJail}`);
					//Remove-User-from-{boomer-Jail}
					setTimeout(() => {
						con.boomerJail = con.boomerJail.filter(u => u !== userName);
					}, (con.boomerCooldown * 60 * 1000));

			} 
			//IF-{userName}-is-in-{Horny-Jail}
			else {
				//Do Nothing
			}

		}; 

		//!chat
		if (command.toLocaleLowerCase() === 'chat') {
			var chatterList = [];
			con.dailyChatters.forEach((chatter, i) => 
				chatterList.push(joinObj(" ",joinObj(chatter," 💖 ")))
			);
			console.log(chatterList);
			client.say(channel, `/announce Thank U~${chatterList}`);
		}; 

		//!lurk
		if (command.toLocaleLowerCase() === 'lurk') {
			if (con.lurkers.includes(userName)) {
				//Already-Lurker
			} else {
				//New-Lurker
				client.say(channel, `Hope u enjoy ur time lurking, ${userName}!`);
				con.lurkers.push(`${userstate.username}`);
				con.lurkCount = con.lurkers.length; 
			}}
		//!lurkers
		if (command.toLocaleLowerCase() === 'lurkers') {
			client.say(channel, `${con.lurkers.length} people are currently lurking~`);
			console.log(con.lurkers);
		}

		//!pp
		if (command.toLocaleLowerCase() === 'pp') {

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

				//If-not-Host-Delete-Msg
				if (userstate.badges == null && channel == "#xli24"){
					client.deletemessage(channel, userstate["id"]);
					pp.hornyJail(client, channel, userName, con.ppCooldown);
				} else {
				//Execute-hornyJail
				pp.hornyJail(client, channel, userName, con.ppCooldown);
				};

			}

		}
		//!ppfight
		if (command.toLocaleLowerCase() === 'ppfight' || command.toLocaleLowerCase() === 'cockfight' || command.toLocaleLowerCase() === 'swordfight') {

			//IF-{userName}-is-NOT-in-{Horny-Jail}
			console.log(`//// Current-Horny-Jail-Residents: ${con.fighthornyJail}`);
			if(!con.fighthornyJail.includes(userName)) {

				//{Horny-Jail}-Cooldown
				con.fighthornyJail.push(userName);
				console.log(`//// Updated-Horny-Jail-Residents: ${con.fighthornyJail}`);
				//Challenger / Opponent Listing
				con.fightChallengersList.push(userName);
				con.fightOpponentList.push(argument.toLocaleLowerCase());
				console.log(`//// Updated-Challengers-List: ${con.fightChallengersList}`);
				console.log(`//// Updated-Opponents-List: ${con.fightOpponentList}`);

				//Execute-!ppfight
				pp.ppfight(client, channel, userName, argument);

				//{Horny-Jail}-Cooldown
				con.fighthornyJail.push(userName);
				console.log(`//// Updated-Horny-Jail-Residents: ${con.fighthornyJail}`);

				//Remove-User-after-Cooldown
				setTimeout(() => {
					con.fighthornyJail = con.fighthornyJail.filter(u => u !== userName);
				}, (con.ppfightCooldown * 60 * 1000));
				setTimeout(() => {				
					//Remove-{opponent}-from-[OpponentList]
					let indx = con.fightOpponentList.findIndex(x => x === `${userName}`);
					con.fightChallengersList.splice(indx, 1);
					con.fightOpponentList.splice(indx, 1);
					console.log(`//// Updated-Challengers-List: ${con.fightChallengersList}`);
					console.log(`//// Updated-Opponents-List: ${con.fightOpponentList}`);				
				}, (1 * 60 * 1000));

			} 

			//IF-{userName}-is-in-{Horny-Jail}
			else {

				//If-not-Host-Delete-Msg
				if (userstate.badges == null && channel == "#xli24"){
					client.deletemessage(channel, userstate["id"]);
					pp.hornyJail(client, channel, userName, con.ppfightCooldown);
				} else {
				//Execute-hornyJail
					pp.hornyJail(client, channel, userName, con.ppfightCooldown);
				};

			}

		}
		//!accept // !ppfight
		if (command.toLocaleLowerCase() === 'accept') {

			//IF-{opponent}-is-in-[OpponentList]
			console.log(`//// Current-Opponents: ${con.fightOpponentList}`);
			console.log(userName);
			if(con.fightOpponentList.includes(userName)) {

				//Execute-!ppFight.exe
				let indx = con.fightOpponentList.findIndex(x => x === `${userName}`);
				pp.accept(client, channel, con.fightChallengersList[indx], userName);

				//Remove-{opponent}-from-[OpponentList]
				con.fightChallengersList.splice(indx, 1);
				con.fightOpponentList.splice(indx, 1);
				console.log(`//// Updated-Challengers-List: ${con.fightChallengersList}`);
				console.log(`//// Updated-Opponents-List: ${con.fightOpponentList}`);

			} 

			//IF-{opponent}-is-NOT-in-[OpponentList]
			else {

				//DO NOTHING

			}

		}
		//!checkpp
		if (command.toLocaleLowerCase() === 'checkpp') {

			pp.checkpp(client, channel, userName)

		}
		//!checkppin
		if (command.toLocaleLowerCase() === 'checkppin' || message.toLocaleLowerCase() === '!checkppinch') {

			pp.checkppin(client, channel, userName)

		}
		//!viagra
		if (command.toLocaleLowerCase() === 'viagra' || message.toLocaleLowerCase() === '!v') {

			//IF-{userName}-is-NOT-in-{Horny-Jail}
			console.log(`//// Current-Horny-Jail-Residents: ${con.viagraJail}`);
			if(!con.viagraJail.includes(userName)) {

				//Execute-!viagra
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

				//If-not-Host-Delete-Msg
				if (userstate.badges == null && channel == "#xli24"){
					client.deletemessage(channel, userstate["id"]);
					pp.hornyJail(client, channel, userName, con.viagraCooldown);
				} else {
				//Execute-hornyJail
				pp.hornyJail(client, channel, userName, con.viagraCooldown);
				};

			}

		}
		
		//!socials
		const { response } = com.commands[command] || {};
			if ( typeof response === 'function' ) {
				client.say(channel, response(argument));
			} else if ( typeof response === 'string' ) {
				client.say(channel, response);
			}

		//!wisdom
		if (command.toLocaleLowerCase() === 'wisdom') {
			client.say(
				channel, 
				con.wisdom[Math.floor(Math.random() * con.wisdom.length)]); 
		}
		
	}

});	
  
//Catch-&-Log-Error
} catch(e) {console.error(e);};