var http = require('http');
var httpProxy = require('http-proxy');

var PORT = 1234;

var proxy = httpProxy.createProxyServer();

proxy.on('error',function(err, req, res){
	res.end();
});

var app = http.createServer(function(req, res){
	proxy.web(req, res, {
		target: 'http://localhost:8989'
	});
});

app.listen(PORT, function(){
	console.log('Server is running at %d', PORT);
})