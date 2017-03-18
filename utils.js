String.prototype.isEmpty = function ()    { return !this.trim() ; }
String.prototype.asBold  = function ()    { return `<b>${this}</b>` ; }
String.prototype.asItalic= function ()    { return `<i>${this}</i>` ; }
String.prototype.asCode  = function ()    { return `<code>${this}</code>` ; }
String.prototype.asStrong= function ()    { return `<strong>${this}</strong>` ; }
String.prototype.asLink  = function (ref) { return `<a href="${ref}">${this}</a>` ; }
Number.prototype.notValid= function ()    { return !settings.chat_validos.contains(String(this)) ; }
