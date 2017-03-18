// (C) API http://telegraf.js.org/telegram.html
require('./lib/string_methods')
const log = require('./lib/logger')
const getUltimaPublicacao = require('./getUltimaPublicacao')
try { log.setLevel("debug"); } catch(e) {};

const dotenv = require('dotenv').config()
const Telegraf = require('telegraf')

const app = new Telegraf(process.env.BOT_TOKEN)

/*
app.use((ctx, next) => {
  const start = new Date()
  return next().then(() => {
    const ms = new Date() - start
    // console.log('[DEBUG] ~> Response time %sms', ms)
    log.debug(`Response Time: ${ms}ms`)
  })
})
*/

const default_opts = {  parse_mode: 'HTML', disable_notification: true, disable_web_page_preview: true }

/**
 * /marco
 * Mostra a última publicação
 * da página https://sites.google.com/site/compiladoresicompufam2017/classroom-news
 */
app.command('marco', (ctx) => {
	let from_msg_id = ctx.message.message_id
	// let from_chat_id= ctx.message.from.id

	getUltimaPublicacao((erro, publicacao) => {
		let  replymsg
			,replyopts = Object.assign({ reply_to_message_id: from_msg_id }, default_opts)

		if(publicacao){
			// log.debug( JSON.stringify(publicacao,null,2) )
			replymsg = [
				`${publicacao.data.dia}/${publicacao.data.mes}`.asCode() + ` (${publicacao.data.hora})`.asItalic()
				,publicacao.titulo.asBold()
				,'link'.asLink(publicacao.link)
			].join('\n')
		}
		else{
			log.error(erro)
			replymsg = 'erro'.asCode()
		}

		ctx.reply(replymsg, replyopts)
	})
})



app.startPolling()
