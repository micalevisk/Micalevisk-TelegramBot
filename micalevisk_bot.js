// API (c) https://github.com/yagop/node-telegram-bot-api
'use strict';

require('./utils');

var dotenv = require('dotenv').config();
var TelegramBot = require('node-telegram-bot-api');

var querystring = require('querystring');
var http = require('http');

const BOT_TOKEN = process.env.BOT_TOKEN;
const GITHUB_APP_TOKEN = process.env.GITHUB_APP_TOKEN;

/// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(BOT_TOKEN, { polling: true });


// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬ //

/*
Valid formats: https://cloud.githubusercontent.com/assets/13461315/23231405/04df4a0e-f91e-11e6-9af6-dee37f82e494.png
TO USE Markdown to HTML https://developer.github.com/v3/markdown/
Generate GitHub Token:
$ curl https://api.github.com/authorizations --user "micalevisk" --data '{"scopes":[], "note":"micalevisk_bot"}'
Use API:
$ curl https://api.github.com/markdown -H "Authorization: token XYZ" --data '{"text":"# Hello lol *hehe*","mode":"gfm" }'
*/



// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬ //


/// Matches "/echo <text>"
bot.onText(/\/echo (.+)/i, function (msg, match) {
	/// 'msg' is the received Message from Telegram 'match' is the result of executing the regexp above on the text content of the message
	var chatId = msg.chat.id;
	var resp = match[1].toUpperCase() + ", " + msg.chat.username;
	// bot.sendMessage(chatId, resp);

	const openKeyboard = {
		reply_markup: {
			keyboard: [
				["Aut", "Neg"],
			],
			one_time_keyboard: true,
			resize_keyboard: true,
		},
	};

	let replyOptions = {
		reply_markup: {
			inline_keyboard: [
				[ { text: "1",  callback_data: "1",  },
				{ text: "2",  callback_data: "2",  },
				{ text: "3",  callback_data: "3",  },
				{ text: "4",  callback_data: "4",  },
				{ text: "5",  callback_data: "5",  } ],
				[ { text: "6",  callback_data: "6",  },
				{ text: "7",  callback_data: "7",  },
				{ text: "8",  callback_data: "8",  },
				{ text: "9",  callback_data: "9",  },
				{ text: "10", callback_data: "10", } ]
			],
		},
	};

	bot.sendMessage(chatId, "How would you rate the content? (1-10)", replyOptions)
		.then(() => {
			bot.on("callback_query", answer => {
				let vote = Number(answer.data);
				console.log('vote',vote);
				bot.sendMessage(chatId, "Do you want to leave a more detailed feedback?", openKeyboard)
					.then(ans => {
						bot.onReplyToMessage(chatId, ans.message_id, response => {
							console.log(response);
						});
					});
				});
			});
});


// https://github.com/yagop/node-telegram-bot-api/issues/187
// https://github.com/yagop/node-telegram-bot-api/issues/197