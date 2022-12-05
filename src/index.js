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
		if (command.toLocaleLowerCase() === 'ppfight' || command.toLocaleLowerCase() === 'cockfight' || command.toLocaleLowerCase() === 'swordfight' || command.toLocaleLowerCase() === 'pf' || command.toLocaleLowerCase() === 'sf' && argument !== undefined) {

			//IF-{userName}-is-NOT-in-{Horny-Jail}
			console.log(`//// Current-Horny-Jail-Residents: ${con.ppfightJail}`);
			if(!con.ppfightJail.includes(userName)) {

				//{Horny-Jail}-Cooldown
				con.ppfightJail.push(userName);
				console.log(`//// Updated-Horny-Jail-Residents: ${con.ppfightJail}`);
				//Challenger / Opponent Listing
				con.ppfightChallengersList.push(userName);
				con.ppfightOpponentList.push(argument.toLocaleLowerCase());
				console.log(`//// Updated-Challengers-List: ${con.ppfightChallengersList}`);
				console.log(`//// Updated-Opponents-List: ${con.ppfightOpponentList}`);

				//Execute-!ppfight
				pp.ppfight(client, channel, userName, argument);

				//{Horny-Jail}-Cooldown
				con.ppfightJail.push(userName);
				console.log(`//// Updated-Horny-Jail-Residents: ${con.ppfightJail}`);

				//Remove-User-after-Cooldown
				setTimeout(() => {
					con.ppfightJail = con.ppfightJail.filter(u => u !== userName);
				}, (con.ppfightCooldown * 60 * 1000));
				setTimeout(() => {				
					//Remove-{opponent}-from-[OpponentList]
					let indx = con.ppfightOpponentList.findIndex(x => x === `${userName}`);
					con.ppfightChallengersList.splice(indx, 1);
					con.ppfightOpponentList.splice(indx, 1);
					console.log(`//// Updated-Challengers-List: ${con.ppfightChallengersList}`);
					console.log(`//// Updated-Opponents-List: ${con.ppfightOpponentList}`);				
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
			console.log(`//// Current-Opponents: ${con.ppfightOpponentList}`);
			console.log(userName);
			if(con.ppfightOpponentList.includes(userName)) {

				//Execute-!ppFight.exe
				let indx = con.ppfightOpponentList.findIndex(x => x === `${userName}`);
				pp.accept(client, channel, con.ppfightChallengersList[indx], userName);

				//Remove-{opponent}-from-[OpponentList]
				con.ppfightChallengersList.splice(indx, 1);
				con.ppfightOpponentList.splice(indx, 1);
				console.log(`//// Updated-Challengers-List: ${con.ppfightChallengersList}`);
				console.log(`//// Updated-Opponents-List: ${con.ppfightOpponentList}`);

			} 

			//IF-{opponent}-is-NOT-in-[OpponentList]
			else {

				//DO NOTHING

			}

		}

		//!vfight
		if (command.toLocaleLowerCase() === 'viagrafight' || command.toLocaleLowerCase() === 'vfight' || command.toLocaleLowerCase() === 'vf') {

			//IF-{userName}-is-NOT-in-{Horny-Jail}
			console.log(`//// Current-Horny-Jail-Residents: ${con.viagrafightJail}`);
			if(!con.viagrafightJail.includes(userName)) {

				//{Horny-Jail}-Cooldown
				con.viagrafightJail.push(userName);
				console.log(`//// Updated-Horny-Jail-Residents: ${con.viagrafightJail}`);
				//Challenger / Opponent Listing
				con.vfightChallengersList.push(userName);
				con.vfightOpponentList.push(argument.toLocaleLowerCase());
				console.log(`//// Updated-Challengers-List: ${con.vfightChallengersList}`);
				console.log(`//// Updated-Opponents-List: ${con.vfightOpponentList}`);

				//Execute-!ppfight
				pp.vfight(client, channel, userName, argument);

				//{Horny-Jail}-Cooldown
				con.viagrafightJail.push(userName);
				console.log(`//// Updated-Horny-Jail-Residents: ${con.viagrafightJail}`);

				//Remove-User-after-Cooldown
				setTimeout(() => {
					con.viagrafightJail = con.viagrafightJail.filter(u => u !== userName);
				}, (con.ppfightCooldown * 60 * 1000));
				setTimeout(() => {				
					//Remove-{opponent}-from-[OpponentList]
					let indx = con.vfightOpponentList.findIndex(x => x === `${userName}`);
					con.vfightChallengersList.splice(indx, 1);
					con.vfightOpponentList.splice(indx, 1);
					console.log(`//// Updated-Challengers-List: ${con.vfightChallengersList}`);
					console.log(`//// Updated-Opponents-List: ${con.vfightOpponentList}`);				
				}, (1 * 60 * 1000));

			} 

			//IF-{userName}-is-in-{Horny-Jail}
			else {

				//If-not-Host-Delete-Msg
				if (userstate.badges == null && channel == "#xli24"){
					client.deletemessage(channel, userstate["id"]);
					pp.hornyJail(client, channel, userName, con.viagrafightCooldown);
				} else {
				//Execute-hornyJail
					pp.hornyJail(client, channel, userName, con.viagrafightCooldown);
				};

			}

		}
		//!accept // !vfight
		if (command.toLocaleLowerCase() === 'accept') {

			//IF-{opponent}-is-in-[OpponentList]
			console.log(`//// Current-Opponents: ${con.vfightOpponentList}`);
			console.log(userName);
			if(con.vfightOpponentList.includes(userName)) {

				//Execute-!ppFight.exe
				let indx = con.vfightOpponentList.findIndex(x => x === `${userName}`);
				pp.vaccept(client, channel, con.vfightChallengersList[indx], userName);

				//Remove-{opponent}-from-[OpponentList]
				con.vfightChallengersList.splice(indx, 1);
				con.vfightOpponentList.splice(indx, 1);
				console.log(`//// Updated-Challengers-List: ${con.vfightChallengersList}`);
				console.log(`//// Updated-Opponents-List: ${con.vfightOpponentList}`);

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