define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadline.html'
], function ($, _, Backbone, main_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_show",
        initialize: function (deadline) {
            var base = this;
            base.deadline = deadline;
            base.model = deadline;
        },
        init: function (SmartBlocks, params) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.show_activity = params.show_activity !== false;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {
                deadline: base.deadline,
                show_activity: base.show_activity
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

            timeleft_container.html((now < end ? "-" : "+") + " " + OrgApp.common.getFullTimeString(time_left));
        },
        expand: function () {
            var base = this;

            if (base.$el.hasClass("expanded")) {
                base.$el.removeClass("expanded");
                base.$el.parent().animate({'margin-top': 0}, 500);
            } else {
                base.$el.parent().find(".expanded").removeClass("expanded");

                base.$el.addClass("expanded");
                var transform_n = -parseInt(base.$el.position().top - parseInt(base.$el.parent().css("margin-top")));
                var transform = "translateY(-" + parseInt(base.$el.position().top) + "px)";
                base.$el.parent().animate({'margin-top': transform_n}, 500);
            }


        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".deadline_header", "click", function () {
                base.expand();
            });
        }
    });

    return View;
});