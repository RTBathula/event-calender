
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
global.q = require("q");
global.keys = require('./config/keys.js')();

app.use(bodyParser.json());
app.use(express.static(__dirname));

//Connect MongoDB
_connectMongoDB();
//Routes
_routes();
//Services
_services();

app.set('port', process.env.PORT || 1447);
var server = app.listen(app.get('port'), function() {
	console.log("Calender App runing on PORT:"+app.get('port'));	
});

//Private Fuctions
function _connectMongoDB(){
	var connection=require('./config/mongoConnect.js')().connect();
	connection.then(function(mongoCon){
		global.mongoDB=mongoCon;		
	},function(error){
		console.log(error);
	});
}

function _routes(){
	app.use('/', require('./routes/events')());
}

function _services(){
	global.eventsService = require('./services/events.js')();
}