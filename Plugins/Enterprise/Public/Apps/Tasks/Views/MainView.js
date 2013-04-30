define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Tasks/Models/Task',
    'Enterprise/Apps/Tasks/Collections/Tasks',
    'text!Enterprise/Apps/Tasks/Templates/main_view.html',
    'Enterprise/Apps/Tasks/Views/TaskItem'
], function ($, _, Backbone, Task, TasksCollection, MainViewTemplate, TaskItemView) {
    var MainView = Backbone.View.extend({
        tagName: "div",
        className: "ent_tsk",
        initialize: function (SmartBlocks) {
            var base = this;

            base.SmartBlocks = SmartBlocks;
            base.init();
        },
        init: function () {
            var base = this;

            base.tasks_list = new TasksCollection();

            base.render();
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

            base.initializeEvents();
        },
        renderList: function () {
            var base = this;
            console.log(base.tasks_list);
            var tasks_list = base.tasks_list.models;
            var list_container = base.$el.find(".tasks_list");
            list_container.html("");
            for (var k in tasks_list) {
                var taskItemView = new TaskItemView( tasks_list[k]);
                taskItemView.init(base.SmartBlocks);
                list_container.append(taskItemView.$el);
            }
        },
        initializeEvents: function () {
            var base = this;

            base.$el.delegate(".tasks_mv_button", "click", function () {
                var elt = $(this);
                var action = elt.attr("data-action");

                if (action == "add") {
                    var task = new Task({
                        name: "New task"
                    });
                    base.tasks_list.add(task);
                    base.renderList();
                }
            });
        }
    });

    return MainView;
});