define([
    'jquery',
    'underscore',
    'backbone',
    'ProjectManagement/Apps/WorkingHours/Models/Project',
    'text!ProjectManagement/Apps/WorkingHours/Templates/working_time.html',
    'ProjectManagement/Apps/WorkingHours/Collections/Projects'
], function ($, _, Backbone, Project, WorkingTimeTemplate, ProjectsCollection) {
    var WorkingTime = Backbone.View.extend({
        tagName:"div",
        className:"pm_workingHours_working_time",
        initialize:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
        },
        init:function () {
            var base = this;

            //Init templates
            var workingTimeTemplate = _.template(WorkingTimeTemplate, {});
            base.$el.html(workingTimeTemplate);

            //Init notes collections
            base.projects_collection = new ProjectsCollection();

            base.render();
        },
        render:function () {
            var base = this;
            base.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;
        }
    });
    return WorkingTime;
});