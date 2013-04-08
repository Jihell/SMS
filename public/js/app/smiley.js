(function($) {

    var smileys = [];

    App.smiley = {
        metachar: /[[\]{}()*+?.\\|^$\-,&#\s]/g,
        /**
         * Get the index of the command
         *
         * @param pattern
         * @returns {*}
         */
        indexOf: function(pattern) {
            for (var i in smileys) {
                if(smileys[i].pattern == '('+pattern.replace(this.metachar, '\\$&')+')')
                    return i;
            }

            return null;
        },
        /**
         * Add the smiley
         *
         * @param pattern
         * @param className
         * @returns {*}
         */
        add: function(pattern, className) {
            var index = this.indexOf(pattern);
            // The command pattern must not exist
            if(index == null) {
                smileys.push({
                    pattern: '('+pattern.replace(this.metachar, '\\$&')+')',
                    className: className
                })
            }
            return this;
        },
        getSmileys: function() {
            return smileys;
        },
        /**
         * Add all smileys
         */
        register: function() {
            this
                .add(';)', 'tinkle')
                .add(';-)', 'tinkle')
                .add('@_@', 'mad')
                .add(':)', 'smile')
                .add(':-)', 'smile')
                .add(':(', 'sad')
                .add(':-(', 'sad')
                .add(':#', 'shout')
                .add(':@', 'shout')
                .add(':devil:', 'devil')
                .add('O_O', 'shock')
                .add(':o', 'shock')
                .add(':shock:', 'shock')
                .add(':cry:', 'cry')
                .add('8)', 'sunglass')
                .add('8-)', 'sunglass')
                .add(':s', 'bad')
                .add(':-s', 'bad')
                .add(':d', 'happy')
                .add(':D', 'happy')
                .add(':-d', 'happy')
                .add(':-D', 'happy')
                .add(':cuir:', 'cuir')
                .add(':x', 'snip')
                .add(':-x', 'snip')
                .add(':mute:', 'mute')
                .add(':?', 'confused')
                .add(':-?', 'confused')
                .add(':hand:', 'confused')
                .add(':p', 'tong')
                .add(':-p', 'tong')
                .add(':angel:', 'angel')
                .add('<3', 'heart')
                .add(':cigar:', 'smoke')
            ;
            return this;
        }
    }

})(jQuery);