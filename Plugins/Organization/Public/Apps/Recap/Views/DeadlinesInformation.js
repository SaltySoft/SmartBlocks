define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadlines_information.html',
    'Organization/Apps/Tasks/Collections/Tasks',
    'Organization/Apps/Common/Views/DeadlineThumbnail'
], function ($, _, Backbone, DeadlinesInformationTemplate, TasksCollection, DeadlineThumbnail) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadlines_information_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.deadlines = new TasksCollection();

            base.deadlines.fetch({
                data: {
                    filter: "undone"
                },
                success: function () {


                    base.render();
                    base.registerEvents();
                }

            });


        },
        render: function () {
            var base = this;

            var template = _.template(DeadlinesInformationTemplate, {});
            base.$el.html(template);
            console.log(base.deadlines.models);
            for (var k in base.deadlines.models) {
                var deadline  = base.deadlines.models[k];
                console.log(deadline.get("name"), deadline.get("due_date"));

                if (deadline.get("due_date")) {
                    var deadline_information_view = new DeadlineThumbnail(deadline);
                    base.$el.find(".deadlines_container").append(deadline_information_view.$el);
                    deadline_information_view.init(base.SmartBlocks);
                    deadline_information_view.events.on("set_complete", function (view) {
                        view.$el.fadeOut(200);
                    });
                }


            }

            if (base.deadlines.models.length < 1) {
                console.log(base.deadlines.models);
                base.$el.find(".deadlines_container").html('<div style="text-align: center; height: 50px; line-height: 50px">No current deadline</div>');
            }
            base.$el.find(".deadlines_container").append('<div class="clearer"></div>');
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});