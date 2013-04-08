var tchat   =   require('./tchat');
var cookie  =   require('../app/cookie');
var channelMgt  =   require('./channelManagement');

var socketManager = {
    /**
     * Bind sockets events
     *
     * @param socket
     */
    init: function(socket) {
        var self = this;
        socket.handshake.cookies = cookie.parse(socket.handshake);

        // Get the previous messages
        socket.on('getMessages', function(mess) { return self.getMessages(socket, mess); });

        // When a new message is sent
        socket.on('newMessage', function(mess) {return self.newMessage(socket, mess);});

        // On socket disconnect
        socket.on('disconnect', function() { return self.disconnect(socket); });

        // Show the welcome message
        socket.on('welcome', function() { return self.welcome(socket); });

        // Execute a command
        socket.on('command', function(mess) { return self.command(socket, mess); });
    },
    command: function(socket, message) {
        if(!socket.channel) {
            socket.emit('timeout');
        } else {
            switch (message.command) {
                case 'clear':
                    socket.channel.flushMessages();
                    // Broadcast command
                    this.broadcast(socket, function(client) {
                        client.emit('command', {
                            command: 'clear'
                        });
                    })
                    break;
                case 'topic':
                    socket.channel.roomTopic = message.topic;
                    // Broadcast command
                    this.broadcast(socket, function(client) {
                        client.emit('command', message);
                    })
                    break;
                case 'name':
                    socket.channel.roomName = message.name;
                    // Broadcast command
                    this.broadcast(socket, function(client) {
                        client.emit('command', message);
                    })
                    break;
                case 'password':
                    socket.channel.password = message.password;
                    // Broadcast command
                    this.broadcast(socket, function(client) {
                        client.emit('command', message);
                    })
                    break;
                default:
                    return false;
                    break;
            }
        }
    },
    /**
     * Return the number of connected users
     *
     * @param socket
     * @returns {{nbUsers: Number}}
     */
    welcome: function(socket) {
        return {
            nbUsers: socket.channel.users.length
        };
    },
    /**
     * Get the previous messages wrote in the channel
     *
     * @param socket
     * @param mess
     * @returns {*}
     */
    getMessages: function(socket, mess) {
        var self = this;
        socket.channel = channelMgt.get(mess.uri);
        if(!socket.channel) {
            return { status: false, message: 'Channel doesn\'t exist !'};
        }

        // Register the current user
        socket.channel.addSocket(socket);

        console.log('Get messages of the room "'+socket.channel.roomName+'"');
        socket.emit('getMessages', socket.channel.getMessages());
        // Say welcome to the new user
        socket.emit('welcome', {
            nbUsers: socket.channel.getSockets().length
        });
        socket.emit('details', {
            roomName: socket.channel.roomName,
            roomTopic: socket.channel.roomTopic
        });
        // Alert other user to the new user arrive
        this.broadcast(socket, function(client) { client.emit('welcome', {
            nbUsers: socket.channel.getSockets().length
        }); });

        // The user is not pending for socket auth, remove it
        socket.channel.removeUser(socket.handshake.cookies.getSSID());

        return socket.channel.messages;
    },
    /**
     * Disconnect the socket to the channel
     *
     * @param socket
     */
    disconnect: function(socket) {
        if(socket.channel) {
            var i = 0,
                ssid = socket.handshake.cookies.getSSID()
            ;

            // Get socket index in channel
            console.log('Connected users in the room: '+socket.channel.getSockets().length);
            socket.channel.removeSocket(socket);
            console.log('Socket disconnected: '+socket.id);
            console.log('Connected users in the room: '+socket.channel.getSockets().length);

            // Broadcast the news
            this.broadcast(socket, function(client) { client.emit('goodbye', {
                nbUsers: socket.channel.getSockets().length
            }); });
        } else {
            socket.emit('timeout');
            console.log('Old connection reset, emit timeout');
        }
    },
    /**
     * Broadcast the new message to the other users in the channel
     *
     * @param socket
     * @param mess
     */
    newMessage: function(socket, mess) {
        if(!socket.channel) {
            return { status: false, message: 'Channel doesn\'t exist !'};
        }

        if(tchat.command(mess.message)) {
            // On l'ajout au tableau (variable globale commune a tous les clients connectes au serveur)
            mess.date = tchat.getDate(new Date());
//            socket.channel.messages.push(mess);
            socket.channel.addMessage(mess);
        }

        this.broadcast(socket, function(client) {
            client.emit('getNewMessage', mess);
        });
    },
    /**
     * Broadcast to relevant sockets the given function.
     * This function must implement an emit method on the socket parameter
     *
     * @param socket
     * @param func
     */
    broadcast: function(socket, func) {
        var ssid = socket.handshake.cookies.getSSID();
	if(!socket.channel) {
            return null;
	}
        for(var i in socket.channel.sockets) {
            if(socket.channel.sockets[i].id != socket.id) {
                func(socket.channel.sockets[i]);
            }
        }
    }
}

module.exports = socketManager;
