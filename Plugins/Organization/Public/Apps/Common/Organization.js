define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var exports = {
        getTimeString: function (time) {
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
        getFullTimeString: function (time) {
            var display = "";

            var milliseconds = time;

            var days = milliseconds / ( 24 * 3600 * 1000);
            if (days >= 1) {
                display += Math.floor(days) + "d ";
            }

            var hours = (days - Math.floor(days)) * 24;
            if (hours >= 1 && days <= 3)
                display += Math.floor(hours) + "h ";

            var minutes = (hours - Math.floor(hours)) * 60;
            if (milliseconds < 1000 * 3600 * 24 && milliseconds > 60000)
                display += Math.floor(minutes) + "m ";

            var seconds = (minutes - Math.floor(minutes)) * 60;
            if (milliseconds < 1000 * 3600 * 0.5 && milliseconds < 60000) {
                display += Math.floor(seconds) + "s ";
            }

            return display;
        },
        getDayName: function (date) {
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
        getMonthName: function (date) {
            var monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            return monthNames[date.getMonth()];
        }
    };

    return exports;
});