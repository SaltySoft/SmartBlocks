define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html',
    './Timeline/Timeline',
    './Review/Review',
    './Tomorrow/Views/Tomorrow',
    'jqueryui',
    'fullCalendar'
], function ($, _, Backbone, main_tpl, TimelineView, ReviewView, TomorrowView) {
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

            base.$el.find(".pure-menu-selected").removeClass('pure-menu-selected');
            if (subapp == 'timeline') {
                var subapp = new TimelineView();
                base.$el.find(".desk_subapp_container").html(subapp.$el);
                subapp.init(base.SmartBlocks);
                base.$el.find(".todaytimeline_tab_button").addClass("pure-menu-selected");
            } else if (subapp == 'review') {
                var subapp = new ReviewView();
                base.$el.find(".desk_subapp_container").html(subapp.$el);
                subapp.init(base.SmartBlocks);
                base.$el.find(".todayreview").addClass("pure-menu-selected");
            } else if (subapp == "tomorrow") {
                base.$el.find(".tomorrow_tab_button").addClass("pure-menu-selected");
                var subapp = new TomorrowView();
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