define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadlines.html',
    'Organization/Apps/Deadlines/Show/Views/Main'
], function ($, _, Backbone, deadline_template, DeadlineShow) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "a_class",
        initialize: function (activity) {
            var base = this;
            base.model = activity;
            base.activity = activity;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(deadline_template, {});
            base.$el.html(template);

            var deadlines = new OrgApp.DeadlinesCollection(OrgApp.Deadline.generateStubs(base.activity));

            for (var k in deadlines.models) {
                var deadline_view = new DeadlineShow(deadlines.models[k]);
                base.$el.append(deadline_view.$el);
                deadline_view.init(base.SmartBlocks);
            }
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});