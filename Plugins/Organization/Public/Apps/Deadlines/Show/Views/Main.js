define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html'
], function ($, _, Backbone, main_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_show",
        initialize: function (deadline) {
            var base = this;
            base.deadline = deadline;
            base.model = deadline;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {
                deadline: base.deadline
            });
            base.$el.html(template);

            base.update();

            window.setInterval(function () {
                if (base.$el.height() > 0) {
                    base.update();
                }
            }, 500);

        },
        update: function () {
            var base = this;

            var now = new Date();
            var end = base.deadline.getStop();
            var time_left = Math.abs(end.getTime() - now.getTime());
            var timeleft_container = base.$el.find(".timeleft");

            timeleft_container.html((now < end ? "-" : "+") + " "+ OrgApp.common.getFullTimeString(time_left));
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});