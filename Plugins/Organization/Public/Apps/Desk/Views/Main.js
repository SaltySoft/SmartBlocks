define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html',
    './Timeline/Timeline',
    './Review/Review',
    'jqueryui',
    'fullCalendar'
], function ($, _, Backbone, main_tpl, TimelineView, ReviewView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "desk_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(main_tpl, {});
            base.$el.html(template);
        },
        setSubapp: function (subapp) {
            var base = this;

            if (subapp == 'timeline') {
                var subapp = new TimelineView();
                base.$el.find(".desk_subapp_container").html(subapp.$el);
                subapp.init(base.SmartBlocks);
            } else if (subapp == 'review') {
                var subapp = new ReviewView();
                base.$el.find(".desk_subapp_container").html(subapp.$el);
                subapp.init(base.SmartBlocks);
            }

        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});