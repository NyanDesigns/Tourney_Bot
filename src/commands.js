//Admin-Commands
const adCommands = {
	//Static-String-Reponse
	website: {
		response: 'test'
	},
	//Dynamic-String-Reponse
	upvote: {
		response: (argument) => 'Successfully upvoted ${argument}'
	}
};

//Common-Commands
const commands = {
	//Static-String-Reponse
	website: {
		response: 'test'
	},
	//Dynamic-String-Reponse
	upvote: {
		response: (argument) => 'Successfully upvoted ${argument}'
	}
};

module.exports = {adCommands, commands};