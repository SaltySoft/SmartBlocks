requirejs.config({
    baseUrl:'/Apps',
    paths:sb_paths,
    shim:sb_shims
});

/*Fill with default apps (file sharing and chat)*/
var apps = ["underscore", "backbone", "SmartBlocks", "Chat/app"];

if (app !== undefined) {
    apps.push(app);
}


requirejs(apps,
    function (/*defaults, */_, Backbone, SmartBlocks, ChatApp, App) {
        var websocket = new WebSocket(socket_server, "muffin-protocol");
        SmartBlocks.events = _.extend({}, Backbone.Events);
        SmartBlocks.server_handshake(websocket, user_session);
        websocket.onmessage = function(data) {
            var message = SmartBlocks.parseWs(data);
            SmartBlocks.events.trigger("ws_notification", message);
        };
        ChatApp.initialize(websocket);
        if (App)
            App.initialize();
    });