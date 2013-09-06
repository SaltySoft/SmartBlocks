define([
    'jquery',
    'underscore',
    'backbone',
    './Deadline',
    'text!../Templates/main.html'
], function ($, _, Backbone, DeadlineShow, main_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadlines_index",
        initialize: function (activity) {
            var base = this;
            base.activity = activity;

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {

            });

            base.$el.html(template);

            var deadlines = new OrgApp.DeadlinesCollection(OrgApp.Deadline.generateStubs(base.activity));

            for (var k in deadlines.models) {
                var deadline_view = new DeadlineShow(deadlines.models[k]);
                base.$el.find(".deadlines_container").append(deadline_view.$el);
                deadline_view.init(base.SmartBlocks, {
                    show_activity: base.activity === undefined
                });
            }
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".deadline_header", "click", function() {
                base.$el.find(".deadline_body").hide();
                base.$el.find(".deadline_show").removeClass("expanded");
                base.$el.find(".deadline_show").css("transform", "none");
            });
        }
    });

    return View;
});