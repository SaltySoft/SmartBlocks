define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html'
], function ($, _, Backbone, MainViewTemplate) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"settings_view",
        initialize:function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
        },
        render:function () {
            var base = this;

            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;
        }
    });

    return View;
});