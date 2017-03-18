const getUltimaPublicacao = require('./index')

getUltimaPublicacao((erro, publicacao) => {
	if(publicacao)
		console.log( JSON.stringify(publicacao,null,2) )
})