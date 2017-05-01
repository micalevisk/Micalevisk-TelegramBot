/*********************************************************************************
TODO
consultas diárias (24hrs) (a partir do '/start') [setIntervalu]
'/stop' para pausar as consultas diárias [clearInterval]
salvar o dia da última consulta e ver se a notícia recuperada tem tempo diferente
*********************************************************************************/

// (C) API http://telegraf.js.org/telegram.html
// read https://github.com/telegraf/telegraf/blob/286614a6fc48e054a1ecfcc136e6e6bf3ac4e032/docs/context.md

// ======================[ CONFIGS ] ====================== //
require('./lib/string_methods')
const config = require('./getUltimaPublicacao/config')
const getUltimaPublicacao = require('./getUltimaPublicacao')
const log = require('./lib/logger')

try { log.setLevel("debug"); } catch(e) {};

const URL_NOTICIAS   = config.pageNoticias
const URL_EXERCICIOS = config.pageExercicios

// ============= [ DEPENDENCIES ] ============= //
const dotenv   = require('dotenv').config()
const Telegraf = require('telegraf')
const { Extra, Markup } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
log.debug('processo iniciado!')

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

let intervalID = null;//§
// ====================== [ COMMANDS ] ====================== //

/**
 * /start
 */
bot.command('start', (ctx) => {
	const msg = ctx.message
	const chat = msg.chat
	log.info(`bot iniciado no chat ${chat.id} (${chat.username})`)


	const from_msg_id = msg.message_id
	intervalID = setInterval(function(){
		let replyopts = defaultReplyOptions.inReplyTo(from_msg_id)
		ctx.reply('up^^', replyopts)
	}, 3600000 * 24)//§
})

/**
 * /marco
 * Mostra a última publicação de "Anúncios para turma" e "Exercícios"
 * páginas
 * https://sites.google.com/site/compiladoresicompufam2017/classroom-news
 * https://sites.google.com/site/compiladoresicompufam2017/assignments
 */
bot.command('marco', (ctx) => {
// bot.hears(/^\/marco$/, (ctx) => {
	const from_msg_id = ctx.message.message_id

	const callGetUltimaPublicacao = (url) => {
		getUltimaPublicacao(url, (erro, publicacao) => {
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
						Markup.callbackButton('LIDO 👀', '_msglida')
					]).extra()
				)
			}
			else{
				log.error(erro)
				replymsg = 'erro ao solicitar'.asCode()
			}

			return ctx.reply(replymsg, replyopts)
		})
	}

	callGetUltimaPublicacao(URL_NOTICIAS)
	callGetUltimaPublicacao(URL_EXERCICIOS)
})



// ====================== [ ACTIONS ] ====================== //
bot.action('_msglida', (ctx, next) => {
  let oldtext = ctx.update.callback_query.message.text
  return ctx.editMessageText(oldtext.slice(0,-3))
})



//////////////////
bot.startPolling()
//////////////////