var routes = [];

/**
 * Simple route container
 *
 * @type {{indexOf: Function, add: Function, get: Function, match: Function}}
 */
var router = {
    /**
     * Get the route which have the given address index
     *
     * @param address string
     * @returns integer|null
     */
    indexOf: function(address) {
        for (var i in routes) {
            if(routes[i].address == address)
                return i;
        }

        return null;
    },
    /**
     * Add a route
     *
     * @param address string
     * @param controller function()
     * @returns {*}
     */
    add: function(address, controller) {
        var index = this.indexOf(address);
        // The route must not exist
        if (index == null) {
            routes.push({
                address: address,
                controller: controller
            });
        }
        return this;
    },
    /**
     * Get the route which have the given address
     *
     * @param address
     * @returns {*}
     */
    get: function(address) {
        var index = this.indexOf(address);
        if (index != null) {
            return routes[index];
        }
        return false;
    },
    /**
     * Test if the given path match one of the route pattern
     *
     * @param path
     * @returns {*}
     */
    match: function(path) {
        for (var i in routes) {
            var reg = new RegExp(routes[i].address);
            if(reg.test(path)) {
                return routes[i];
            }
        }
        return false;
    }
};

module.exports = router;