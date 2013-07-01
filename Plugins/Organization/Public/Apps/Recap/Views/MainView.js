define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/recap_template.html',
    'Organization/Apps/Recap/Views/TodayRecap',
    'Organization/Apps/Recap/Views/NextRecap',
    'Organization/Apps/Recap/Views/PastRecap'
], function ($, _, Backbone, RecapTemplate, TodayRecapView, NextRecapView, PastRecapView) {
    var MainView = Backbone.View.extend({
        tagName: 'div',
        className: 'recap_main_view',
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var template = _.template(RecapTemplate, {});

            base.$el.html(template);


            base.renderToday();
        },
        renderToday: function () {
            var base = this;

            var today_view = new TodayRecapView();
            base.$el.find(".today_info").html(today_view.$el);
            today_view.init(base.SmartBlocks);

            var next_view = new NextRecapView();
            base.$el.find(".next_info").html(next_view.$el);
            next_view.init(base.SmartBlocks);


            var past_view = new PastRecapView();
            base.$el.find(".past_info").html(past_view.$el);
            past_view.init(base.SmartBlocks);

        },
        registerEvents: function () {

        }
    });

    return MainView;
});