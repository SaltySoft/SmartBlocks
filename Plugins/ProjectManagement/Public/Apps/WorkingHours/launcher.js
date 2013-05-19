define([
    'jquery',
    'underscore',
    'backbone',
    'ProjectManagement/Apps/WorkingHours/Views/WorkingTime'
], function ($, _, Backbone, WorkingTimeView) {

    var initialize = function (SmartBlocks) {
        var workingTime = new WorkingTimeView(SmartBlocks);
        WorkingTimeView.init();

        $("#app_container").html(workingTime.$el);

        Backbone.history.start();
    };

    return {
        initialize:initialize
    };
});