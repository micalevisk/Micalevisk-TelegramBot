const scrap = require('scrap')
const config= require('./config')
const _		= require('./utils')

const core = config.core
const URL = `${core.protocol}://${core.hostname}${core.path}/${core.page}`
let callback;

function scrapCallback(err, $){
	if(err) return callback(err)
	
	let elemento = _.getLast($, 'div.announcement')

	let strUpdatedTime = null
	let elementoUpdatedTime = elemento.children[3].children.find(_.isValidUpdatedTimeChildren)
	if(elementoUpdatedTime) strUpdatedTime = elementoUpdatedTime.children.find(_.isValidTimestampChildren).children[0].data

	let strData = (strUpdatedTime !== null) ? strUpdatedTime : elemento.children[3].children.find(_.isValidTimestampChildren).children[0].data  // console.log(elemento.children[3].children.filter(e => e.attribs && e.attribs.hasOwnProperty('dir')) )
	let arrData = strData.replace(/\bde\b/g,'').split(' ').filter(e => e.trim())

	let ultimaPublicacao = {
		 titulo: elemento.children[1].children[0].children[0].data
		,link: `${core.protocol}://${core.hostname}` + elemento.children[1].children[0].attribs.href
		,data: {
			dia: parseInt(arrData[0]),
			mes: arrData[1],
			ano: parseInt(arrData[2]),
			hora: arrData[3]
		}
	}

	return callback(null, ultimaPublicacao)
}

//////////////////////////////////////////////////
module.exports = function getUltimaPublicacao(cb){
	callback = cb
	scrap(URL, scrapCallback)
}
//////////////////////////////////////////////////

/*
callback = function(err, ultimaPublicacao){
	console.log( JSON.stringify(ultimaPublicacao,null,2) )
}
*/



/*
EXEMPLO SAÍDA
=============
{
  "titulo": "Não haverá aula nos dias 14 e 20 de março",
  "link": "https://sites.google.com/site/compiladoresicompufam2017/classroom-news/naohaveraaulanosdias14e20demarco",
  "data": {
    "dia": 14,
    "mes": "mar",
    "ano": 2017,
    "hora": "19:12"
  }
}
*/


/*
const HOME = 'https://sites.google.com'
const URL = HOME + '/site/compiladoresicompufam2017/home'
scrap(URL, (err, $) => {
	if(err) return console.error('Error', err)

	const getLast = (query) => {
		let elt = $(query)
		return elt !== undefined ? elt[0] : null
	}

	let elemento = getLast('a.sites-announcement-embed-post-title').children[0]
	let timestamp= $('span.sites-text-secondary')[0]
	let childrensTimestamp = timestamp.children
	// timestamp = childrensTimestamp[childrensTimestamp.length - 2].children[0].data
	// timestamp = childrensTimestamp.slice(-2,-1).children[0].data

	let dados = {
		 titulo: '"' + elemento.data.trim() + '"'
		,link: HOME + elemento.parent.attribs.href
		,data: childrensTimestamp.slice(-2,-1).children[0].data
	}

	console.log(dados)
	
});
*/