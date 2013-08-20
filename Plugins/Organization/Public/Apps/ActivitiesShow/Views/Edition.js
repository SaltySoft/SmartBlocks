define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/edition.html'
], function ($, _, Backbone, EditionTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "a_class",
        initialize: function (activity) {
            var base = this;
            base.activity = activity;
            base.model = activity;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(EditionTemplate, {
                activity: base.activity
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});