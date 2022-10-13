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
	//!socials
	socials : {
		response: 'https://linktr.ee/xli24'
	},
	//!discord
	discord : {
		response: 'https://discord.gg/aNu3pB3QcQ'
	},
	//!instagram
	intagram : {
		response: 'https://www.instagram.com/xli2499/'
	},
	insta : {
		response: 'https://www.instagram.com/xli2499/'
	},
	//!twitter
	twitter : {
		response: 'https://twitter.com/xli2499'
	},
	tweet : {
		response: 'https://twitter.com/xli2499'
	},
	//!youtube
	youtube : {
		response: 'https://www.youtube.com/channel/UCGJwaBY0KRCqT-p_sdMmlwg'
	},
	yt : {
		response: 'https://www.youtube.com/channel/UCGJwaBY0KRCqT-p_sdMmlwg'
	},

	//!kickall
	kickall : {
		response: 'Fuck it! Kick all!'
	},
	//!kick
	kick: {
		response: (argument) => `Oof! ${argument} was kicked in the nuts!`
	}
};

module.exports = {adCommands, commands};