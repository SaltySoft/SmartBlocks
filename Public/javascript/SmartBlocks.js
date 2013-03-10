define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryui'
], function ($, _, Backbone) {

    var func_set = {
        timer:0,
        show_message:function (message) {
            clearTimeout(this.timer);
            $("#flash_message").html(message);
            $("#flash_shower").fadeIn(300);
            this.timer = setTimeout(function () {
                $("#flash_shower").fadeOut(300)
            }, 3000)
        },
        server_handshake:function (websocket, identification) {
            websocket.addEventListener("open", function (event) {
                data_array = {};
                data_array.identification = identification;
                websocket.send(JSON.stringify(data_array));
            });
        },
        parseWs:function (message) {
            return JSON.parse(JSON.parse(message.data));
        }
    };

    return func_set;
});