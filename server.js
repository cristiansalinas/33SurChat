var http = require('http');
var sockjs = require('sockjs');


var connections = [];


var chat = sockjs.createServer();
chat.on('connection', function(conn) {
    connections.push(conn);
    var number = connections.length;
    conn.write(JSON.stringify({number: number, message: "Bienvenido ! usuario " + number, date: new Date()}));
    conn.on('data', function(message) {
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write(JSON.stringify({number: number, message: message, date: new Date()}));
        }
    });
    conn.on('close', function() {
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write(JSON.stringify({number: number, message: "Usuario " + number + " se ha ido, indignado", date: new Date()}));
        }
    });
});

var server = http.createServer();
chat.installHandlers(server, {prefix:'/chat'});
server.listen(7000, '0.0.0.0');
