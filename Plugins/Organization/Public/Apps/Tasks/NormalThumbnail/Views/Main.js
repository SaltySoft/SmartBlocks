define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html',
    'text!../Templates/new_task_thb.html',
    './SubtaskLine'
], function ($, _, Backbone, main_template, new_tpl, SubtaskLineView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_normal_thumbnail",
        initialize: function (task) {
            var base = this;
            base.task = task;
            base.model = task;
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

            var template = _.template(main_template, {
                task: base.task
            });
            base.$el.html(template);

            base.renderSubtasksList();
        },
        renderSubtasksList: function (page) {
            var base = this;


            var subtasks = base.task.get("subtasks");
            base.$el.find(".subtasks_list").html('');
            for (var k in subtasks.models) {
                var subtask = subtasks.models[k];
                var subtask_line = new SubtaskLineView(subtask);
                base.$el.find(".subtasks_list").append(subtask_line.$el);
                subtask_line.init(base.SmartBlocks);
            }


            //paginator construction
            for (var i = 1; i < base.page_size; i++) {
                var link = $('<a href="javascript:void(0)" class="page_button" data-page="' + i +'"><div></div></a>');
            }

        },
        registerEvents: function () {
            var base = this;
            

        }
    });

    View.new_tpl = new_tpl;

    return View;
});