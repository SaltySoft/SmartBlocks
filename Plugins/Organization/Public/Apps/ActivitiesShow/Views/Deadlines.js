define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadlines.html',
    'Organization/Apps/Deadlines/Index/Views/Main'
], function ($, _, Backbone, deadline_template, DeadlinesIndex) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_deadlines",
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
            var deadlines = new OrgApp.DeadlinesCollection(OrgApp.Deadline.generateStubs(base.activity));
            var deadlines_index = new DeadlinesIndex(deadlines);
            base.$el.html(deadlines_index.$el);
            deadlines_index.init(base.SmartBlocks);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});