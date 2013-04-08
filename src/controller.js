var channelMgm = require("./channelManagement");
var cookie = require('../app/cookie');
var fs = require('fs');
var qs = require('querystring');
var validator = require('./validator');

/**
 * App controller
 *
 * @type {{home: Function, createChannel: Function, chat: Function, render: Function}}
 */
var controller = {
    /**
     * The user is connected, serve the chat
     *
     * @param request
     * @param response
     */
    home: function(request, response) {
        console.log('Controller: Home');
        fs.readFile('./home.html', 'utf-8', function(error, content) {
            if (error) {
                response.writeHead(500);
                response.end();
            } else {
                response.writeHead(200, {
                    'Set-Cookie': request.cookies.export(),
                    'Content-Type': 'text/html'
                });
                response.end(content, 'utf-8');
            }
        });
    },
    /**
     * Create the channel
     *
     * @param request
     * @param response
     */
    createChannel: function(request, response) {
        console.log('Controller: Create channel');
        var cookies = request.cookies;

        // Check that method is allowed
        if(request.method != 'POST') {
            response.writeHead(405);
            response.end();
        }

        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function() {
            console.log('Controller: data received');
            var post = qs.parse(body),
                ssid = cookies.getSSID();

            post.url = '/chat/'+post.url;

            // If the form is valid, create the new channel and give a connection ticket to the user
            if(validator.createChannel(post)) {
                // Check if the channel exist
                var channel = channelMgm.get(post.url);
                // If it exist, check the password
                if(channel) {
                    console.log('Channel '+post.url+' already exist !');
                    // If password is correct, create ticket and redirect to channel
                    if(post.password == channel.password) {
                        // Add the user in the room
                        console.log('Add connection ticket to user '+ssid+' for the channel '+post.url);
                        channelMgm.get(post.url).addUser(ssid);
                    } else {
                        console.log('Password invalid !');
                    }

                    // Redirect to channel
                    response.writeHead(302, {
                        'Set-Cookie': cookies.export(),
                        'Location': post.url
                    });
                    response.end();
                // It doesn't exist, create it
                } else {
                    console.log('Controller: new channel on '+post.url);
                    // Create the channel
                    channelMgm.create(
                        post.url,
                        post.password,
                        post.roomName
                    );

                    // Add the user in the room
                    console.log('Add connection ticket to user '+ssid+' for the channel '+post.url);
                    channelMgm.get(post.url).addUser(ssid);

                    // Render response
                    response.writeHead(302, {
                        'Set-Cookie': cookies.export(),
                        'Location': post.url
                    });
                    response.end();
                }
            // If the form is not valid, redirect to the home page
            } else {
                response.writeHead(302, {
                    'Set-Cookie': cookies.export(),
                    'Location': '/'
                });
                response.end();
            }
        });
    },
    /**
     * Show the chat or the login form
     *
     * @param request
     * @param response
     */
    chat: function(request, response) {
        console.log('Controller: Chat');

        var template = './login.html',
            cookies = request.cookies,
            ssid = cookies.getSSID(),
            channel = channelMgm.get(request.url);

        // Check if the user have a connection ticket
        if(request.method != 'POST') {
            console.log('Search for channel "'+request.url+'"');
            // Check if the user is logged on this channel
            if (ssid) {
                console.log('Test if this user "'+ssid+'" is in the channel');
                if (channel && channel.hasUser(ssid)) {
                    template = './chat.html';
                }
                if(!channel) {
                    console.log('Channel doesn\'t exist !');
                }
            }
            // Display
            controller.render(template, request, response);
        } else {
            // Channel doesn't exist, so we render a login page, so nobody know that the channel doesn't exist
            if (!channel) {
                console.log('Channel doesn\'t exist, show the login form');
                controller.render(template, request, response);
            // Else check
            } else {
                console.log('Check channel password');

                // If the user have a connection ticket, return to the GET method handler (this situation should not happens)
                if (channel.hasUser(ssid)) {
                    // Render response
                    response.writeHead(302, {
                        'Set-Cookie': cookies.export(),
                        'Location': request.url
                    });
                    response.end();
                // Else check the password
                } else {
                    // Handle post data
                    var body = '';
                    request.on('data', function (data) {
                        body += data;
                    });
                    request.on('end', function(){
                        // Parse the post data
                        var post = qs.parse(body);

                        // If the password match, add the user to the channel list
                        if (post.password == channel.password) {
                            console.log('Password OK ! Display chat and give a socket ticket');
                            // Add to channel's user list
                            channel.addUser(ssid);

                            template = './chat.html';
                            controller.render(template, request, response);
                        } else {
                            // On renvoi sur le login
                            console.log('Wrong password ! back to login form');
                            controller.render(template, request, response);
                        }
                    });
                }
            }
        }
    },
    /**
     * Display given template if exist, else render 500 error
     *
     * @param template
     * @param request
     * @param response
     */
    render: function(template, request, response) {
        console.log('Display template '+template);
        fs.readFile(template, 'utf-8', function(error, content) {
            if (error) {
                response.writeHead(500);
                response.end();
            } else {
                response.writeHead(200, {
                    'Set-Cookie': request.cookies.export(),
                    'Content-Type': 'text/html'
                });
                response.end(content, 'utf-8');
            }
        });
    }
};

module.exports = controller;