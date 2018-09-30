/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

var unifiedServer = function(req,res){
  var parsedUrl = url.parse(req.url, true);
  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  var queryStringObject = parsedUrl.query;
  var method = req.method.toLowerCase();
  var headers = req.headers;

  // Payload
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

      var chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;

      var data = {
        'path' : path,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };
      console.log('Request: ', data);

      chosenHandler(data,function(statusCode,payload){
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        payload = typeof(payload) == 'object'? payload : {};
        var payloadString = JSON.stringify(payload);

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log('Response: ',statusCode,payloadString);
      });
  });
};

// Handlers
var handlers = {};

handlers.hello = function(data,callback){
  var response = {};
  if (typeof(data.queryStringObject.name) == 'string' ){
    response.name = data.queryStringObject.name;
  } else {
    response.name = "Anonymous";
  }
  response.greeting = "Hello " + data.queryStringObject.name + "!!!";

  callback(200, response);
};


handlers.notFound = function(data,callback){
  callback(404);
};

// Routes
var router = {
  'hello' : handlers.hello
};


var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});

httpServer.listen(config.httpPort,function(){
  console.log('The HTTP server is up in the port: ' + config.httpPort + ' in ' + config.envName + ' mode.');
});

var httpsServerOptions = {
  'key': fs.readFileSync('./ssl/key.pem'),
  'cert': fs.readFileSync('./ssl/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
});

httpsServer.listen(config.httpsPort,function(){
 console.log('The HTTP server is up in the port' + config.httpsPort + ' in ' + config.envName + ' mode.');
});
