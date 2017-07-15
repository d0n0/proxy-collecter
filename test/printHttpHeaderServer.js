const http = require('http');

const port = process.argv[2];

const initialToUpper = str => {
  let arr = str.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join('-');
}

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  for(let key of Object.keys(req.headers)) {
    console.log(`${initialToUpper(key)}: ${req.headers[key]}`);
  }
  console.log('-------------------------------------------------');
  res.end();
}).listen(port);
console.log(`Server running at http://localhost:${port}/`);
console.log('-------------------------------------------------');