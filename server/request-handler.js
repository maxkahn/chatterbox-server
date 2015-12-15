/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var staticServer = require('node-static');

var file = new(staticServer.Server)('./client/client');

var chats = [];

var directory = {'http://127.0.0.1:3000/': true, 
  "/": true, "/classes/room1": true, 'http://127.0.0.1:3000/classes': true,
"/classes/messages": true};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

    //check whether uri exists
  //   //if not, set statusCode to 404 and end.
  //   if (request.url.substring(0, 8) !== "/classes" || 
  //     (request.uri !== undefined && request.uri.substring(0, 30) !== "http://127.0.0.1:3000/classes/")) {
  //     statusCode = 404;
  //   response.end("Page not found");
  // 

  file.serveFile('/index.html', request, response);

  //console.log(request.url);
  console.log("dir", __dirname + request.url);

  var statusCode;
   var headers = defaultCorsHeaders;
  if (request.method === 'OPTIONS') {
    //do stuff
    statusCode = 200;
  }
  else if (directory[request.url] === undefined) {
    response.writeHead(404, headers);
    response.end("Page not found");
    return;
  }

  else if (request.method === 'GET') {
    statusCode = 200;

  }
  else if(request.method === 'POST') {
    statusCode = 201;
    //results.push(request.data);

    request.on('data', function(chunk) {
      //console.log('body: ' + chunk);
      chats.unshift(JSON.parse(chunk));
      directory[request.url] = true;

    });
  }
  console.log("Serving request type " + request.method + " for url " + request.url);



  // The outgoing status.




  // request.on('finish', function(message) {
  //   console.log(message.statusCode);
  // });
  

  // if (request.uri === 'http://127.0.0.1:3000/arglebargle') {
  //   statusCode = 404;
  // }

  //console.log("chats", chats);

  //console.log("Serving request type " + request.method + "with code " + statusCode);

  // See the note below about CORS headers.
  // if (request.method === 'OPTIONS') {
  //   var headers = defaultCorsHeaders;
  // }
  // else {
  //   headers['Content-Type'] = ["text/plain", "application/json"];
  // }

 


  headers['Content-Type'] = 'application/json';

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  //console.log(chats);

  var otherObject = {results: chats};



  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //console.log(response);
  response.end(JSON.stringify(otherObject));

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;

