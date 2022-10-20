try{
////IMOPRT////

//Load-.ENV-MODULE//
require('dotenv').config();

///Files
//Import-"commands.js"//
const com = require("./socials.js");
//Import-"constants.js"//
const con = require("./constants.js");
//Import-"messages.json"
const msg = require("./messages.json");
//Import-"gsKeys.json"
const gsKeys = require("./gsKeys.json");

///API
//Import-Twitch.api(tmi.js)//
const tmi = require('tmi.js');
const { channel } = require('tmi.js/lib/utils');
//Import-GoogleSheets.api//
const {google} = require('googleapis');


////TWITCH-FUNCTIONS////

///Functions///
//Message-Randomizer / randomizeMsg
function randomizeMsg(obj) {
	let arr = Object.values(obj);
	return arr[Math.floor(Math.random() * arr.length)];
}
function between(min, max, decimals) {
	const str = (Math.random() * (max - min) + min).toFixed(decimals);
	return parseFloat(str);
}

//Bot-Connect-to-Twitch//
const client = new tmi.client(con.opts);
client.connect(
	console.log('Connected to Twitch api.')
).catch(console.error);




////Twitch-Bot-Timers//
	//ask
	setInterval(() => {
		client.say(
			con.targetChannel, 
			con.ask[Math.floor(Math.random() * con.ask.length)]); 
	}, con.askTime * 60 * 1000)
	//socials
	setInterval(() => {
		client.say(
			con.targetChannel, 
			con.socials[Math.floor(Math.random() * con.socials.length)]); 
	}, con.socialsTime * 60 * 1000)
	//discord
	setInterval(() => {
		client.say(
			con.targetChannel, 
			con.discord[Math.floor(Math.random() * con.discord.length)]); 
	}, con.discordTime * 60 * 1000)
	//followMe
	setInterval(() => {
		client.say(
			con.targetChannel, 
			con.followMe[Math.floor(Math.random() * con.followMe.length)]); 
	}, con.askTime * 60 * 1000)
	//lovLurkers
	setInterval(() => {
		client.say(
			con.targetChannel, 
			con.lovLurkers[Math.floor(Math.random() * con.lovLurkers.length)]); 
	}, con.lovLurkersTime * 60 * 1000)
	//pp
	setInterval(() => {
		client.say(
			con.targetChannel, 
			con.pp[Math.floor(Math.random() * con.pp.length)]); 
	}, con.ppTime * 60 * 1000)
	//wisdoms
	setInterval(() => {
		client.say(
			con.targetChannel, 
			con.wisdom[Math.floor(Math.random() * con.wisdom.length)]); 
	}, con.wisdomTime * 60 * 1000)




////Twitch-Bot-Events//
	//Raided
	client.on("raided", (channel, username, viewers) => {
		// Do your stuff.
		client.say(channel, `Welcome ${username} and party of ${viewers}!~!`);
	});




////Twitch-Bot-Commands//
//Bot-Listen-to-Twitch-chat
client.on("message", (channel, userstate, message, self) => {

	if ( self ) return; //Check-Self
	//Retrieve-Username
	const userName = userstate.username
	//Timer-Variable


	////Event-Handler
	///Commannd-Events
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
			console.log(indexOfLurker);
			console.log(con.lurkers);
		}

	///Message-Events
	//<3/ Spread the Love!
		if (message.includes('❤️')){
			//personalized-welcome-message
			client.say(channel, `Spread the love! <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3`);
		}
	//<3/ Spread the Love!
		if (message.includes('<3')){
			//personalized-welcome-message
			client.say(channel, `Spread the love! <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3`);
		}
	//kaijus4Nezuko/ Hail de Qweeen Nezuko! 
		if (message.includes('kaijus4Nezuko')){
			//personalized-welcome-message
			client.say(channel, `Hail de Qween Nezuko!`);
		}



	///Twitch-Events
	//Thanks for tapping that button~ I promise U won't Regret~<3
	//Thanks for the follow! Kick back and enjoy the ride!


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
	if (con.activePP) {

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
	con.activePP = false;
	setTimeout(() => {
		con.activePP = true;
	}, con.ppCooldown * 60 * 1000);
	} else {
		// Do stuff if the command is in cooldown
		client.say(channel, `${userName} U r still in horny jail for ${con.ppCooldown} min!`)
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
}};}

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
}};}
		

//!socials/
	const [raw, command, argument] = message.match(con.regexpCommand);
	const { response } = com.commands[command] || {};

	if ( typeof response === 'function' ) {
		client.say(channel, response(argument));
	} else if ( typeof response === 'string' ) {
		client.say(channel, response);
	}	
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
					const randomValue =  between(0.001, 0.069, 3);
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


//!wisdom
		if (message.toLocaleLowerCase() === '!wisdom') {
			client.say(
				con.targetChannel, 
				con.wisdom[Math.floor(Math.random() * con.wisdom.length)]); 
			}
  });

  

//Catch-&-Log-Error
} catch(e) {console.error(e);};




// //Connect-to-Sheets

// //Sheet-Existing-Options
// const gsopt = {
// 	spreadsheetId: '14U7s1e1TqmqeGNLgW74n1xc_txBY6abLgyvJx86PGLg',
// 	range: 'pp!A1:B5'
// };

// async function gsrun2(cl){
// 	const gsapi = google.sheets({version:'v4', auth: cl });
// 	//Sheet-Existing-Options
// 	const gsopt = {
// 		spreadsheetId: '14U7s1e1TqmqeGNLgW74n1xc_txBY6abLgyvJx86PGLg',
// 		range: 'pp!A1:B5'
// 	};
// 	//Get-Sheet-Values
// 	let data = await gsapi.spreadsheets.values.get(gsopt);
// 	let dataArray = data.data.values;

// 	//Replace-Null-Value
// 	dataArray = dataArray.map(function(r){
// 		while(r.length<2){
// 			r.push('');
// 		}
// 		return r;
// 	})
// 	//Add-Column-Value
// 	let newDataArray = dataArray.map(function(r){
// 		r.push(r[0]+'-'+r[1]);
// 		return r;
// 	});
// 	//Sheet-Update-Options
// 	const updateOptions = {
// 		spreadsheetId: '14U7s1e1TqmqeGNLgW74n1xc_txBY6abLgyvJx86PGLg',
// 		range: 'pp!E1',
// 		valueInputOption: 'USER_ENTERED',
// 		resource: { values: newDataArray}
// 	}
// 	//Commit-Shheet-Updates
// 	let res = await gsapi.spreadsheets.values.update(updateOptions);
// 	console.log(res);
// };