define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadlines.html',
    './DeadlineLine'
], function ($, _, Backbone, deadlines_tpl, DeadlineLineView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_thb_deadlines",
        initialize: function (activity) {
            var base = this;

            base.activity = activity;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.current_page = 1;
            base.page_size = 5;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(deadlines_tpl, {
                activity: base.activity
            });
            base.$el.html(template);

            var deadlines = base.activity.getDeadlines();
            base.$el.find(".deadlines_list").html('');
            for (var k in deadlines.models) {
                var deadline_line_view = new DeadlineLineView(deadlines.models[k]);
                base.$el.find(".deadlines_list").append(deadline_line_view.$el);
                deadline_line_view.init(base.SmartBlocks);
            }
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});