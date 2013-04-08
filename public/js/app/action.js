(function($) {

    App.action = {
        /**
         * Send the message through the socket
         *
         * @returns false
         */
        sendMsg: function() {
            // Retrieve message informations
            var message = $(App.config.selector.message).val(),
                pseudo = $(App.config.selector.pseudo).val(),
                date = new Date();

            if(message == '' || pseudo == '') {
                alert('vous devez poster un message non vide, ainsi que votre peusdonyme');
                return false;
            }

            // If it's a registred command, execute it, else send the message
            if(!App.command.execute(message)) {
                // Show the message in the chat room
                $('#tchat')
                    .append('<li><em>'+App.tool.getDate(date)+'</em> - <b>'+pseudo+'</b> : '+App.tool.decorator(message)+'</li>')
                    .scrollTop($(App.config.selector.chat)[0].scrollHeight)
                ;

                // Register message in channel on server, en brodcast it to other users
                App.socket.getConnection().emit('newMessage', { 'pseudo' : pseudo, 'message' : message });
            }

            // Flush form
            $('#message').val('');

            // Return false to don't follow the default form event
            return false;
        }
    };

})(jQuery);