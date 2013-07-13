define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_search_controls.html'
], function ($, _, Backbone, ActivitySearchControlsTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_search_controls",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;
            base.activity_types = base.parent.activity_types;

            base.render();

            base.parent.events.on("activity_types_loaded", function () {
                base.$el.find(".types_select").find(".activity_types").remove();
                for (var k in base.activity_types.models) {
                    var activity_type = base.activity_types.models[k];
                    base.$el.find(".types_select").append('<option class="activity_type" data-id="' + activity_type.get("id") + '">' + activity_type.get("name") +'</option>');
                }
            });

        },
        render: function () {
            var base = this;

            var template = _.template(ActivitySearchControlsTemplate, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});