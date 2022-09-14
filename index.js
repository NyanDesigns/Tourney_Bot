////CONSTANTS
//Rgular-Expression
//More info on reGex/ regExp - https://regexr.com/
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
//Commands-Mapping
const commands = {
	//Static-String-Reponse
	website: {
		response: 'test'
	},
	//Dynamic-String-Reponse
	upvote: {
		response: () => 'User  was just upvoted'
	}
}

//// TWITCH
//Establish-Twitch-Connection
const tmi = require('tmi.js');
const client = new tmi.Client({
	connection: {
		reconnect: true
	},

	//Bot-Identity-Login
	options: { debug: true },
	identity: {
		username: 'DeevSquach',
		password: 'aye9lgg0w848zmrgqgdgtpz89xls8v'
	},

	//Target-Channel
	channels: [ 'tourneyb0i' ],

});
client.connect();

client.on('message', (channel, tags, message, self) => {

//Check-If-Self-Msg
const isSelf = tags.username.toLocaleLowerCase() == process.env.T_USERNAME;
if (isSelf) return;

	//Match-Msg-with-RegExp
	const [raw, command, arguement] = message.match(regexpCommand);
	//Command-Type-to-Excute
	const {response} = commands[command] || {};
	//Exicute-Command
	if (typeof response === 'function'){
		client.say(channel,response(tags.username));
	}
	else if (typeof response === 'string'){
		client.say(channel,response);
	}

	// "Alca: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
});