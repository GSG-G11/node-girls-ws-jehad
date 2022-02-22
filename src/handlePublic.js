const path = require('path');
const fs = require('fs');

const publicHandler = (url, response) => {
    const fillPath = path.join(__dirname, '..' , url);
    const extention = path.extname(url);
    const extensionType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.jpg': 'image/jpg',
      '.png': 'image/png',
      '.json': 'application/json',
      '.ico': 'image/x-icon',
    };
    fs.readFile(fillPath, (err,data) => {
        if(err){
          response.writeHead(500);
          response.end("Server Error");
        } else {
          response.writeHead(200, {'Content-Type': extensionType[extention]});
          response.end(data)
        }
      })
}

module.exports = publicHandler;