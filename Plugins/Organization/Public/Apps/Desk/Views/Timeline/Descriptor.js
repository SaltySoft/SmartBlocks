define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Timeline/descriptor.html'
], function ($, _, Backbone, descriptor_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "descriptor",
        initialize: function (planned_task) {
            var base = this;

            base.planned_task = planned_task;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.task = OrgApp.tasks.get(base.planned_task.get('task').get('id'));
            base.deadline = OrgApp.deadlines.get(base.task.get('deadline').get('id'));
            base.activity = OrgApp.activities.get(base.task.get('activity').id);

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(descriptor_tpl, {});
            base.$el.html(template);

            base.update();

            setInterval(function () {
                if (base.$el.height() > 0)
                    base.update();
            }, 1000);
        },
        update: function () {
            var base = this;

            base.$el.find('.name').html(base.task.get('name'));
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});