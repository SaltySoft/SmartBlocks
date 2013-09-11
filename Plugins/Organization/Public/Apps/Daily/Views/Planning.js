define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Daily/Templates/main_planning.html',
    'Organization/Apps/Daily/Views/DayPlanning',
    'Organization/Apps/Daily/Views/TasksList',
    'Organization/Apps/Daily/Views/PlannedList'
], function ($, _, Backbone, MainViewTemplate, DailyPlanningView, TasksListView, PlannedListView) {

    var monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
    var PlanningView = Backbone.View.extend({
        tagName: "div",
        className: "planning_view",
        initialize: function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;


            base.current_date = new Date();
            base.current_date.setHours(0);
            base.current_date.setMinutes(0);
            base.current_date.setSeconds(0);
            base.current_date.setMilliseconds(0);

            base.today = new Date(base.current_date);

            base.render();

            base.dailyPlanning = undefined;
        },
        render: function () {
            var base = this;

            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);
            base.$el.find(".datepicker").datepicker();
            base.$el.find(".datepicker").datepicker("option", "dateFormat", "yy-mm-dd");
            base.$el.find(".date").html("Today (" + monthNames[base.current_date.getMonth()] + " " +base.current_date.getDate()  + ")");




            base.registerEvents();
        },
        updateDate: function () {
            var base = this;
            if (base.current_date.getDate() == base.today.getDate() &&
                base.current_date.getMonth() == base.today.getMonth() &&
                base.current_date.getFullYear() == base.today.getFullYear()) {
                base.$el.find(".date").html("Today (" + monthNames[base.current_date.getMonth()] + " " +base.current_date.getDate()  + ")");
            } else {
                base.$el.find(".date").html( monthNames[base.current_date.getMonth()] + " " +base.current_date.getDate());
                if (base.current_date.getFullYear() != base.today.getFullYear())
                    base.$el.find(".date").append( ", " + base.current_date.getFullYear());
            }
            if (base.dailyPlanning)
                base.dailyPlanning.update_on = false;
            base.dailyPlanning = new DailyPlanningView();
            base.$el.find(".daily_planning_container").html(base.dailyPlanning.$el);
            base.dailyPlanning.init(base.SmartBlocks, base.current_date, base);

            base.tasks_list = new TasksListView();
            base.tasks_list.init(base.SmartBlocks, base);

            base.$el.find(".tasks_container").html(base.tasks_list.$el);


            base.planned_list_view = new PlannedListView();
            base.planned_list_view.init(base.SmartBlocks, base);

            base.$el.find(".planned_list_container").html(base.planned_list_view.$el);
        },
        registerEvents: function () {
            var base = this;
            base.$el.delegate(".date", "click", function () {
                base.$el.find(".datepicker").focus();
            });

            base.$el.delegate(".datepicker", "change", function () {
                var elt = $(this);
                var date = new Date(elt.val());
                base.current_date = date;
                base.updateDate();
            });

            base.$el.delegate(".prev_month_button", "click", function () {
                base.current_date.setDate(base.current_date.getDate() - 1);
                base.updateDate();
            });

            base.$el.delegate(".next_month_button", "click", function () {
                base.current_date.setDate(base.current_date.getDate() + 1);
                base.updateDate();
            });
            base.updateDate();


        }

    });

    return PlanningView;
});