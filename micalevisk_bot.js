// API (c) https://github.com/yagop/node-telegram-bot-api
'use strict';

var dotenv = require('dotenv').config();
var TelegramBot = require('node-telegram-bot-api');

console.log(">>","BOT INICIADO");
var bot = function () {
	const BOT_TOKEN = process.env.BOT_TOKEN;

	/// Create a bot that uses 'polling' to fetch new updates
	var bot = new TelegramBot(BOT_TOKEN, { polling: true });

	// Listen for any kind of message. There are different kinds of
	// messages.
	bot.on('message', function (msg) {
		var log = {
			  chatId: msg.chat.id
			, from: msg.chat.username
			, text: msg.text
		};

		console.log("[RECEBEU MSG]", log);
	});

	/// Matches "/echo <text>"
	bot.onText(/\/echo (.+)/i, function (msg, match) {
		/// 'msg' is the received Message from Telegram 'match' is the result of executing the regexp above on the text content of the message
		var chatId = msg.chat.id;
		var resp = match[1].toUpperCase() + ", " + msg.chat.username;
		
		bot.sendMessage(chatId, resp);
	});

}();

module.exports = bot;
