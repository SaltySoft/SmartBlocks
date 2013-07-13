define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_creation.html',
    'Organization/Apps/Common/Models/Activity'
], function ($, _, Backbone, ActivityCreationTemplate, Activity) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_creation_view_container cache",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, activity_types) {
            var base = this;
            $("body").append(base.$el);
            base.SmartBlocks = SmartBlocks;
            base.activity_types = activity_types;

            base.render();
            base.registerEvents();

        },
        render: function () {
            var base = this;

            var template = _.template(ActivityCreationTemplate, {
                types : base.activity_types.models
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
            base.$el.delegate(".create_button", "click", function () {
                var form = base.$el.find("form");
                var data = form.serializeArray();
                var activity_array = {};
                for (var k in data) {
                    activity_array[data[k].name] = data[k].value;
                }
                var activity = new Activity(activity_array);
                activity.save({}, {
                    success: function () {
                        base.SmartBlocks.events.trigger("org_new_activity", activity);

                    }
                });
                base.$el.remove();
            });
            base.$el.delegate(".cancel_button", "click", function () {
                base.$el.remove();
                return false;
            });
        }
    });

    return View;
});