const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg'};
http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');const file=url.pathname==='/'?'index.html':url.pathname.slice(1);if(!['index.html','style.css','game.js','learning.js'].includes(file)&&!/^assets\/(arrival|supplies|health|food|shelter|planning)\.jpg$/.test(file)){res.writeHead(404);return res.end('Not found');}fs.readFile(path.join(__dirname,file),(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',types[path.extname(file)]);res.end(data);});}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
