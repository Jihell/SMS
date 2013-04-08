var exps = {
    uri: RegExp(/^\/[^.]*$/i)
};

var validator = {
    /**
     * Validate the createChannel form
     *
     * @param post
     * @returns {*}
     */
    createChannel: function(post) {
        valid = true;

        if (!post.url.match(exps.uri)) {
            valid = false;
        }
        if(post.password.length == 0) {
            valid = false;
        }
        if(post.roomName.length == 0) {
            valid = false;
        }

        return valid;
    }
}

module.exports = validator;