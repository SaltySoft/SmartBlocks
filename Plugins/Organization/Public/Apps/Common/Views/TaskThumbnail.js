define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_thumbnail.html',
    './DeadlineThumbnail'
], function ($, _, Backbone, TaskThumbnailTemplate, DeadlineInfoView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_thumbnail_view",
        initialize: function (task) {
            var base = this;
            base.model = task;
            base.task = task;
        },
        init: function (SmartBlocks, callback) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
            base.registerEvents();
            base.callback = callback;
        },
        render: function () {
            var base = this;

            var template = _.template(TaskThumbnailTemplate, {
                task: base.task
            });
            base.$el.html(template);

            base.update();

        },
        update: function () {
            var base = this;

            //direct info
            base.$el.find(".task_name").html(base.task.get("name"));
            if (base.task.get('description'))
                base.$el.find(".description").html(base.task.get('description'));
            else
                base.$el.find(".description").html("No description");

            //subviews
            var deadline_info = new DeadlineInfoView(base.task);
            base.$el.find('.deadline_information').html(deadline_info.$el);

            deadline_info.init(base.SmartBlocks);
            base.$el.hide();
            base.$el.fadeIn(100, function (){
                if (base.callback) {
                    base.callback();
                }
            });

        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});