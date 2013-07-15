define([
    'jquery',
    'underscore',
    'backbone',

], function ($, _, Backbone) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "calendar_container_view",
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

            var now = new Date();

            base.$el.fullCalendar({
                header: {
                    left: 'prev, next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay',
                    editable: true,
                    events: [
                        {
                            title: 'All day event',
                            start : new Date(now.getFullYear(), now.getMonth(), 1)
                        }
                    ]
                }
            });
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});