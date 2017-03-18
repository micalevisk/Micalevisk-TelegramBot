const isValid = (e, prop, value) => e.hasOwnProperty('attribs') && e.attribs.hasOwnProperty(prop) && e.attribs[prop] === value
const isValidTimestampChildren	= (e, i, a) => isValid(e, 'dir', 'ltr')
const isValidUpdatedTimeChildren= (e, i, a) => isValid(e, 'class', 'updatedTime')

const getLast = ($, query) => {
	let elt = $(query)
	return elt !== undefined ? elt[0] : null
}


////////////////////////////////
module.exports = {
	 isValidTimestampChildren
	,isValidUpdatedTimeChildren
	,getLast
}
////////////////////////////////