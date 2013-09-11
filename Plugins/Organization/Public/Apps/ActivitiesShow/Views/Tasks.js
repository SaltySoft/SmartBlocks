define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/tasks.html',
    'Organization/Apps/Common/Views/TaskThumbnail',
    'text!Organization/Apps/Common/Templates/add_task_thumb.html',
    'Organization/Apps/Tasks/Collections/Tasks'
], function ($, _, Backbone, tasks_template, TaskThumbnail, add_task_thumb, TasksCollection) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "tasks_list_view",
        initialize: function (activity) {
            var base = this;
            base.model = activity;
            base.activity = activity;
            base.tasks = OrgApp.tasks;
            base.current_page = 1;
            base.page_size = 19;
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


            var tasks = OrgApp.tasks.filter(function (elt) {
                return elt.get("name").indexOf(name_filter) !== -1 && base.activity.get("tasks").get(elt.get('id'));
            });

            var total_count = tasks.length;
            var page_count = Math.ceil(total_count / base.page_size);


            if (base.current_page < 1) {
                base.current_page = 1;
            } else if (base.current_page > page_count) {
                base.current_page = page_count;
            }
            var page_begin = (base.current_page - 1) * base.page_size;
            var page_end = page_begin + base.page_size;

            base.$el.find(".pagination_container").html("");
            base.$el.find(".pagination_container").append('<li><a class="pure-button prev" href="javascript:void(0);">&#171;</a></li>');
            for (var i = base.current_page - 2; i < base.current_page; i++) {
                if (i > 0)
                    base.$el.find(".pagination_container").append('<li><a href="javascript:void(0);" ' +
                        'class="page_changer pure-button ' + (i == base.current_page ? "pure-button-active" : "") + '" ' +
                        'data-value="' + i + '"  >' + i + '</a>' +
                        '</li>');
                else {
                    base.$el.find(".pagination_container").append('<li><a href="javascript:void(0);" ' +
                        'class="page_changer pure-button" ' +
                        'data-value="' + 1 + '"  ></a>' +
                        '</li>');
                }
            }
            for (var j = base.current_page; j <= base.current_page + 2; j++) {
                console.log(j, base.current_page + 1);
                if (j <= page_count)
                    base.$el.find(".pagination_container").append('<li><a href="javascript:void(0);" ' +
                        'class="page_changer pure-button ' + (j == base.current_page ? "pure-button-active" : "") + '" ' +
                        'data-value="' + j + '"  >' + j + '</a>' +
                        '</li>');

                else {
                    base.$el.find(".pagination_container").append('<li><a href="javascript:void(0);" ' +
                        'class="page_changer pure-button" ' +
                        'data-value="' + page_count + '"  ></a>' +
                        '</li>');
                }
            }
            base.$el.find(".pagination_container").append('<li><a class="pure-button next" href="javascript:void(0);">&#187;</a></li>');

            tasks = tasks.slice(page_begin, page_end);

//            console.log(tasks);


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
            base.$el.delegate(".add_task_button_container", "click", function () {
                OrgApp.ForceReturn = "#activities/" + base.activity.get('id') + "/tasks";
                window.location = "#tasks/new/activity=" + base.activity.get('id');
            });

            base.$el.delegate(".name_filter", "keyup", function () {
                base.renderTasks();
            });

            base.$el.delegate(".page_changer", "click", function () {
                var elt = $(this);
                var page = elt.attr("data-value");
                base.current_page = parseInt(page);
                base.renderTasks();
            });

            base.$el.delegate(".prev", "click", function () {
                base.current_page--;
                base.renderTasks();
            });
            base.$el.delegate(".next", "click", function () {
                base.current_page++;
                base.renderTasks();
            });
        }
    });

    return View;
});