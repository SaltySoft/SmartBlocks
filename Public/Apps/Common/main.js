requirejs.config({
    baseUrl:'/',
    paths:sb_paths,
    shim:sb_shims
});

/*Fill with default apps (file sharing and chat)*/
var apps = ["underscore", "backbone", "SmartBlocks", "Apps/Chat/app", "Apps/FileSharing/app", "Apps/NotificationsCenter/app", "UserModel", "UsersCollection"];

if (app !== undefined) {
    apps.push(app);
}

$(document).ready(function () {
    requirejs(apps,
        function (/*defaults, */_, Backbone, SmartBlocks, ChatApp, FileSharingApp, NotifCenterApp, User, UsersCollection, App) {
            if ("WebSocket" in window) {
                var websocket = new WebSocket(socket_server, "muffin-protocol");
                SmartBlocks.websocket = websocket;
            }

            SmartBlocks.events = _.extend({}, Backbone.Events);
            SmartBlocks.server_handshake(websocket, user_session);
            SmartBlocks.current_session = user_session;
            if (websocket !== undefined) {
                websocket.onmessage = function (data) {
                    var message = SmartBlocks.parseWs(data);
                    SmartBlocks.events.trigger("ws_notification", message);
                };
            }
            SmartBlocks.init_solution();
            User.getCurrent(function (current_user) {
                SmartBlocks.connected_users = new UsersCollection();

                var timers = [];


                SmartBlocks.current_user = current_user;
                ChatApp.initialize(websocket);
                SmartBlocks.ChatApp = ChatApp;
                FileSharingApp.initialize(SmartBlocks);
                SmartBlocks.FileSharingApp = FileSharingApp;
                SmartBlocks.NotifCenterApp = NotifCenterApp;
                NotifCenterApp.initialize(SmartBlocks);
                if (App)
                    App.initialize(SmartBlocks);

                //Hearbeats. If I'm living, my heart beats.
                SmartBlocks.events.on("ws_notification", function (message) {
                    if (message.app == "heartbeat") {
                        SmartBlocks.connected_users.push(message.user);
                        clearTimeout(timers[message.user.id]);
                        timers[message.user.id] = setTimeout(function () {
                            SmartBlocks.connected_users.remove(message.user);
                        }, 2000);
                    }
                });
                setInterval(function () {
                    SmartBlocks.heartBeat(current_user);
                }, 1000);
            });
        });
});
