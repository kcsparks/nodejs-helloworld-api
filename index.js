const http = require("http");
const url = require("url");
//initiate http server
const httpServer = http.createServer((req, res) => {
    //parse url
    const parsedUrl = url.parse(req.url, true)
    //remove trailing slashes from url
    const pathName = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');
    //choose a handler, default to handlers.notFound if path isn't in router
    const chosenHandler = typeof(router[pathName]) !== 'undefined' ? router[pathName] : handlers.notFound;
    const method = req.method.toLowerCase();

    //create data object with method
    const data = {
      method
    };

    chosenHandler(data, (statusCode, payload) => {
      //Use the status code called back by the handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 404;

      //Use the payload called back by the handler or defualt to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      //add content-type: application/json to header
      res.setHeader('Content-Type', 'application/json');
      //add status code to header
      res.writeHeader(statusCode);
      //send JSON payload from handler callback
      res.end(JSON.stringify(payload));
    });
});

//listen on port 3000
httpServer.listen(3000, () => {
  console.log("The server is listening on port " + 3000);
});


//create container object for handlers
const handlers = {}

//return 404 if not found
handlers.notFound = (data, callback) => {
    callback(404);
}

//hello world handler
handlers.helloWorld = (data, callback) => {
  //if the method is post send message hello world
  if(data['method'] == 'post'){
    callback(200, {'message': 'Hello World'});
  }else{
    //if any other method default to notFound handler
    handlers.notFound(data,callback);
  }

}


const router = {
  'hello': handlers.helloWorld

}
