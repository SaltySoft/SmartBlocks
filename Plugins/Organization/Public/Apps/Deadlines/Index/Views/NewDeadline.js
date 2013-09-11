define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/new_deadline_btn.html',
    'jqueryui'
], function ($, _, Backbone, new_ddl_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_show_container new",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks, params) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            if (params)
                base.activity = params.activity;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(new_ddl_tpl, {
                now: new Date()
            });
            base.$el.html(template);

            base.$el.find(".deadline_start_date_input, .deadline_stop_date_input").datepicker();
        },
        expand: function () {
            var base = this;
            if (base.$el.hasClass("expanded")) {
                base.retract();
            } else {
                base.$el.parent().find(".expanded").removeClass("expanded");
                base.$el.addClass("expanded");
                base.$el.find(".deadline_body").slideDown(200);
                var transform_n = -parseInt(base.$el.position().top - parseInt(base.$el.parent().css("margin-top")));
                var transform = "translateY(-" + parseInt(base.$el.position().top) + "px)";
                base.$el.parent().animate({'margin-top': transform_n}, 200);
            }


        },
        retract: function () {
            var base = this;
            base.$el.removeClass("expanded");
            base.$el.parent().animate({'margin-top': 0}, 200);
            base.$el.parent().find(".deadline_body").slideUp(200);
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".deadline_header", "click", function () {
                base.expand();
            });

            base.$el.delegate("form", "submit", function () {
                var elt = $(this).serializeArray();
                if (base.$el.hasClass("expanded")) {

                    var deadline = new OrgApp.Deadline();

                    deadline.set("name", base.$el.find(".deadline_name_input").val());

                    var start = new Date();
                    start.setTime(Date.parse(base.$el.find(".deadline_start_date_input").val()));
                    start.setHours(base.$el.find(".deadline_start_hour_input").val(), base.$el.find(".deadline_start_minute_input").val(), 0);

                    var stop = new Date();
                    stop.setTime(Date.parse(base.$el.find(".deadline_stop_date_input").val()));
                    stop.setHours(base.$el.find(".deadline_stop_hour_input").val(), base.$el.find(".deadline_stop_minute_input").val(), 0);

                    deadline.setStart(start);
                    deadline.setStop(stop);

                    if (base.activity) {
                        deadline.set("activity", base.activity);
                    }

                    deadline.set("tasks", new OrgApp.TasksCollection());
                    deadline.save();
                    OrgApp.deadlines.add(deadline);


                    base.retract();

                }
            });

            base.$el.delegate("form", 'reset', function () {
                base.retract();
            });


        }
    });

    return View;
});