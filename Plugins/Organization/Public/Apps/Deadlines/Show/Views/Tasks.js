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
            base.page_size = 5;
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
        renderPage: function (page) {
            var base = this;
            var tasks = base.deadline.getTasks();

            base.page_count = Math.ceil(tasks.models.length / base.page_size);
            if (page)
                base.current_page = page;
            if (base.current_page < 1) {
                base.current_page = 1;
            } else if (base.current_page > base.page_count) {
                base.current_page = base.page_count;
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

            base.$el.find("> .pagination_container .pagination").html("");
            for (var i = 1; i <= base.page_count; i++) {
                var link = $('<a href="javascript:void(0)" class="page_button' + (i == base.current_page ? ' selected' : '') + '" data-page="' + i + '"><div></div></a>');
                base.$el.find("> .pagination_container .pagination").append(link);

            }

        },
        registerEvents: function () {
            var base = this;

            OrgApp.tasks.on('add', function () {
                base.renderPage();
            });

            OrgApp.tasks.on('remove', function () {
                base.renderPage();
            });

            base.$el.delegate(".task_normal_thumbnail.new", 'click', function () {
                var task = new OrgApp.Task();
                task.set('deadline', base.deadline);
                task.set('activity', base.deadline.getActivity());
                task.set('name', 'New task');
                task.set('required_time', 4);
                task.save({}, {
                    success: function () {
                        base.SmartBlocks.show_message('Successfully created task');
                    }
                });
                OrgApp.tasks.add(task);

            });

            base.$el.delegate("> .pagination_container .pagination a", 'click', function () {
                var elt = $(this);
                var page = elt.attr('data-page');
                base.renderPage(page);
            });
        }
    });

    return View;
});