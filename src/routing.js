var controller = require("./controller"),
    router = require("../app/router"),
    cookie = require('../app/cookie'),
    path = require('path'),
    fs = require('fs'),
    mime = require('mime')
;

/**
 Register all routes regex with matching controller
 */
router.add('^/$', controller.home);
router.add('^/createChannel$', controller.createChannel);
router.add('^/chat/(.*?)$', controller.chat);

/**
 * Routing management
 *
 * @type {{execute: Function, static: Function}}
 */
var routing = {
    /**
     * Search and execute controller.
     * If a static file exist matching the given url, return it
     * If no static file and no route match, return a 404
     *
     * @param request
     * @param response
     */
    execute: function(request, response) {
        var filePath = './public' + request.url,
            self = this;

        path.exists(filePath, function(exists) {
            if(exists && request.url != '/') {
                return self.static(request, response);
            } else {
                var route = router.match(request.url);
                if(route) {
                    request.cookies = cookie.parse(request);
                    // Create session if doens't exist
                    if(!request.cookies.getSSID()) {
                        request.cookies.createSSID();
                    }

                    // Call the controller
                    console.log('Route to controller for path "'+request.url+'"');
                    route.controller(request, response);
                } else {
                    console.log('ERROR 404: File "'+filePath+'" not found');
                    response.writeHead(404);
                    response.end();
                }
            }
        });
        return;
    },
    /**
     * Service de fichier statique
     *
     * @param request
     * @param response
     */
    static: function(request, response) {
        var filePath = './public' + request.url;
        fs.readFile(filePath, 'utf-8', function(error, content) {
            if (error) {
                response.writeHead(500);
                response.end();
            } else {
                response.writeHead(200, {
                    'Server': 'node',
                    'Content-Type': mime.lookup(filePath)
                });
                fileStream = fs.createReadStream(filePath);
                fileStream.on('data', function (data) {
                    response.write(data);
                });
                fileStream.on('end', function() {
                    response.end();
                });
                return;
            }
        });
    }
}

module.exports = routing;