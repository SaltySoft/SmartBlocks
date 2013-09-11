define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_list.html',
    './ActivityItem',
    'Organization/Apps/Common/Views/ActivityCreationView'
], function ($, _, Backbone, ActivityListTemplate, ActivityItem, ActivityCreationView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_list",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;
            base.activities = base.parent.activities;


            base.render();
            base.registerEvents();

        },
        render: function () {
            var base = this;

            var template = _.template(ActivityListTemplate, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.parent.events.on("loaded_activities", function () {
                base.$el.find(".activities_list").find(".activity_list_item").remove();
                for (var k in base.activities.models) {
                    var activity = base.activities.models[k];
                    var activity_item_view = new ActivityItem(activity);
                    base.$el.find(".activities_list").append(activity_item_view.$el);
                    activity_item_view.init(base.SmartBlocks, base.parent);
                }
            });

            base.$el.delegate(".activity_creation_button", "click", function () {
                var activity_creation_view = new ActivityCreationView();
                activity_creation_view.init(base.SmartBlocks, base.parent.activity_types);
            });
        }
    });

    return View;
});