var http        =   require('http'),
    fs          =   require('fs'),
    routing     =   require("./src/routing"),
    socketMgr   =   require("./src/socketManager"),
    channelMgr  =   require("./src/channelManagement"),
    io          =   require('socket.io')
;

// Create server
var app = http.createServer(function (request, response) {
    routing.execute(request, response);
});

// Destroy obsolete channels every seconds
setInterval(function() {
    channelMgr.cleaner();
}, 600000); // Check each 10 minutes

// =============== BEGIN SOCKET.IO ===============
// Listen app
io = io.listen(app, { log: false });

// Bind event on each new sockets
io.sockets.on('connection', function (socket) {
    socketMgr.init(socket);
});
// =============== END SOCKET.IO ===============

// Open server on port 10000
app.listen(10000);
console.log('SMS running at http://localhost:10000/');