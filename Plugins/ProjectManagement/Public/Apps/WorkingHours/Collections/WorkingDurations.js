define([
    "underscore",
    "backbone",
    'ProjectManagement/Apps/WorkingHours/Models/WorkingDuration'
], function (_, Backbone, WorkingDuration) {
    var WorkingDurationsCollection = Backbone.Collection.extend({
        url:"/ProjectManagement/WorkingDurations",
        model:WorkingDuration
    });

    return WorkingDurationsCollection;
});