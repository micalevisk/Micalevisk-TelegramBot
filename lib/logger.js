function formatDate(date){
	let hours = date.getHours();
	let mins  = date.getMinutes();
	hours = (hours < 10 ? "0" : "") + hours;
	mins = (mins < 10 ? "0" : "") + mins;
	return `${hours}:${mins}`;
}


var currentLevel = "info";
var levels = { "trace": 0, "debug": 1, "info": 2, "warn": 3, "error": 4, "fatal": 5 }

// Logger implementation..
function log(level) {
    // Return a console message depending on the logging level..
    return function (message) {
        if (levels[level] >= levels[currentLevel]) {
            console.log(`[${formatDate(new Date())}] ${level} ~> ${message}`);
        }
    }
}

module.exports = {
    // Change the current logging level..
    setLevel: function(level) {
        currentLevel = level;
    },
    trace: log("trace"),
    debug: log("debug"),
    info: log("info"),
    warn: log("warn"),
    error: log("error"),
    fatal: log("fatal")
};