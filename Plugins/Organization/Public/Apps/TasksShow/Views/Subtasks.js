define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Models/Subtask',
    'Organization/Apps/Collections/Subtasks',
    'text!../Templates/subtasks.html'
], function ($, _, Backbone, Subtask, SubtasksCollection, subtasksTemplate) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_show_subtasks",
        initialize:function (task) {
            var base = this;
            base.task = task;
            base.model = task;

        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render:function () {
            var base = this;

            console.log("Substasks view, task", base.task);

            var template = _.template(subtasksTemplate, {
                subtasks:base.task.get('subtasks').models
            });
            base.$el.html(template);

            base.registerEvents();
        },
        registerEvents:function () {
            var base = this;

            base.$el.delegate(".add_subtasks", "click", function () {
                var new_subtask = new Subtask({
                    task:base.task
                });
                new_subtask.save({}, {
                    success:function () {
                        console.log("success new_subtask save");
                        base.task.get('subtasks').add(new_subtask);
                        base.render();
                    },
                    error:function () {
                        console.log("error new_subtask save");
                    }
                });

                console.log("add_subtasks click, task", base.task);
            });

            base.$el.delegate(".subtask_infos", "click", function () {
                console.log("click subtask_infos");
            });


            $('table tr').hover(function () {
                $(this).addClass('table-line-hover');
            }, function () {
                $(this).removeClass('table-line-hover');
            });
        }
    });

    return View;
});