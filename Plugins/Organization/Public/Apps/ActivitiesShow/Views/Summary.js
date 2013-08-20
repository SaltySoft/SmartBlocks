define([
    'jquery',
    '../../../../../.',
    'backbone'
], function ($, _, Backbone) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "a_class",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            //var template = _.template(SomeTemplate, {});
            //base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});