(function($) {

    App.audio = {
        sound: false,
        play: function() {
            if(!this.sound) {
                this.sound = $(App.config.selector.audio).get(0);
            }

            try {
                if(App.config.sound) {
                    App.audio.sound.load();
                    App.audio.sound.play();
                }
            } catch (e) {
                if(window.console && console.error('Catch ! '+e));
            }
        }
    }

})(jQuery);