// (C) API http://telegraf.js.org/telegram.html
require('./lib/string_methods')
const log = require('./lib/logger')
const getUltimaPublicacao = require('./getUltimaPublicacao')
try { log.setLevel("debug"); } catch(e) {};

const dotenv = require('dotenv').config()
const Telegraf = require('telegraf')

/* http://telegraf.js.org/telegram.html
const { Telegram } = require('telegraf')
const app = new Telegram(process.env.BOT_TOKEN)

== exemplo:
	let from_msg_id  = ctx.message.message_id
	let from_chat_id= ctx.message.from.id
	let to_chat_id  = from_chat_id
	app.forwardMessage(from_chat_id, to_chat_id, from_msg_id)
*/

const bot = new Telegraf(process.env.BOT_TOKEN)

/*
bot.use((ctx, next) => {
  const start = new Date()
  return next().then(() => {
    const ms = new Date() - start
    // console.log('[DEBUG] ~> Response time %sms', ms)
    log.debug(`Response Time: ${ms}ms`)
  })
})
*/

const default_opts = { parse_mode: 'HTML', disable_notification: true, disable_web_page_preview: true }

/**
 * /marco
 * Mostra a última publicação
 * da página https://sites.google.com/site/compiladoresicompufam2017/classroom-news
 */
bot.command('marco', (ctx) => {
	let from_msg_id = ctx.message.message_id

	getUltimaPublicacao((erro, publicacao) => {
		let  replymsg
			,replyopts = Object.assign({ reply_to_message_id: from_msg_id }, default_opts)

		if(publicacao){
			// log.debug( JSON.stringify(publicacao,null,2) )
			replymsg = [
				`${publicacao.data.dia}/${publicacao.data.mes}`.asCode() + ` (${publicacao.data.hora})`.asItalic()
				,publicacao.titulo.asLink(publicacao.link)
			].join('\n')
		}
		else{
			log.error(erro)
			replymsg = 'erro'.asCode()
		}

		return ctx.reply(replymsg, replyopts)
	})
})



bot.startPolling()
