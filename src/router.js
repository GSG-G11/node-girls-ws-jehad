const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const publicHandler = require('./handlePublic');

const router = (request, response) => {
    const url = request.url;
    const method = request.method;

    if(url === '/'){
     publicHandler('/public/index.html', response);
    } else if(url.includes('public')){
      publicHandler(url, response);
    }
    else if(url === '/posts' && method === 'GET'){
      const fillPath = path.join(__dirname, 'posts.json');
      fs.readFile(fillPath, (err, data) => {
        if(err){
          response.writeHead(500, { 'Content-Type': 'text/html' });
          response.end('Server Error');
        }else{
          response.writeHead(200, {'content-type': 'application/json'});
          response.end(data)
        }
      })
    }else if(url === '/create-post' && method === 'POST'){
      let allTheData = '';
      request.on('data', chunkOfData => {
          allTheData += chunkOfData;
      });
      request.on('end', () => {
        const convertedData = querystring.parse(allTheData);
        const jsonPath =  path.join(__dirname, 'posts.json');
        fs.readFile(jsonPath, (err, file) => {
          if(err){
            response.writeHead(500);
            response.end('SERVER ERROR');
          }else{
            const obj = JSON.parse(file);
            obj[Date.now()] = convertedData.post;

            fs.writeFile(jsonPath, JSON.stringify(obj), err => {
              if(err){
                response.writeHead(500);
                response.end('Server Error');
              }
            })
            response.writeHead(302, {"Location": "/"});
            response.end();
          }
        })
      });
    }
    else{
      response.writeHead(404);
      response.end(`<h1>Page Not Found</h1>`);
    }
  }

  module.exports = router;