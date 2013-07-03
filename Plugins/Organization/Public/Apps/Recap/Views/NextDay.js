define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Recap/Templates/next_day.html',
    'Organization/Apps/Common/Organization',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'Organization/Apps/Daily/Views/TaskItem',
    'Organization/Apps/Daily/Views/PlannedListItem'
], function ($, _, Backbone, NextDayTemplate, Organization, DeadlinesCollection, PlannedTasksCollection, TaskItem, PlannedListItem) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "next_day_view",
        initialize: function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        states: {
            normal: 0,
            expanded: 1
        },
        init: function (SmartBlocks, date, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.date = date;
            base.parent = parent;
            base.deadlines = new DeadlinesCollection();
            base.planned_tasks = new PlannedTasksCollection();
            base.current_state = base.states.normal

            base.planned_tasks.fetch({
                data: {
                    date: base.date.getTime()
                },
                success: function () {
                    base.events.trigger("loaded_resource");
                }
            });

            base.deadlines.fetch({
                data: {
                    date: base.date.getTime() / 1000
                },
                success: function () {
                    base.events.trigger("loaded_resource");
                }
            });
            var r_counter = 0;
            base.events.on("loaded_resource", function () {
                r_counter++;
                if (r_counter == 2) {
                    base.update();
                }


            });

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(NextDayTemplate, {});
            base.$el.html(template);

            var dayname = Organization.getDayName(base.date);

            var now = new Date();
            var diff = base.date.getTime() - now.getTime();
            diff /= 24 * 3600000;
            if (diff < 0) {
                dayname = "Today";
            } else if (diff < 1) {
                dayname = "Tomorrow";
            }

            base.$el.find(".day_name").html(dayname);
            base.$el.find(".day_nb").html(" (" + ( base.date.getDate() < 10 ? '0' : '') +
                base.date.getDate() + "/" + ( base.date.getMonth() < 10 ? '0' : '') +
                base.date.getMonth() + "/" + '<span class="year">' + base.date.getFullYear() + "</span>)");


        },
        update: function () {
            var base = this;

            base.$el.find(".tasks_nb").html(base.planned_tasks.models.length);
            base.$el.find(".deadlines_nb").html(base.deadlines.models.length);



            base.$el.find(".planned_tasks").html("");
            for (var k in base.planned_tasks.models) {
                var planned_task = base.planned_tasks.models[k];
                var pt_view = new PlannedListItem(planned_task);
                base.$el.find(".planned_tasks").append(pt_view.$el);
                pt_view.init(base.SmartBlocks);
            }


            base.$el.find(".due_deadlines").html("");
            for (var k in base.deadlines.models) {
                var deadline = base.deadlines.models[k];
                var deadline_view = new TaskItem({
                    model: deadline
                });
                base.$el.find(".due_deadlines").append(deadline_view.$el);
                deadline_view.init(base.SmartBlocks);
            }
        },
        expand: function () {
            var base = this;
            if (!base.$el.find(".expandable").hasClass("expanded")) {
                base.parent.$el.find(".expandable").removeClass("expanded");
                base.$el.find(".expandable").addClass("expanded");
            }
        },
        bindClick: function () {
            var base = this;
            base.$el.bind("click.expand", function () {
                base.expand();
                base.$el.unbind("click.expand");
            });
        },
        registerEvents: function () {
            var base = this;

            base.bindClick();



            base.$el.delegate(".close_button", "click", function () {
                base.$el.find(".expandable").removeClass("expanded");
                base.bindClick();
            });
        }
    });

    return View;
});