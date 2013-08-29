define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/tasks.html',
    'Organization/Apps/Common/Views/TaskThumbnail',
    'text!Organization/Apps/Common/Templates/add_task_thumb.html'
], function ($, _, Backbone, tasks_template, TaskThumbnail, add_task_thumb) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "tasks_list_view",
        initialize: function (activity) {
            var base = this;
            base.model = activity;
            base.activity = activity;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(tasks_template, {});
            base.$el.html(template);

            base.renderTasks();
        },
        renderTasks: function () {
            var base = this;

            var name_filter = base.$el.find(".name_filter").val();

            var tasks = _.filter(base.activity.get("tasks").models, function (elt) {
                return elt.get("name").indexOf(name_filter) !== -1;
            });

            base.$el.find(".tasks_container").html("");
            for (var k in tasks) {
                var task = tasks[k];
                var task_thumbnail = new TaskThumbnail(task);
                base.$el.find(".tasks_container").append(task_thumbnail.$el);
                task_thumbnail.$el.addClass("small");
                task_thumbnail.init(base.SmartBlocks);
            }
            var plus = _.template(add_task_thumb, {
                activity: base.activity
            });
            base.$el.find(".tasks_container").append(plus);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});