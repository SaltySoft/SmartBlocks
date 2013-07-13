define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_item.html'
], function ($, _, Backbone, ActivityItemTemplate) {
    var View = Backbone.View.extend({
        tagName: "li",
        className: "activity_list_item",
        initialize: function (model) {
            var base = this;
            base.model = model;
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

            var template = _.template(ActivityItemTemplate, {});
            base.$el.html(template);

            base.$el.find(".name").html(base.model.get("name"));

            base.$el.css("background", base.activity.get("type").get("color"));
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate("a", "click", function () {
                base.parent.events.trigger("change_activity_preview", base.activity);
            });
        }
    });

    return View;
});