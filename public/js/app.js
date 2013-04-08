(function($) {
    var App = {
        unread: 0,
        socket: {},
        command: {},
        interact: {},
        action: {},
        config: {},
        tool: {},
        audio: {},
        smiley: {},
        // Send the current page location
        init: function() {
            var self = this;

            // Register socket events
            this.socket.init();

            // Register commands
            this.command
                .add('^/clear$', function(args) {
                    self.interact.clear();
                    // Broadcast to other users
                    self.socket.getConnection().emit('command', { 'command' : 'clear' });
                })
                .add('^/topic ([^.]{1,})', function(args) {
                    self.interact.topic(args);
                    // Broadcast to other users
                    self.socket.getConnection().emit('command', { 'command' : 'topic', topic: args });
                })
                .add('^/name ([^.]{1,})', function(args) {
                    self.interact.name(args);
                    // Broadcast to other users
                    self.socket.getConnection().emit('command', { 'command' : 'name', name: args });
                })
                .add('^/password ([^.]{1,})', function(args) {
                    self.interact.password(args);
                    // Broadcast to other users
                    self.socket.getConnection().emit('command', { 'command' : 'password', password: args });
                })
                .add('^/sound ([^.]{1,})', function(args) {
                    self.interact.sound(args);
                    // Broadcast to other users
                })
            ;

            // Send the message
            $(App.config.selector.form).on('submit', function(e) {
                e.preventDefault();
                return App.action.sendMsg();
            });

            // Hide the hidden overlay and give the focus on the message box
            $(App.config.selector.hiddenOverlay).on('click', function() {
                $(this).hide();
                $(App.config.selector.message).focus();
                document.title = App.config.title;
                // Reset
                App.unread = 0;
            });

            this.smiley.register();
        }
    };

    // Export
    window.App = App;

})(jQuery);

// Init on DOM ready
$(function() {
    App.init();
});