(function($) {

    App.interact = {
        /**
         * Clear chat history
         */
        clear: function() {
            $(App.config.selector.chat)
                .html('<li class="service"><em>'+App.tool.getDate(new Date())+'</em> - <b>Marvin</b> : Clear.</li>')
            ;
            App.unread = 0;
            document.title = App.config.title;
        },
        /**
         * Change chat room topic
         *
         * @param args
         */
        topic: function(args) {
            // If don't have the focus, play a sound and change title
            App.tool.afkAlert();
            $(App.config.selector.roomTopic).html(args);
            $(App.config.selector.chat)
                .append('<li class="service"><em>'+App.tool.getDate(new Date())+'</em> - <b>Marvin</b> : Topic changed to "'+args+'".</li>')
            ;
        },
        /**
         * Change chat room name
         *
         * @param args
         */
        name: function(args) {
            // If don't have the focus, play a sound and change title
            App.tool.afkAlert();
            $(App.config.selector.roomName).html(args);
            $(App.config.selector.chat)
                .append('<li class="service"><em>'+App.tool.getDate(new Date())+'</em> - <b>Marvin</b> : Name changed to "'+args+'".</li>')
            ;
        },
        /**
         * Change chat room password
         *
         * @param args
         */
        password: function(args) {
            // If don't have the focus, play a sound and change title
            App.tool.afkAlert();
            $(App.config.selector.chat)
                .append('<li class="service"><em>'+App.tool.getDate(new Date())+'</em> - <b>Marvin</b> : Password changed to "'+args+'", you should clear the channel messages.</li>')
            ;
        },
        /**
         * Change chat room password
         *
         * @param args
         */
        sound: function(args) {
            App.config.sound = (args == 'on');

            $(App.config.selector.chat)
                .append('<li class="service"><em>'+App.tool.getDate(new Date())+'</em> - <b>Marvin</b> : sound "'+(App.config.sound ? 'On' : 'Off')+'".</li>')
            ;
        },
        /**
         * Throw a timeout error and reload the page
         */
        timeout: function() {
            $(App.config.selector.chat)
                .append('<li class="service"><em>'+App.tool.getDate(new Date())+'</em> - <b>Marvin</b> : timeout error !.</li>')
            ;

            alert('Timeout !');
            location.reload();
        }
    }

})(jQuery);