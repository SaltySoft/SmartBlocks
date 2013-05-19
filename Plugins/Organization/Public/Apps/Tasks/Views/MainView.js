define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Tasks/Collections/Tasks',
    'text!Organization/Apps/Tasks/Templates/main_view.html',
    'Organization/Apps/Tasks/Views/TaskItem',
    'jqueryui'
], function ($, _, Backbone, Task, TasksCollection, MainViewTemplate, TaskItemView) {

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

        initialize: function (SmartBlocks) {
            var base = this;
            base.current_date = new Date();
            base.SmartBlocks = SmartBlocks;
            base.init();
        },
        init: function () {
            var base = this;

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


                    base.SmartBlocks.stopLoading();
                    console.log(base.tasks_list);
                    base.renderList();
                }
            });
////            base.$el.find(".tasks_list").sortable({
////                handle: '.handle',
////                stop: function () {
////                    //handle order
////                    var i = 0;
////                    base.$el.find(".task_item").each(function () {
////                        var elt = $(this);
////                        var model = base.tasks_list.get(elt.attr("data-id"));
////                        model.set("order_index", i++);
////                        model.save();
////                    });
////                }
////            });
//            base.$el.find(".tasks_list").disableSelection();

        },
        renderList: function () {
            var base = this;
            console.log(base.tasks_list);
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
                console.log(getWeekNumber(task.getDueDate()), getWeekNumber(base.current_date));
                if (getWeekNumber(task.getDueDate())[0] == getWeekNumber(base.current_date)[0] && getWeekNumber(task.getDueDate())[1] == getWeekNumber(base.current_date)[1])  {
                    if (date.getTime() != task.getDueDate().getTime()) {
                        date = task.getDueDate();
                        list_container.append('<div class="task_separator"><h4>' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + "</h4></div>");
                    }
                    var taskItemView = new TaskItemView(tasks_list[k]);
                    taskItemView.init(base.SmartBlocks);
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
                    base.tasks_list.add(task);
                    base.renderList();
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