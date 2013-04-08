(function($) {
    var socket = io.connect();

    App.socket = {
        init: function() {
            // On creer l'evenement getMessages pour recuperer direcement les messages sur serveur
            socket.on('getMessages', function (messages) {
                // messages est le tableau contenant tous les messages qui ont ete ecris sur le serveur
                var tchat = $(App.config.selector.chat);
                tchat.html('');
                for (var i = 0; i < messages.length; i++)
                    tchat.append('<li><em>'+messages[i].date+'</em> - <b>'+messages[i].pseudo+'</b> : '+App.tool.decorator(messages[i].message)+'</li>');

                tchat.scrollTop(tchat[0].scrollHeight);
            });

            // display the new message when someone send it
            socket.on('getNewMessage', function (message) {
                // If don't have the focus, play a sound and change title
                App.tool.afkAlert();

                $(App.config.selector.chat)
                    .append('<li><em>'+message.date+'</em> - <b>'+message.pseudo+'</b> : '+App.tool.decorator(message.message)+'</li>')
                    .scrollTop($(App.config.selector.chat)[0].scrollHeight)
                ;
            });

            // Show the welcome message
            socket.on('welcome', function (message) {
                var date = new Date();
                $(App.config.selector.chat)
                    .append('<li class="service"><em>'+App.tool.getDate(date)+'</em> - <b>Marvin</b> : Nouvel utilisateur, nous somme actuellement '+message.nbUsers+' dans le canal.</li>')
                ;
            });

            // Update the details
            socket.on('details', function (message) {
                $(App.config.selector.roomName).html(message.roomName);
                $(App.config.selector.roomTopic).html(message.roomTopic);
            });

            // Show the goodbye message
            socket.on('goodbye', function (message) {
                var date = new Date();
                $(App.config.selector.chat)
                    .append('<li class="service"><em>'+App.tool.getDate(date)+'</em> - <b>Marvin</b> : Un utilisateur est parti, nous somme actuellement '+message.nbUsers+' dans le canal.</li>')
                ;
            });

            // Execute the given command if exist
            socket.on('command', function(message) {
                switch (message.command) {
                    case 'clear':
                        App.interact.clear();
                        break;
                    case 'topic':
                        App.interact.topic(message.topic);
                        break;
                    case 'name':
                        App.interact.name(message.name);
                        break;
                    case 'password':
                        App.interact.password(message.password);
                        break;
                    default:
                        break;
                }
            });

            socket.on('timeout', function() {
                App.interact.timeout();
            });

            // Get the messages and register the room
            socket.emit('getMessages', { uri: window.location.pathname });
        },
        /**
         * Get socket connection
         *
         * @returns {*|io.Socket}
         */
        getConnection: function() {
            return socket;
        }
    };

})(jQuery);