const core = {
	 protocol: 'https'
	,hostname: 'sites.google.com'
	,path: '/site/compiladoresicompufam2017'
	,page_noticias: 'classroom-news'
	,page_exercicios: 'assignments'
}

function getLinkToPage(page){
	return core.protocol + "://" + core.hostname + core.path + '/' + page
}

/////////////////////////////////////////////////
module.exports = {
	 pageNoticias: getLinkToPage(core.page_noticias)
	,pageExercicios: getLinkToPage(core.page_exercicios)
}
/////////////////////////////////////////////////