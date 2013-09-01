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
            base.tasks = OrgApp.tasks;
            base.current_page = 1;
            base.page_size = 5;
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
            base.registerEvents();
        },
        renderTasks: function () {
            var base = this;

            var name_filter = base.$el.find(".name_filter").val();

            var tasks = _.filter(OrgApp.tasks.models, function (elt) {
                return elt.get("name").indexOf(name_filter) !== -1 && base.activity.get("tasks").get(elt.get('id'));
            });

            base.$el.find(".tasks_container").html("");
            var plus = _.template(add_task_thumb, {
                activity: base.activity
            });
            base.$el.find(".tasks_container").append(plus);
            for (var k in tasks) {
                var task = tasks[k];
                var task_thumbnail = new TaskThumbnail(task);
                base.$el.find(".tasks_container").append(task_thumbnail.$el);
                task_thumbnail.$el.addClass("small");
                task_thumbnail.init(base.SmartBlocks);
            }

        },
        registerEvents: function () {
            var base = this;
            base.$el.delegate(".add_task_button_container", "click", function () {
                OrgApp.ForceReturn = "#activities/" + base.activity.get('id') + "/tasks";
                window.location = "#tasks/new/activity=" + base.activity.get('id');
            });

            base.$el.delegate(".name_filter", "keyup", function () {
                base.renderTasks();
            });
        }
    });

    return View;
});