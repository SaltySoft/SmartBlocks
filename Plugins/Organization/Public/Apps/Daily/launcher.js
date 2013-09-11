define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Views/MainView'
], function ($, _, Backbone, MainView) {
    var initialize = function (SmartBlocks) {

        var PlanningsController = {
            main_view: null,
            setContent: function (element) {
                $("#app_container").html(element);
            },
            Launch: function () {
                PlanningsController.main_view = new MainView(SmartBlocks);
                PlanningsController.setContent(PlanningsController.main_view.$el)
            }
        };

        PlanningsController.Launch();
    };

    return {
        init: initialize
    };
});