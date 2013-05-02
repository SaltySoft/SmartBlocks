requirejs.config({
    baseUrl:'/',
    paths:sb_paths,
    shim:sb_shims
});

/*Fill with default apps (file sharing and chat)*/
var apps = ["underscore", "backbone", "SmartBlocks", "Apps/Chat/app", "Apps/FileSharing/app", "UserModel"];

if (app !== undefined) {
    apps.push(app);
}


requirejs(apps,
    function (/*defaults, */_, Backbone, SmartBlocks, ChatApp, FileSharingApp, User,  App) {
        if ("WebSocket" in window) {
            var websocket = new WebSocket(socket_server, "muffin-protocol");
            SmartBlocks.websocket = websocket;
        }

        SmartBlocks.events = _.extend({}, Backbone.Events);
        SmartBlocks.server_handshake(websocket, user_session);
        SmartBlocks.current_session = user_session;
        if (websocket !== undefined) {
            websocket.onmessage = function(data) {
                var message = SmartBlocks.parseWs(data);
                SmartBlocks.events.trigger("ws_notification", message);
            };
        }
        User.getCurrent(function (current_user) {
            SmartBlocks.current_user = current_user;
            ChatApp.initialize(websocket);
            SmartBlocks.ChatApp = ChatApp;
            FileSharingApp.initialize(SmartBlocks);
            SmartBlocks.FileSharingApp = FileSharingApp;
            if (App)
                App.initialize(SmartBlocks);
        });

    });