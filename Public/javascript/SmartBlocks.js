define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryui'
], function ($, _, Backbone) {

    var func_set = {
        loadings: [],
        timer: 0,
        title_timer: 0,
        notif_sound: new Audio("/sounds/notif.wav"),
        show_message: function (message) {
            clearTimeout(this.timer);
            $("#flash_message").html(message);
            $("#flash_shower").fadeIn(300);
            this.timer = setTimeout(function () {
                $("#flash_shower").fadeOut(300)
            }, 3000)
        },
        server_handshake: function (websocket, identification) {
            if (websocket !== undefined) {
                websocket.addEventListener("open", function (event) {
                    data_array = {};
                    data_array.identification = identification;
                    websocket.send(JSON.stringify(data_array));
                });
            }

        },
        parseWs: function (message) {
            return JSON.parse(JSON.parse(message.data));
        },
        startLoading: function (message) {
            var base = this;
            $("#loader").html('<img src="/images/loader.gif" />');
            $("#loader").show();
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

        },
        stopLoading: function (index) {
            $("#loader").hide();
        },
        notifySound: function () {
            var base = this;
            base.notif_sound.play();
        },
        animateTitle: function (message) {
            var base = this;
            clearInterval(base.title_timer);
            var m = message + " - ";
            base.title_timer = setInterval(function () {
                $(document).attr('title', m);
                m = m.substring(1) + m[0];
            }, 100);
        },
        setTitle: function (title) {
            var base = this;
            clearInterval(base.title_timer);
            $(document).attr('title', title);
        },
        chatNotif: function (user_id) {
            $.ajax({
                url: "/Discussions",
                data: {
                    user_id: user_id
                },
                success: function (data, status) {
                    var  number = 0;
                    for (var d in data) {
                        if (data[d].notify) {
                            number++;
                        }
                    }

                    if (number <= 0) {
                        $("#chat_notif").html(0);
                        $("#chat_notif").hide();
                    } else {
                        $("#chat_notif").html(number);
                        $("#chat_notif").show();
                    }
                }
            });

        }
    };

    return func_set;
});