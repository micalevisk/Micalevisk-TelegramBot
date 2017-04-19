Object.prototype.compare = function(obj){
	for(let k in obj)
		if(this[k] !== obj[k]) return false
	return true
}

function isType({ type },t){ return type === t }
function isName({ name },n){ return name === n }
function getAttribs({ attribs }){ return attribs }
function hasAttribs(e, obj){
	const attribs = getAttribs(e)
	if(!attribs || attribs === undefined) return false
	return attribs.compare(obj)
}

const hasData = (e) => { return isType(e,'text') && e.hasOwnProperty('data') }
const strDateToObj = (strdate) => {
	const [ dia, mes, ano, hora ] = strdate.replace(/\bde\b/g,'').split(' ').filter(e => e.trim())
	return { dia:Number(dia), mes, ano:Number(ano), hora }
}

//////////////////
module.exports = {
	 isType
	,isName
	,getAttribs
	,hasAttribs
	,hasData
	,strDateToObj
}
//////////////////