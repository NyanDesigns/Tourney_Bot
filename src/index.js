try{
////IMOPRT////
///Files
	//Load-.ENV-MODULE//
	require('dotenv').config();
	///JS
	//Import-"funcrions.js"//
	const fun = require("./functions");
	//Import-"commands.js"//
	const com = require("./handlers/command/socials");
	//Import-"constants.js"//
	const con = require("./constants");
	//Import-"timers.js"//
	const tmer = require('./handlers/timers');
	///Json
	//Import-"message.json"
	const reaction = require("../src/Jsons/reaction.json");
	//Import-"message.json"
	const time = require("../src/Jsons/time.json");
	//Import-"gsKeys.json"
	const gsKeys = require("./Jsons/gsKeys.json");
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

		console.log(`//// Current-Horny-Jail-Residents: ${con.hornyJail}`);

		if(!con.hornyJail.includes(userName)) {

			//Authorize-Sheets
			con.gsClient.authorize(function(e, tokens){
				if(e){
					console.log(e);
					return;
				} else {
					console.log('Connected to Google-Sheets api.');
					gsrun(con.gsClient);
				}
			});

			//Connect-to-Sheets
			async function gsrun(cl){
				const gsapi = google.sheets({version:'v4', auth: cl });
				//Get-Sheet-Values
				const [, ...values] = (await gsapi.spreadsheets.values.get({ 
					spreadsheetId: con.botSheet, 
					range: con.ppUserRange
				})).data.values;
				console.log(`Existing Users, Values = ${[values] }`);

				//Search-userName
				//Filter-&-Reduce-List-into-One
				const index = values.reduce((o, [a, ...v], i) => ((o[a] = i + 2), o), {});
				console.log(`index[item] = ${index[userName]}`);

				//Update-Date-🍆💦 => +0.001 mm~
				if (index[userName]){
				//`${userName} already exists.`
				console.log(`${userName} already exists.`)
					try{
					//Get-&-Convert-existing-PP-length
					const existingValue = await gsapi.spreadsheets.values.get({
						spreadsheetId: con.botSheet,
						range: `!pp!B${index[userName]}`,
					}); 
					const trueValue = existingValue.data.values;
					console.log(`existing value = ${trueValue}`);
					//Update-existing-PP-length
					const addedValue =  Number(trueValue) + Number(0.001);
					console.log(`added value = ${addedValue}`);
					const updatedValue = await gsapi.spreadsheets.values.update({
						spreadsheetId: con.botSheet,
						range: `!pp!B${index[userName]}`,
						valueInputOption: "USER_ENTERED",
						resource: { values: [[addedValue]] },
					});
					//Reply-to-`${userName}
					client.say(channel, `${userName} 🍆💦 => +0.001 mm~`);

			} catch(e) {console.error(e);};

				} else {			
				//`${userName} does not exist.`
				console.log(`${userName} does not exist.`)
				const updatedValue = await gsapi.spreadsheets.values.append({
					spreadsheetId: con.botSheet,
					range: con.ppUserRange,
					valueInputOption: "USER_ENTERED",
					resource: { values: [[userName, 0.001]] },
				});
				//Reply-to-`${userName}
				client.say(channel, `Congrats ${userName}! U have grown a NEW 0.001 mm of *inclusive* pp today!`);
				}};

			//Command-Cooldown
			con.hornyJail.push(userName);
			console.log(`//// Updated-Horny-Jail-Residents: ${con.hornyJail}`);

			//Remove-User-from-HornyJail
			setTimeout(() => {
				con.hornyJail = con.hornyJail.filter(u => u !== userName);
			}, (con.ppCooldown * 60 * 1000));

		} else {
			// Do stuff if the command is in cooldown
			client.say(channel, `${userName} bonk! => Horny-Jail => ${con.ppCooldown}-min!`)
			
		}

	}
	//!checkpp
	if (message.toLocaleLowerCase() === '!checkpp') {

		//Authorize-Sheets
		con.gsClient.authorize(function(e, tokens){
			if(e){
				console.log(e);
				return;
			} else {
				console.log('Connected to Google-Sheets api.');
				gsrun(con.gsClient);
			}
		});

		//Connect-to-Sheets
		async function gsrun(cl){
			const gsapi = google.sheets({version:'v4', auth: cl });
			//Get-Sheet-Values
			const [, ...values] = (await gsapi.spreadsheets.values.get({ 
				spreadsheetId: con.botSheet, 
				range: con.ppUserRange
			})).data.values;
			console.log(`Existing Users, Values = ${[values] }`);

			//Search-userName
			//Filter-&-Reduce-List-into-One
			const index = values.reduce((o, [a, ...v], i) => ((o[a] = i + 2), o), {});
			console.log(`index[item] = ${index[userName]}`);

			if (index[userName]){
			//`${userName} already exists.`
			console.log(`${userName} already exists.`)
				try{
				//Get-&-Convert-existing-PP-length
				const existingValue = await gsapi.spreadsheets.values.get({
					spreadsheetId: con.botSheet,
					range: `!pp!B${index[userName]}`,
				}); 
				const trueValue = existingValue.data.values;
				console.log(`existing value = ${trueValue}`);
				//Reply-to-`${userName}
				if (trueValue < 1){
				client.say(channel, `sigh.. ${userName}.. U have a ${trueValue} mm teeny-tiny-weeney~!`);
				} else {
				client.say(channel, `WOW ${userName}! U have a ${trueValue} mm dong~!`);
				}
				} catch(e) {console.error(e);};
			} else {
				//`${userName} does not exist.`
				console.log(`${userName} does not exist.`)
				//Reply-to-`${userName}
				client.say(channel, `Sorry ${userName}, U have don't an *inclusive* pp.. Get urs today with !pp`);
	}};
	}
	//!checkppinch
	if (message.toLocaleLowerCase() === '!checkppinch') {

		//Authorize-Sheets
		con.gsClient.authorize(function(e, tokens){
			if(e){
				console.log(e);
				return;
			} else {
				console.log('Connected to Google-Sheets api.');
				gsrun(con.gsClient);
			}
		});

		//Connect-to-Sheets
		async function gsrun(cl){
			const gsapi = google.sheets({version:'v4', auth: cl });
			//Get-Sheet-Values
			const [, ...values] = (await gsapi.spreadsheets.values.get({ 
				spreadsheetId: con.botSheet, 
				range: con.ppUserRange
			})).data.values;
			console.log(`Existing Users, Values = ${[values] }`);

			//Search-userName
			//Filter-&-Reduce-List-into-One
			const index = values.reduce((o, [a, ...v], i) => ((o[a] = i + 2), o), {});
			console.log(`index[item] = ${index[userName]}`);

			if (index[userName]){
			//`${userName} already exists.`
			console.log(`${userName} already exists.`)
				try{
				//Get-&-Convert-existing-PP-length
				const existingValue = await gsapi.spreadsheets.values.get({
					spreadsheetId: con.botSheet,
					range: `!pp!B${index[userName]}`,
				}); 
				const trueValue = existingValue.data.values * 0.0393701;
				const decimalValue = trueValue.toFixed(3);
				console.log(`existing value = ${decimalValue}`);
				//Reply-to-`${userName}
				if (trueValue < 6){
				client.say(channel, `sigh.. ${userName}.. U have a ${decimalValue} inch teeny-tiny-weeney~!`);
				} else {
				client.say(channel, `WOW ${userName}! U have a ${decimalValue} inch dong~!`);
				}
				} catch(e) {console.error(e);};
			} else {
				//`${userName} does not exist.`
				console.log(`${userName} does not exist.`)
				//Reply-to-`${userName}
				client.say(channel, `Sorry ${userName}, U have don't an *inclusive* pp.. Get urs today with !pp`);
	}};
	}			
	//!viagra
	if (message.toLocaleLowerCase() === '!viagra') {
		if (con.activeViagra) {

			//Authorize-Sheets
			con.gsClient.authorize(function(e, tokens){
				if(e){
					console.log(e);
					return;
				} else {
					console.log('Connected to Google-Sheets api.');
					gsrun(con.gsClient);
				}
			});

			//Connect-to-Sheets
			async function gsrun(cl){
				const gsapi = google.sheets({version:'v4', auth: cl });
				//Get-Sheet-Values
				const [, ...values] = (await gsapi.spreadsheets.values.get({ 
					spreadsheetId: con.botSheet, 
					range: con.ppUserRange
				})).data.values;
				console.log(`Existing Users, Values = ${[values] }`);

				//Search-userName
				//Filter-&-Reduce-List-into-One
				const index = values.reduce((o, [a, ...v], i) => ((o[a] = i + 2), o), {});
				console.log(`index[item] = ${index[userName]}`);

				if (index[userName]){
				//`${userName} already exists.`
				console.log(`${userName} already exists.`)
					try{
					//Get-&-Convert-existing-PP-length
					const existingValue = await gsapi.spreadsheets.values.get({
						spreadsheetId: con.botSheet,
						range: `!pp!B${index[userName]}`,
						}); 
					const trueValue = existingValue.data.values;
					console.log(`existing value = ${trueValue}`);
					//Update-existing-PP-length
						const randomValue =  fun.between(0.001, 0.069, 3);
					console.log(`random value = ${randomValue}`);
						const addedValue =  Number(trueValue) + Number(randomValue);
					const updatedValue = await gsapi.spreadsheets.values.update({
						spreadsheetId: con.botSheet,
						range: `!pp!B${index[userName]}`,
						valueInputOption: "USER_ENTERED",
						resource: { values: [[addedValue]] },
						});
					//Reply-to-`${userName}
					client.say(channel, `${userName} 💊 => 💪🍆💦 => + ${randomValue} mm~`);

					} catch(e) {console.error(e);};
				} else {
					
					//`${userName} does not exist.`
					console.log(`${userName} does not exist.`)
					const updatedValue = await gsapi.spreadsheets.values.append({
						spreadsheetId: con.botSheet,
						range: con.ppUserRange,
						valueInputOption: "USER_ENTERED",
						resource: { values: [[userName, 0.001]] },
						});
						//Reply-to-`${userName}
						client.say(channel, `Congrats ${userName}! U have grown a NEW 0.001 mm of *inclusive* pp today!`);

				}};		

	//Command-Cooldown
	con.activeViagra = false;
	setTimeout(() => {
		con.activeViagra = true;
	}, con.viagraCooldown * 60 * 1000);
	} else {
		// Do stuff if the command is in cooldown
		client.say(channel, `${userName}! Wait ${con.viagraCooldown} mins or will snap ur pp!`)
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
			con.targetChannel, 
			con.wisdom[Math.floor(Math.random() * con.wisdom.length)]); 
	}

	}

});	
  
//Catch-&-Log-Error
} catch(e) {console.error(e);};