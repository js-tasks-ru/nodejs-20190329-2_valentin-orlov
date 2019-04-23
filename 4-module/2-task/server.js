const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const server = new http.Server();




server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'POST':
      if (!pathname || pathname.indexOf('/')>0) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          saveFile(filepath, req, res);
          return;
        }

        res.statusCode = 409;
        res.end('Conflict');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function saveFile(filepath, req, res) {
  const lsStream = new LimitSizeStream({limit: 1024 * 1024});
  const fwStream = fs.createWriteStream(filepath);

  req.pipe(lsStream).pipe(fwStream);

  req.on('aborted', () => removeFile());
  lsStream.on('error', () => handleError(413, 'file is large'));
  fwStream.on('error', () => handleError(500, 'server error'));

  fwStream.on('finish', () => {
    res.statusCode = 201;
    res.end('Created');
  });


  function handleError(code, message) {
    removeFile();
    res.statusCode = code;
    res.end(message);
  }


  function removeFile() {
    fs.unlink(filepath, (err) => {
      if (err) {
        return false;
      }
    });
  }
};

module.exports = server;
