define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Views/MainView'
], function ($, _, Backbone, MainView) {
    var initialize = function (SmartBlocks) {

        var TasksController = {
            main_view: null,
            setContent: function (element) {
                $("#app_container").html(element);
            },
            Launch: function () {
                TasksController.main_view = new MainView(SmartBlocks);
                TasksController.setContent(TasksController.main_view.$el)
            }
        };

        TasksController.Launch();
    };

    return {
        init: initialize
    };
});