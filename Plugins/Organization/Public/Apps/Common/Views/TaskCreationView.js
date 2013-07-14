define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_creation.html',
    'Organization/Apps/Common/Models/Task'
], function ($, _, Backbone, TaskCreationTemplate, Task) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_creation_view_container cache",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, tasks_tags) {
            var base = this;
            $("body").append(base.$el);
            base.SmartBlocks = SmartBlocks;
            base.tasks_tags = tasks_tags;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var template = _.template(TaskCreationTemplate, {
                tags : base.tasks_tags.models
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".create_button", "click", function () {
                var form = base.$el.find("form");
                var data = form.serializeArray();
                var task_array = {};
                for (var k in data) {
                    task_array[data[k].name] = data[k].value;
                }
                var task = new Task(task_array);
                task.save({}, {
                    success: function () {
                        base.SmartBlocks.events.trigger("org_new_task", task);
                    }
                });
                base.$el.remove();
            });
            base.$el.delegate(".cancel_button", "click", function () {
                base.$el.remove();
                return false;
            });

            base.$el.find("#form_task_date").datepicker({
                dateFormat: 'yy-mm-dd'
            });
        }
    });

    return View;
});