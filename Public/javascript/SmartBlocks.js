define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryui'
], function ($, _, Backbone) {

    var func_set = {
        timer: 0,
        show_message: function (message) {
            clearTimeout(this.timer);
            $("#flash_message").html(message);
            $("#flash_shower").fadeIn(300);
            this.timer = setTimeout(function () {
                $("#flash_shower").fadeOut(300)
            }, 3000)
        }
    };
    return func_set;
});