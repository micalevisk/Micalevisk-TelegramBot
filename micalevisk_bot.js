// (C) API http://telegraf.js.org/telegram.html

// ======================[ CONFIGS ] ====================== //
require('./lib/string_methods')
const log = require('./lib/logger')
const getUltimaPublicacao = require('./getUltimaPublicacao')
try { log.setLevel("debug"); } catch(e) {};

// ============= [ DEPENDENCIES ] ============= //
const dotenv	= require('dotenv').config()
const Telegraf	= require('telegraf')
const { Extra, Markup } = require('telegraf')

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

const defaultReplyOptions = Extra.HTML().notifications(false).webPreview(false)


// ====================== [ COMMANDS ] ====================== //

/**
 * /marco
 * Mostra a última publicação
 * da página https://sites.google.com/site/compiladoresicompufam2017/classroom-news
 */
bot.command('marco', (ctx) => {
	let from_msg_id = ctx.message.message_id

	getUltimaPublicacao((erro, publicacao) => {
		let  replymsg
			,replyopts = defaultReplyOptions.inReplyTo(from_msg_id)

		if(publicacao && typeof publicacao === 'object'){
			// log.debug( JSON.stringify(publicacao,null,2) )
			replymsg = [
				`${publicacao.data.dia}/${publicacao.data.mes}`.asBold() + ` (${publicacao.data.hora})`.asCode()
				,publicacao.titulo.asLink(publicacao.link) + ' 📝'
			].join('\n')

			replyopts = Object.assign(replyopts, 
				Markup.inlineKeyboard([
					Markup.callbackButton('lida', '_ready')
				]).extra()
			)

			return ctx.reply(replymsg, replyopts)
		}
		else{
			log.error(erro)
			replymsg = 'erro ao solicitar'.asCode()
			return ctx.answerCallbackQuery(replymsg, replyopts)
		}

	})
})



// ====================== [ ACTIONS ] ====================== //
bot.action('_ready', (ctx, next) => {
  let oldtext = ctx.update.callback_query.message.text
  return ctx.editMessageText(oldtext.slice(0,-3))
})




//////////////////
bot.startPolling()
//////////////////