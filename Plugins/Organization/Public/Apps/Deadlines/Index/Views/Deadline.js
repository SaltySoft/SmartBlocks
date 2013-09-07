define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadline.html',
    'Organization/Apps/Common/Subapps/WorktimeProgressBar/WorktimeProgressBar',
    'Organization/Apps/Deadlines/Show/Views/Main',
    'ContextMenuView'
], function ($, _, Backbone, main_template, WtProgressbar, ShowView, ContextMenu) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_show_container",
        initialize: function (deadline) {
            var base = this;
            base.deadline = deadline;
            base.model = deadline;
        },
        init: function (SmartBlocks, params) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.activity = params.activity;
            base.show_activity = params.activity !== undefined;

            base.render();
            base.registerEvents();
            base.$el.attr("oncontextmenu", "return false;");
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {
                deadline: base.deadline,
                show_activity: base.show_activity
            });
            base.$el.html(template);
            var canvas = base.$el.find(".worktime_progressbar");
            base.worktime_pb = new WtProgressbar(canvas[0], base.deadline.getWork(), undefined, base.$el.height());
            base.update();

            window.setInterval(function () {
                if (base.$el.height() > 0) {
                    base.update();
                }
            }, 1000);

            var deadline_show = new ShowView(base.deadline);
            base.$el.find(".deadline_body").html(deadline_show.$el);
            deadline_show.init(base.SmartBlocks);

        },
        update: function () {
            var base = this;

            var now = new Date();
            var end = base.deadline.getStop();
            var time_left = Math.abs(end.getTime() - now.getTime());
            var timeleft_container = base.$el.find(".timeleft");

            if (now < end) {
                base.$el.removeClass("late");
            } else {
                base.$el.addClass("late");
            }

            timeleft_container.html((now < end ? "-" : "+") + " " + OrgApp.common.getFullTimeString(time_left));
            base.worktime_pb.updateWorktime(base.deadline.getWork());
        },
        expand: function () {
            var base = this;

            if (base.$el.hasClass("expanded")) {
                base.$el.removeClass("expanded");
                base.$el.parent().animate({'margin-top': 0}, 200);
                base.$el.parent().find(".deadline_body").slideUp(200);
            } else {
                base.$el.parent().find(".expanded").removeClass("expanded");
                base.$el.addClass("expanded");
                base.$el.find(".deadline_body").slideDown(200);
                var transform_n = -parseInt(base.$el.position().top - parseInt(base.$el.parent().css("margin-top")));
                var transform = "translateY(-" + parseInt(base.$el.position().top) + "px)";
                base.$el.parent().animate({'margin-top': transform_n}, 200);
            }


        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".deadline_header", "mouseup", function (e) {
                if (e.which == 1) {
                    base.expand();
                }

                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton(!base.$el.hasClass("expanded") ? "Open" : "Close", function () {
                        base.expand();
                    });

                    context_menu.addButton("Delete", function () {
                        if (confirm("Are you sure you want to delete this deadline ?")) {
                            base.deadline.destroy({
                                success: function () {
                                    OrgApp.deadlines.remove(base.deadline);
                                    base.$el.remove();
                                    base.SmartBlocks.show_message("Successfully deleted deadline");
                                },
                                error: function () {
                                    base.SmartBlocks.show_message("Couldn't delete deadline");
                                }
                            });
                        }
                    });

                    context_menu.show(e);


                }
                console.log(e.which);

            });


        }
    });

    return View;
});