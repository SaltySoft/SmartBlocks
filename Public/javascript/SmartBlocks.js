define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryui'
], function ($, _, Backbone) {

    var func_set = {
        loadings: [],
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
        },
        startLoading: function (message) {
            var base = this;
            $("#loader").html('<img src="/images/loader.gif" />');

            if (message) {
                $("#loader").append(" <span>" + message + "</span>");
                base.loadings.push({
                    message: message
                });
                return base.loadings.length - 1;
            } else {
                $("#loader").append("<span>Loading</span>");
                base.loadings.push({
                    message: "Loading"
                });
                return base.loadings.length - 1;
            }
            $("#loader").show();
        },
        stopLoading: function (index) {
            $("#loader").hide();
        }
    };

    return func_set;
});