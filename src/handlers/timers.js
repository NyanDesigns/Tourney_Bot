//Import-"constants.js"//
const { channel } = require("tmi.js/lib/utils");

console.log('////////  ////  Timed Banners Started.  ////  ////////');

//Timed-Banner-Funtion
exports.timers = (client, msg, time, channel) => {
	setInterval(() => {
		client.say(
			channel, 
			msg[Math.floor(Math.random() * msg.length)]); 
	}, time * 60 * 1000)
}