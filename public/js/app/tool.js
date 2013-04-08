(function($) {

    App.tool = {
        /**
         * Get formated date
         *
         * @param date
         * @returns {string}
         */
        getDate: function(date) {
            return date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear()+'&nbsp;'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        },
        /**
         * Decorate text with link / smiley etc ...
         *
         * @param text
         * @return string
         */
        decorator: function(text) {
            var replacePattern1, replacePattern2, replacePattern3;

            // Escape special chars
            text = $('<span></span>').text(text).html();

            //URLs starting with http://, https://, or ftp://
            replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            text = text.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
            replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            text = text.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

            //Change email addresses to mailto:: links.
            replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
            text = text.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

            var smileys = App.smiley.getSmileys();
            for(var i in smileys) {
                var pattern = new RegExp(smileys[i].pattern, 'gim');
                text = text.replace(pattern, '<span class="smiley '+smileys[i].className+'"></span>')
            }

            return text;
        },
        /**
         * Play a sound when not focused
         */
        afkAlert: function() {
            if (!$(App.config.selector.message).is(":focus")) {
                App.unread++;
                document.title = App.config.title+' ('+App.unread+')';

                // Play sound
                App.audio.play();

                // Show hiddenOverlay
                $(App.config.selector.hiddenOverlay).show();
            }
        }
    }

})(jQuery);