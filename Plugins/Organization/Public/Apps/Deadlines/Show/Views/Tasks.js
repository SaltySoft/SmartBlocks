define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/tasks.html',
    'Organization/Apps/Tasks/NormalThumbnail/Views/Main'
], function ($, _, Backbone, tasks_template, TaskNormalThumbnail) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadlines_show_tasks",
        initialize: function (deadline) {
            var base = this;
            base.deadline = deadline;
            base.model = deadline;
            base.current_page = 1;
            base.page_size = 19;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(tasks_template, {});
            base.$el.html(template);
            base.renderPage(1);
        },
        renderPage: function () {
            var base = this;
            var tasks = base.deadline.getTasks();
            var page_count = Math.ceil(tasks.models.length / base.page_size);

            if (base.current_page < 1) {
                base.current_page = 1;
            } else if (base.current_page > page_count) {
                base.current_page = page_count;
            }
            var page_begin = (base.current_page - 1) * base.page_size;
            var page_end = page_begin + base.page_size;

            tasks = tasks.slice(page_begin, page_end);

            base.$el.find(".tasks_list").html("");

            for (var k in tasks) {
                var task = tasks[k];
                var task_thumbnail = new TaskNormalThumbnail(task);
                base.$el.find(".tasks_list").append(task_thumbnail.$el);
                task_thumbnail.init(base.SmartBlocks);
            }

            var new_thb = TaskNormalThumbnail.new_tpl;
            base.$el.find(".tasks_list").append(new_thb);


        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});