var tchat = {
    /**
     *
     * @param message
     * @returns {boolean}
     */
    command: function(message) {
        switch(message) {
            default:
                return true;
                break;
        }
    },
    /**
     * Get formated date
     *
     * @param date
     * @returns {string}
     */
    getDate: function(date) {
        return date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear()+'&nbsp;'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    }
};

module.exports = tchat;