/**
 * Room channels container
 * - Channel
 *   |- url
 *   |- password
 *   |- room name
 *   |- room topic
 *   |- users
 *   |- messages
 *     |- Username
 *     |- Message
 *     |- Date
 *   |- sockets
 *
 * @type {Array}
 */
var channels = [],
    cleanerDelay = 86400 // A day of delay before destroying a channel
;

/**
 * Channel definition
 *
 * @param properties
 * @constructor
 */
function Channel(properties) {
    this.url        = properties.url        || '';
    this.password   = properties.password   || '';
    this.roomName   = properties.roomName   || '';
    this.roomTopic  = properties.roomTopic  || '';
    this.messages   = properties.messages   || [];
    // The user list if for connection purpose, a user in it is pending for a connection. After that the entry is deleted
    this.users      = properties.users      || [];
    // List of sockets connected to this channel. You can have the real user number here
    this.sockets    = properties.sockets    || [];
    this.lastActivity = new Date();
};

Channel.prototype = {
    /**
     * Get index of user.
     *
     * @param userId User SSID
     * @returns {*}
     */
    getIndexOfUserId: function(userId) {
        for (var i in this.users) {
            if (this.users[i] == userId) {
                return i;
            }
        }

        return null;
    },
    /**
     * Tets if the channel has the given user
     *
     * @param userId
     * @returns {boolean}
     */
    hasUser: function(userId) {
        if(this.getIndexOfUserId(userId) != null) {
            return true;
        }
        return false;
    },
    /**
     * Add a user SSID, equivalent to allow the user
     * to access this channel
     *
     * @param userId
     * @returns {*}
     */
    addUser: function(userId) {
        this.users.push(userId);
        this.lastActivity = new Date();
        return this;
    },
    /**
     * Get the users
     *
     * @returns {*}
     */
    getUsers: function() {
        return this.users;
    },
    /**
     * Remove the user from the channel, if he want to
     * join back, he have to log in again
     *
     * @param userId
     * @returns {*}
     */
    removeUser: function(userId) {
        var index = this.getIndexOfUserId(userId);
        if(index != null) {
            this.users.splice(index, 1);
        }
        this.lastActivity = new Date();
        return this;
    },
    /**
     *
     * @param socket
     * @returns {*}
     */
    getIndexOfSocket: function(socket) {
        for (var i in this.sockets) {
            if (this.sockets[i].id == socket.id) {
                return i;
            }
        }

        return null;
    },
    /**
     * Add a socket to the channel.
     * This socket is used to broadcast the message over the other users
     *
     * @param socket
     * @returns {*}
     */
    addSocket: function(socket) {
        this.sockets.push(socket);
        this.lastActivity = new Date();
        return this;
    },
    /**
     * Get sockets
     *
     * @returns {*}
     */
    getSockets: function() {
        return this.sockets;
    },
    /**
     * Remove a socket
     *
     * @param socket
     * @returns {*}
     */
    removeSocket: function(socket) {
        var index = this.getIndexOfSocket(socket);
        if(index != null) {
            this.sockets.splice(index, 1);
        }
        this.lastActivity = new Date();
        return this;
    },
    /**
     * Add a message to the channel
     *
     * @param message
     * @returns {*}
     */
    addMessage: function(message) {
        this.messages.push(message);

        // Remove the first elements until there are less than 10 messages left, to avoid overload
        while(this.messages.length > 100) {
            this.messages.shift();
            console.log('Purge messages, left: '+this.messages.length);
        }

        this.lastActivity = new Date();
        return this;
    },
    /**
     * Get all messages
     *
     * @returns {*}
     */
    getMessages: function() {
        return this.messages;
        this.lastActivity = new Date();
    },
    /**
     * Flush the messages
     *
     * @returns {*}
     */
    flushMessages: function() {
        this.messages = [];
        return this;
    },
    /**
     * Get the last activity
     *
     * @returns Date
     */
    getLastActivity: function() {
        return this.lastActivity;
    },
    /**
     * Test if the current channel is obsolete.
     * A channel is obsolete if there is nobody in it since a long time
     *
     * @returns {boolean}
     */
    isObsolete: function() {
        var now = new Date();
        return this.getSockets().length == 0 && now.getTime() - this.getLastActivity().getTime() > cleanerDelay*1000;
    }
}
// ================== END PROTOTYPE ===================

/**
 * Channel manager, allow manipulation of channels
 *
 * @type {{indexOf: Function, add: Function, remove: Function, get: Function, create: Function}}
 */
var channelManagement = {
    /**
     * Trouve l'index du canal
     *
     * @param channelUrl
     * @returns {*}
     */
    indexOf: function(channelUrl) {
        for (var i in channels) {
            if (channels[i].url == channelUrl) {
                return i;
            }
        }

        return null;
    },
    /**
     * Ajoute le canal
     *
     * @param channel
     * @returns {*}
     */
    add: function(channel) {
        channels.push(channel);

        return this;
    },
    /**
     * Supprime le canal
     *
     * @param channelUrl
     * @returns {*}
     */
    remove: function(channelUrl) {
        var index = this.indexOf(channelUrl);
        if(index != null) {
            channels.splice(index, 1);
        }

        return this;
    },
    /**
     * Récupère le canal
     *
     * @param channelUrl
     * @returns {*}
     */
    get: function(channelUrl) {
        var index = this.indexOf(channelUrl);
        return index != null ? channels[index] : false;
    },
    /**
     * Get all channels
     *
     * @returns {Array}
     */
    getChannels: function() {
        return channels;
    },
    /**
     * Créer le canal
     *
     * @param channelUrl
     * @param password
     * @param roomName
     * @returns {*}
     */
    create: function(channelUrl, password, roomName) {
        var index = this.indexOf(channelUrl);
        if(index == null) {
            var channel = new Channel({
                url: channelUrl,
                password: password,
                roomName: roomName,
                roomTopic: '-'
            });
            this.add(channel);
        } else {
            console.log('Tentative de création de canal '+channelUrl+', le canal existe déjà !');
        }

        return this;
    },
    /**
     * Destroy the channel if obsolete
     */
    cleaner: function() {
        for(var i in channels) {
            if(channels[i].isObsolete()) {
                console.log('Channel '+channels[i].url+' is obsolete, delete it !');
                this.remove(channels[i].url);
            }
        }
    }
};

module.exports = channelManagement;