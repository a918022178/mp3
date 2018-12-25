var express = require('express');
var https = require('https');
var WebSocket = require('ws');

var app = express();
app.use(express.static(__dirname));

let fs = require("fs");
let pfxpath = __dirname + '/zhengpeng.xyz.pfx';
let passpath = __dirname + '/keystorePass.txt';
let options = {
    pfx: fs.readFileSync(pfxpath),
    passphrase: fs.readFileSync(passpath),
};

var server = https.createServer(options);
var wss = new WebSocket.Server({server});

const a = require('./src/utils/1')

wss.on('connection', function connection(ws) {
    console.log('链接成功！');
    ws.on('message', (res) => {
        let data = JSON.parse(res)
        console.log(data)
        if (data.type !== 1) {
            wss.clients.forEach(function each(client) {
                client.send(data.url);
            });
            return
        }
        a.a(data.url,wss)
    });
});

server.listen(8888, function listening() {
    console.log('服务器启动成功！');
});