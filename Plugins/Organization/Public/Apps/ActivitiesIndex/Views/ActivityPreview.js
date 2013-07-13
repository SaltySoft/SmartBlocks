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
            var template = _.template(ActivityPreviewTemplate, {
                activity: base.activity
            });
            base.$el.html(template);
            if (!base.activity) {
                base.$el.addClass("empty");
            } else {
                base.$el.removeClass("empty");
                var tasks_list = new TasksListView(base.activity.get("tasks"));
                base.$el.find(".tasks_list_container").html(tasks_list.$el);
                tasks_list.init(base.SmartBlocks);

                if (base.activity.get("archived")) {
                    base.$el.addClass("archived");
                } else {
                    base.$el.removeClass("archived");
                }
            }

        },
        registerEvents: function () {
            var base = this;
            base.parent.events.on("change_activity_preview", function (activity) {
                base.activity = activity;
                base.render();
            });

            base.$el.delegate(".archive_button", "click", function () {
                base.activity.set("archived", !base.activity.get("archived"));
                base.activity.save({}, {
                    success: function () {

                        if (base.activity.get("archived")) {
                            base.$el.addClass("archived");
                            base.SmartBlocks.show_message("Activity archived");
                        } else {
                            base.$el.removeClass("archived");
                            base.SmartBlocks.show_message("Activity unarchived");
                        }
                    }
                });
            });

            base.$el.delegate(".deletion_button", "click", function () {
                if (confirm("Are you sure you want to delete this activity ?")) {
                    base.activity.destroy({
                        success: function () {
                            base.$el.addClass("empty");
                            base.parent.events.trigger("loaded_activities");
                        },
                        error: function () {

                        }
                    });
                }

            });
        }
    });

    return View;
});