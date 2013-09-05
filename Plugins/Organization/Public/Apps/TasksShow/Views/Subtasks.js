define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/subtasks.html'
], function ($, _, Backbone, subtasks_template) {
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
            var template = _.template(subtasks_template, {
            });
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;
        }
    });

    return View;
});