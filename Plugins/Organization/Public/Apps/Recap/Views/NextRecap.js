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
            base.page = 0;
            base.page_count = 4;
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

            if (base.page <= 0) {
                base.$el.find(".prev").addClass("pure-button-disabled");
            } else {
                base.$el.find(".prev").removeClass("pure-button-disabled");
            }
        },
        updateView: function () {
            var base = this;
            var deadline_list_dom = base.$el.find(".deadline_list");
            deadline_list_dom.find(".deadline_item").remove();
            var i = 0;
            for (var k in base.deadlines.models) {
                if (i >= base.page * base.page_count && i < base.page * base.page_count + base.page_count) {
                    var deadline = base.deadlines.models[k];
                    var deadline_view = new DeadlineItem({
                        model: deadline
                    });
                    deadline_list_dom.append(deadline_view.$el);
                    deadline_view.init(base.SmartBlocks);
                }
                i++;
            }
            if ((base.page + 1) * base.page_count >= i) {
                base.$el.find(".next").addClass("pure-button-disabled");
            } else {
                base.$el.find(".next").removeClass("pure-button-disabled");
            }

            if (base.page <= 0) {
                base.$el.find(".prev").addClass("pure-button-disabled");
            } else {
                base.$el.find(".prev").removeClass("pure-button-disabled");
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

            base.$el.delegate(".prev", 'click', function () {
                if (base.page > 0) {
                    base.page -= 1;
                    base.updateView();
                }
            });

            base.$el.delegate(".next", 'click', function () {
                if ((base.page + 1) * base.page_count < base.deadlines.models.length) {
                    base.page += 1;
                    base.updateView();
                }
            });
        }
    });

    return NextRecapView;
});