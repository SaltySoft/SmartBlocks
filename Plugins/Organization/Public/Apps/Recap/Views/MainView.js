define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/recap_template.html',
    'Organization/Apps/Recap/Views/TodayRecap',
    'Organization/Apps/Recap/Views/NextRecap',
    'Organization/Apps/Recap/Views/PastRecap',
    'Organization/Apps/Recap/Views/Timeline',
    'Organization/Apps/Recap/Views/Now',
    'Organization/Apps/Recap/Views/NextDays',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    './DeadlinesInformation'
], function ($, _, Backbone, RecapTemplate, TodayRecapView, NextRecapView, PastRecapView, TimelineView, NowView, NextDaysView, PlannedTasksCollection, DeadlinesInformationView) {
    var MainView = Backbone.View.extend({
        tagName: 'div',
        className: 'recap_main_view',
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.planned_tasks = new PlannedTasksCollection();
            base.render();
            base.registerEvents();


        },
        render: function () {
            var base = this;
            var template = _.template(RecapTemplate, {});

            base.$el.html(template);
            base.planned_tasks.fetch({
                success: function () {
                    base.renderToday();
                }
            });

        },
        renderToday: function () {
            var base = this;

//            var today_view = new TodayRecapView();
//            base.$el.find(".today_info").html(today_view.$el);
//            today_view.init(base.SmartBlocks);

            var timeline = new TimelineView(base.planned_tasks);
            base.$el.find(".today_info").html(timeline.$el);
            timeline.init(base.SmartBlocks);

//            var next_view = new NextRecapView();
//            base.$el.find(".next_info").html(next_view.$el);
//            next_view.init(base.SmartBlocks);

            var now_view = new NowView(base.planned_tasks);
            base.$el.find(".next_info").html(now_view.$el);
            now_view.init(base.SmartBlocks);


//            var past_view = new PastRecapView();
//            base.$el.find(".past_info").html(past_view.$el);
//            past_view.init(base.SmartBlocks, base);


            var deadlines_information = new DeadlinesInformationView();
            base.$el.find(".deadlines_information").html(deadlines_information.$el);
            deadlines_information.init(base.SmartBlocks);

            var next_days = new NextDaysView();
            base.$el.find(".past_info").html(next_days.$el);
            next_days.init(base.SmartBlocks, base);


        },
        registerEvents: function () {

        }
    });

    return MainView;
});