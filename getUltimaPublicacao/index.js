const request= require('request')
const cheerio= require('cheerio')
const core   = require('./config').core
const _      = require('./utils')

const URL = `${core.protocol}://${core.hostname}${core.path}/${core.page}`
let callback;

/// ================================================== ///
const titleHandler =
{
	isPattern: (e) => {
		return	_.isType(e,'tag') &&
				_.isName(e,'h4')
	}
	,isChildren: (e) => {
		return	_.isType(e,'tag') &&
				_.isName(e,'a') &&
				e.hasOwnProperty('attribs') &&
				_.hasAttribs(e, { dir: 'ltr' })
	}
}

const dateHandler = 
{
	isPattern: (e) => {
		return 	_.isType(e,'tag') &&
				e.hasOwnProperty('attribs') &&
				_.hasAttribs(e, { class: 'timestamp' })
	}
	,isChildren: (e) => {
		return	_.isType(e,'tag') &&
				e.hasOwnProperty('attribs') &&
				_.hasAttribs(e, { dir: 'ltr' })
	}
}
/// ================================================== ///


function requestCallback(error, response, body){
	if(error) return callback(error);
	if(response.statusCode !== 200) return callback(new Error("Invalid Status Code!"));

	const $ = cheerio.load(body);
	let ultimaPublicacao = $('div.announcement')[0]
	if(!ultimaPublicacao) return callback(error);

	const titleobj = ultimaPublicacao.children.find(titleHandler.isPattern)
	const publicLinkobj = titleobj.children.find(titleHandler.isChildren)
	const title = publicLinkobj.children.find(_.hasData).data
	const linkpage = _.getAttribs(publicLinkobj)['href'].split('/').pop()

	const timeobj = ultimaPublicacao.children.find(dateHandler.isPattern)
	const dateobj = timeobj.children.find(dateHandler.isChildren)
	const date = dateobj.children.find(_.hasData).data

	ultimaPublicacao = {
		 titulo: title
		,link: URL+'/'+linkpage
		,data: _.strDateToObj(date)
	}

	return callback(null, ultimaPublicacao)
}


//////////////////////////////////////////////////
module.exports = function getUltimaPublicacao(cb){
	callback = cb
	request(URL, requestCallback)
}
//////////////////////////////////////////////////