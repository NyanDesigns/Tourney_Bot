//Commands-Mapping
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

module.exports = {commands};