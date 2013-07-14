define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var exports = {
        getTimeString:function (time) {
            var display = "";

            var hours = time / 3600000;
            if (hours >= 1) {
                display += Math.floor(hours) + "h";
            }

            var min = (hours - Math.floor(hours)) * 60;
            if (min >= 1) {
                display += " " + (Math.floor(min) < 10 ? "0" : '') + Math.floor(min) + "m";
            }

            var sec = (min - Math.floor(min)) * 60;
            if (sec >= 1 && time < 15 * 60000) {
                display += " " + Math.floor(sec) + "s";
            }
            return display;
        },
        getDayName:function (date) {
            var days = [
                "Monday",
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ];

            return days[date.getDay()];
        },
        getMonthName:function (date) {
            var monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            return monthNames[date.getMonth()];
        }
    };

    return exports;
});