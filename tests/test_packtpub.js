require('dotenv').load({
    path: __dirname + '/.env'
});

var packtpubclaim_bot = require('./packtpubclaim_bot')

var client = new packtpubclaim_bot.client({
	email: process.env.PACKT_EMAIl,
	password: process.env.PACKT_PASSWORD
})

/*
client.claimLast((infobook) => {
	console.log(infobook)
});
*/
/*
client.infoLast((infobook) => {
	console.log(infobook)
});
*/