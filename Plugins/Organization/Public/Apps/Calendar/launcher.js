define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Calendar/Views/MainView'
], function ($, _, Backbone, MainView) {
    var initialize = function (SmartBlocks) {

        var CalendarsController = {
            main_view: null,
            setContent: function (element) {
                $("#app_container").html(element);
            },
            Launch: function () {
                CalendarsController.main_view = new MainView(SmartBlocks);
                CalendarsController.setContent(CalendarsController.main_view.$el)

            }
        };

        CalendarsController.Launch();
    };

    return {
        init: initialize
    };
});