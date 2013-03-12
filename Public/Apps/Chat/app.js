define([
    'jquery',
    'underscore',
    'backbone',
    'SmartBlocks',
    'Chat/router'
], function ($, _, Backbone, SmartBlocks, Router) {
    var initialize = function () {
        var websocket = new WebSocket(socket_server, "muffin-protocol");
        SmartBlocks.server_handshake(websocket, user_session);
        Router.initialize(websocket);

    };
    return {
        initialize:initialize
    };
});