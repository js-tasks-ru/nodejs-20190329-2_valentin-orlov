const url = require('url');
const fs = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);



  const src = fs.createReadStream(filepath) ;
  src.pipe(res);


  src.on('error', (e) =>{
    console.log(e.message);
  });

  switch (req.method) {
    case 'GET':
      fs.exists(filepath, exist =>{
        if(!exist){
          res.statusCode = 404;
          res.end('file not found');
        }
      });
      if(pathname.split('/').length > 1){
        res.statusCode = 400;
        res.end('bad directory');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
