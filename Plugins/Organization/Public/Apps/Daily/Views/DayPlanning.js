define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Views/Hour',
    'Organization/Apps/Daily/Views/PlannedTask',
    'Organization/Apps/Daily/Models/PlannedTask',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'Organization/Apps/Tasks/Collections/Tasks'
], function ($, _, Backbone, HourView, PlannedTaskView, PlannedTask, PlannedTaskCollection, TasksCollection) {
    var DailyPlanningView = Backbone.View.extend({
        tagName: "div",
        className: "daily_planning_view",
        initialize: function () {
            var base = this;
            base.update_on = true;
        },
        init: function (SmartBlocks, date, planning) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.hours_holders = [];
            base.date = date;

            base.date.setHours(0);
            base.date.setMinutes(0);
            base.date.setSeconds(0);
            base.date.setMilliseconds(0);
            base.planning = planning;

            base.due_tasks = new TasksCollection();
            console.log("DUE TASKS", base.due_tasks);

            base.render();
            base.registerEvents();
            base.planned_tasks = new PlannedTaskCollection();



        },
        render: function () {
            var base = this;
            base.$el.html('<div class="line"></div>');
            base.hours_holders = [];
            var last_time = new Date(base.date);
            console.log(last_time);
            for (var i = 0; i < 24; i++) {
                var hour_holder = new HourView();
                var time = new Date(last_time);

                hour_holder.init(base.SmartBlocks, time, base);

                base.hours_holders.push(hour_holder);
                base.$el.append(hour_holder.$el);
                base.$el.append('<div class="clearer"></div>');
                time.setHours(last_time.getHours() + 1);

                last_time = time;


            }

            base.updateDueTasks();
//            base.$el.css("top", -2 * base.getHourHeight());
        },
        updateDueTasks: function () {
            var base = this;

            base.due_tasks.fetch({
                data: {
                    "date": base.planning.current_date.getTime() / 1000
                },
                success: function () {
                    base.$el.find(".deadline").remove();
                    console.log("DUE TASks", base.due_tasks);
                    for (var k in base.due_tasks.models) {

                        var task = base.due_tasks.models[k];
                        var div = $(document.createElement("div"));
                        div.addClass("deadline");
                        var date = task.getDueDate();
                        var top = 0;
                        top += date.getHours() * base.getHourHeight();
                        top += date.getMinutes() / 60 * base.getHourHeight();
                        div.css("top", top);
                        div.html(date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + " " + task.get("name"));
                        base.$el.append(div);
                        if (task.get("completion_date")) {
                            div.addClass("done");
                        }
                    }
                }
            });
        },
        updateCurrentTime: function () {
            var base = this;

            var line = base.$el.find(".line");
            var now = new Date();
            if (base.getStartPosition(now) > 0) {
                line.css("top", base.getStartPosition(now));
                line.show();


            }

            if (base.update_on)
                setTimeout(function () {
                    base.updateCurrentTime();
                }, 300);
        },
        scroll: function (e) {
            var base = this;

            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            var change = base.getHourHeight() * 2;
            var day_height = base.getHourHeight() * 24;
            var parent_height = base.$el.parent().height();
            if (delta < 0) {
                if (base.pos - change > -day_height + parent_height)
                    base.pos -= change;
                else
                    base.pos = -day_height + parent_height;
            } else {
                if (base.pos < 0)
                    base.pos += change;
                else
                    base.pos = 0;
            }

            if (base.pos > 0)
                base.pos = 0;

            base.$el.css("top", base.pos);
        },
        getHourHeight: function () {
            var base = this;
            return base.$el.find(".hour_view").height() > 0 ? base.$el.find(".hour_view").height() + 2 : 50;
        },
        getStartPosition: function (date) {
            var base = this;
            var hour = date.getHours();
            var minute = date.getMinutes();
            return base.$el.height() / (24 * 60) * (hour * 60 + minute);
        },
        addPlannedTask: function (planned_task) {
            var base = this;
            console.log("PLANNED", planned_task);
            var planned_task_view = new PlannedTaskView({
                model: planned_task
            });
            planned_task_view.init(base.SmartBlocks, base, base.planning);
            base.$el.append(planned_task_view.$el);
            return planned_task_view;
        },
        createTask: function (task, start) {
            var base = this;
            var date = start;
//            date.setHours(date.getHours() - 1);
            var planned_task = new PlannedTask();
            planned_task.set("start", date.getTime());
            planned_task.set("duration", "1800000");
            planned_task.set("task", task);
            planned_task.save();
            base.addPlannedTask(planned_task);
        },
        fetchPlannedTasks: function () {
            var base = this;

            base.planned_tasks = new PlannedTaskCollection();
            base.planned_tasks.fetch({
                data: {
                    date: base.planning.current_date.getTime()
                },
                success: function (elt) {
                    base.planned_tasks = elt;
                    for (var k in elt.models) {
                        var planned_task = elt.models[k];
                        base.addPlannedTask(planned_task);
                    }
                }
            });
        },
        registerEvents: function () {
            var base = this;


            var parent = base.$el.parent();
            console.log(parent);
            if (base.el.addEventListener) {
                // IE9, Chrome, Safari, Opera
                base.el.addEventListener("mousewheel", $.proxy(base.scroll, base), false);
                // Firefox
                base.el.addEventListener("DOMMouseScroll", $.proxy(base.scroll, base), false);
            }
            base.updateCurrentTime();
            var now = new Date();

//            if (now.getHours() > 12) {
            base.pos = -8 * (base.getHourHeight());
            base.$el.css("top", base.pos);
//            }

//            /**
//             * Tests
//             */
//            base.$el.bind("click.create_task", function () {
//                base.createTask();
//            });
            base.fetchPlannedTasks();

            base.SmartBlocks.events.on("org.task_modified", function (task) {
                base.updateDueTasks();
            });
        }
    });

    return DailyPlanningView;
});