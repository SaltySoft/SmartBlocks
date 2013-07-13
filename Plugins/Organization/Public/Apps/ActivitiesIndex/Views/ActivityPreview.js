define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_preview.html',
    'Organization/Apps/Common/Views/TasksList'
], function ($, _, Backbone, ActivityPreviewTemplate, TasksListView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_preview",
        initialize: function (model) {
            var base = this;
            base.activity = model;
        },
        init: function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            if (!base.activity) {
                base.$el.addClass("empty");
            } else {
                var template = _.template(ActivityPreviewTemplate, {
                    activity: base.activity
                });
                base.$el.html(template);
                console.log("LIST", base.activity.get("tasks"));
                var tasks_list = new TasksListView(base.activity.get("tasks"));
                base.$el.find(".tasks_list_container").html(tasks_list.$el);
                tasks_list.init(base.SmartBlocks);
            }
        },
        registerEvents: function () {
            var base = this;
            base.parent.events.on("change_activity_preview", function (activity) {
                base.activity = activity;
                base.render();
            });
        }
    });

    return View;
});