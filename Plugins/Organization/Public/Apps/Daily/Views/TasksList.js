define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var TasksListView = Backbone.View.extend({
        tagName: "ul",
        className: "tasks_list",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;



            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

        },
        registerEvents: function () {
            var base = this;

        }
    });

    return TasksListView;
});