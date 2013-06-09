define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Views/Planning'
], function ($, _, Backbone, PlanningView) {
    var MainView = Backbone.View.extend({
        tagName: "div",
        className: "planning_main_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
        },
        render: function () {
            var base = this;
            base.planning = new PlanningView();
            base.planning.init(base.SmartBlocks);
            base.$el.html(base.planning.$el);
        },
        registerEvents: function () {

        }
    });

    return MainView;
});