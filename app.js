var check = require('validator').check,
	sanitize = require('validator').sanitize;


var port = 8080;

if(process.argv.length>2 ){
	try{
		check( process.argv[2] ).isInt();
		port = sanitize( process.argv[2] ).toInt(); 
	}catch(e){
		logger.warn("Try node app.js PORT_NUMBER");
		process.exit(1);
	}
}


var express = require('express');
var server = express();
server.use(express.static(__dirname + '/public'));

server.get('/', function (req, res) {
		res.sendfile(__dirname + '/index.html'); //save static file with no modifications
});

	
server.get('/:code/:data', function (req, res) {
   // here pass the port
    res.writeHead(req.params.code, {"Content-Type": "text/html"});
	
    if(req.query["callback"]){
		res.end( req.query["callback"] +'('+req.params.data+');');	
    }else{
		res.end(req.params.data);	
	}
});

server.listen(port);


