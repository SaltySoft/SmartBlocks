define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Collections/Tasks',
    'text!Organization/Apps/Recap/Templates/next_recap.html',
    'Organization/Apps/Recap/Views/DeadlineItem'
], function ($, _, Backbone, TasksCollection, NextRecapTemplate, DeadlineItem) {
    var NextRecapView = Backbone.View.extend({
        tagName: "div",
        className: "next_recap",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.deadlines = new TasksCollection();

            base.render();
            base.registerEvents();
            base.fetchTasks(function () {
                base.updateView();
            });
        },
        render: function () {
            var base = this;

            var template = _.template(NextRecapTemplate);
            base.$el.html(template);
        },
        updateView: function () {
            var base = this;
            var deadline_list_dom = base.$el.find(".deadline_list");
            deadline_list_dom.html("");
            for (var k in base.deadlines.models) {
                var deadline = base.deadlines.models[k];

                var deadline_view = new DeadlineItem({
                    model: deadline
                });
                deadline_list_dom.append(deadline_view.$el);
                deadline_view.init(base.SmartBlocks);
            }
        },
        fetchTasks: function (callback) {
            var base = this;

            base.deadlines.fetch({
                data: {
                    filter: "undone"
                },
                success: function () {
                    if (callback)
                        callback();
                }
            });
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return NextRecapView;
});