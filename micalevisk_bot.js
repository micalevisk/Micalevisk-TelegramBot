// API (c) https://github.com/yagop/node-telegram-bot-api
'use strict';

var fs = require('fs');
const settings = JSON.parse( fs.readFileSync("settings.json") )
var TelegramBot = require('node-telegram-bot-api');

var bot = function () {
	console.log(">>","BOT INICIADO");

	const BOT_TOKEN = settings.BOT_TOKEN;

	/// Create a bot that uses 'polling' to fetch new updates
	var bot = new TelegramBot(BOT_TOKEN, { polling: true });

	/// Matches "/echo <text>"
	bot.onText(/\/echo (.+)/i, function (msg, match) {
		/// 'msg' is the received Message from Telegram 'match' is the result of executing the regexp above on the text content of the message
		var chatId = msg.chat.id; /// msg.chat = { id, first_name, last_name, username, type }
		var resp = match[1];

		bot.sendMessage(chatId, resp);
	});

}();

module.exports = bot;