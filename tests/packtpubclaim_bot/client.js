// ===== [ Dependencies ] ===== //
var request = require('request');
var cheerio = require('cheerio');
var scrap = require('scrap');

////////////////////////////////////////////////////////
const URL_PACKTPUB = 'https://www.packtpub.com';
const URL = URL_PACKTPUB + '/packt/offers/free-learning';
var loginError = 'Sorry';

var bookURL, bookTitle, currentDate;

var loginDetails = {};
var lastclaim = {} ;
var cbBookClaim = null;
////////////////////////////////////////////////////////


/**
 * Instance of client service
 * @param {Object} credentials - with properties: 'email' and 'password'
 */
var client = function client(credentials){
	if(this instanceof client === false) return new client(credentials);
	if(arguments.length < 1) throw new Error("Ausência de argumentos");
	if(typeof credentials !== 'object') throw new TypeError("Parameters must be String");
	if(!credentials.hasOwnProperty('email') || !credentials.hasOwnProperty('password')) throw Error("O argumento precisa ter 'email' e 'password'")

    loginDetails = {
          email: credentials.email
        , password: credentials.password
        , op: "Login"
        , form_id: "packt_user_login_form"
        , form_build_id: ""	
    };


}




// We need cookies for that, therefore let's turn JAR on
request = request.defaults({ jar: true });

// ========================= [ Internal Request ] ========================= //
let cbPost = function(err, res, body) {
    if (err) {
        console.error('Login failed');
        return;
    }

    var $ = cheerio.load(body);
    var loginFailed = $(`div.error:contains('${loginError}')`);
    if (loginFailed.length) {
        console.error('Login failed, please check your email address and password');
        console.log('Login failed, please check your email address and password');
        return;
    }

    var claimURL = URL_PACKTPUB + bookURL
    request(claimURL, function(err, res, body) {
        if (err) {
            lastclaim = null;
            console.error('Request Error');
            return;
        }

        console.log('-------------- Last Claim ----------------');
        console.log('Book Title:', bookTitle);
        console.log('Claim URL :', claimURL);
        console.log('Date      :', currentDate);
        console.log('------------------------------------------');

        lastclaim = {
             name: bookTitle
            ,url: claimURL
            ,date: currentDate
        };
        if(cbBookClaim) cbBookClaim(lastclaim);

    });
};

// ========================= [ External Request ] ========================= //
let cbRequest = function(err, res, body) {
    if (err) {
        console.error('Request failed');
        return;
    }

    var $ = cheerio.load(body);
    bookURL = $("a.twelve-days-claim").attr("href");
    bookTitle = $(".dotd-title").text().trim();
    currentDate = new Date().toLocaleString();
    var newFormId = $("input[type='hidden'][id^=form][value^=form]").val();

    if (newFormId) loginDetails.form_build_id = newFormId;

    request.post({
        uri: URL,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: require('querystring').stringify(loginDetails)
    }, cbPost);
};


// ========================= [ Valid Methods To client Instance ] ========================= //
client.prototype.claimLast = function (cbInfoBook) {
	if(cbBookClaim && typeof cbBookClaim !== 'function') throw new TypeError("o callback deve ser Function");
	cbBookClaim = cbInfoBook;
	request(URL, cbRequest);
};


client.prototype.infoLast = function (cbInfoBook) {
    scrap(URL, function(err, $){
        if(err) return null;

        var bookName = $('.dotd-title h2').text().trim();
        var bookURL  = "https://www.packtpub.com/" + $('.twelve-days-claim').attr('href');
        var currentDate = new Date().toLocaleString();

        if(cbInfoBook && typeof cbInfoBook !== 'function') throw new TypeError("o callback deve ser Function");
        cbInfoBook({
             name: bookName
            ,url: bookURL
            ,date: currentDate
        });
    });
}


//////////////////////////////
module.exports.client = client;
//////////////////////////////