var uuid = require('node-uuid'),
    os = require('os')
;

var cookie = {
    /**
     * Parse the cookies headers
     *
     * @param request
     * @returns {*}
     */
    parse: function(request) {
        var cookies = {};
        request.headers.cookie && request.headers.cookie.split(';').forEach( function( cookie ) {
            var parts = cookie.split('='),
                name = parts[0].trim(),
                value = (parts[1] || '').trim();
            cookies[name] = value;
        });

        return {
            /**
             * Parsed cookies
             */
            data: cookies,
            /**
             * Get the cookie value
             *
             * @param name
             * @returns string
             */
            get: function(name) {
                for(var i in this.data) {
                    if(i == name) {
                        return this.data[i];
                    }
                }
                return null;
            },
            /**
             * Create a new cookie
             *
             * @returns {string}
             */
            create: function(name, value) {
                this.data[name] = value;
                return name+'='+value;
            },
            /**
             * Create a new cookie
             *
             * @returns {string}
             */
            createSSID: function() {
                var randomId = uuid.v4();
                this.data['_NODESSID'] = randomId;
                console.log('Create new _NODESSID '+randomId);
                return randomId;
            },
            /**
             * Get the SSID
             *
             * @returns string|false
             */
            getSSID: function() {
                var ssid = this.get('_NODESSID');
                if(ssid != null) {
                    return ssid;
                }
                return false;
            },
            /**
             * Set the cookies
             *
             * @param name
             * @param value
             * @returns {*}
             */
            set: function(name, value) {
                if(this.get(name) != null) {
                    this.data[name] = value.trim();
                } else {
                    this.create(name, value)
                }

                return this;
            },
            /**
             * Export cookies for header send
             *
             * @returns {string}
             */
            export: function() {
                var send = '';
                for(var i in this.data) {
                    send += i+'='+this.data[i]+'; Path=/;';
                }
                return send.substring(0, send.length - 1);
            }
        };
    }
};

module.exports = cookie;