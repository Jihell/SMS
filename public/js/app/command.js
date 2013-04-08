(function($) {

    var commands = [];

    App.command = {
        /**
         * Get the index of the command
         *
         * @param pattern
         * @returns {*}
         */
        indexOf: function(pattern) {
            for (var i in commands) {
                if(commands[i].pattern == pattern)
                    return i;
            }

            return null;
        },
        /**
         * Add the command
         *
         * @param pattern
         * @param command
         * @returns {*}
         */
        add: function(pattern, command) {
            var index = this.indexOf(pattern);
            // The command pattern must not exist
            if(index == null) {
                commands.push({
                    pattern: pattern,
                    command: command
                })
            }
            return this;
        },
        /**
         * Execute the command who match the given arguments
         *
         * @param args
         * @returns {*}
         */
        execute: function(args) {
            for (var i in commands) {
                var reg = new RegExp(commands[i].pattern);
                if(reg.test(args)) {
                    var match = reg.exec(args),
                        args = typeof match[1] != 'undefined' ? match[1].trim() : null;

                    commands[i].command(args);
                    return true;
                }
            }
            return false;
        }
    };

})(jQuery);