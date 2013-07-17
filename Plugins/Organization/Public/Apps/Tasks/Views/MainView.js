define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Tasks/Collections/Tasks',
    'text!Organization/Apps/Tasks/Templates/main_view.html',
    'Organization/Apps/Tasks/Views/TaskItem',
    'Organization/Apps/Common/Views/TaskPopup',
    'jqueryui'
], function ($, _, Backbone, Task, TasksCollection, MainViewTemplate, TaskItemView, TaskPopupView) {

    function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(d);
        d.setHours(0,0,0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        // Get first day of year
        var yearStart = new Date(d.getFullYear(),0,1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
        // Return array of year and week number
        return [d.getFullYear(), weekNo];
    }

    var MainView = Backbone.View.extend({
        tagName: "div",
        className: "ent_tsk",

        initialize: function () {
            var base = this;
            base.current_date = new Date();

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.tasks_list = new TasksCollection();

            base.render();
            base.initializeEvents();
        },
        render: function () {
            var base = this;

            //template
            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);

            base.SmartBlocks.startLoading("Fetching your tasks list");

            base.tasks_list.fetch({
                success: function () {
//                    console.log(base.tasks_list.models);
                    base.SmartBlocks.stopLoading();
//                    console.log(base.tasks_list);
                    base.renderList();
                }
            });
        },
        renderList: function () {
            var base = this;
//            console.log(base.tasks_list);
            var tasks_list = base.tasks_list.models;
            var list_container = base.$el.find(".tasks_list");
            list_container.html("");
            var date = new Date();

            var tasks_week = getWeekNumber(base.current_date);
            var current_week = getWeekNumber(new Date());
            if (tasks_week[0] == current_week[0] && tasks_week[1] == current_week[1]) {
                base.$el.find(".week_display").html("This week's tasks");
            } else {
                base.$el.find(".week_display").html(tasks_week[0] + " : Week n. "+ tasks_week[1] + "'s tasks");
            }
            for (var k in tasks_list) {
                var task = tasks_list[k];
//                console.log(getWeekNumber(task.getDueDate()), getWeekNumber(base.current_date));
                if (getWeekNumber(task.getDueDate())[0] == getWeekNumber(base.current_date)[0] && getWeekNumber(task.getDueDate())[1] == getWeekNumber(base.current_date)[1])  {
                    if (date.getTime() != task.getDueDate().getTime()) {
                        date = task.getDueDate();
//                        list_container.append('<div class="task_separator"><h4>' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + "</h4></div>");
                    }
                    var taskItemView = new TaskItemView(tasks_list[k]);
                    taskItemView.init(base.SmartBlocks, base);
                    list_container.append(taskItemView.$el);
                }
            }
        },
        initializeEvents: function () {
            var base = this;

            base.$el.delegate(".tasks_mv_button", "click", function () {
                var elt = $(this);
                var action = elt.attr("data-action");

                if (action == "add") {
                    var task = new Task({
                        name: "New task",
                        due_date: new Date().getTime() / 1000
                    });
//                    console.log(TaskPopupView);
                    var popup_view = new TaskPopupView(task);
                    popup_view.events.on("task_updated", function (task) {
                        base.render();
                    });
                    popup_view.init(base.SmartBlocks);
//                    base.tasks_list.add(task);
//                    base.renderList();
                }
            });

            base.$el.delegate(".reload_tasks", "click", function () {
                base.render();
            });

            base.$el.delegate(".prev_week_button", "click", function () {
                base.current_date.setDate(base.current_date.getDate() - 7);
                base.renderList();
            });
            base.$el.delegate(".next_week_button", "click", function () {
                base.current_date.setDate(base.current_date.getDate() + 7);
                base.renderList();
            });
        }
    });

    return MainView;
});