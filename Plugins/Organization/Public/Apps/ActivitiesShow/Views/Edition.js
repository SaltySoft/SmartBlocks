define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/edition.html'
], function ($, _, Backbone, EditionTemplate) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_edition",
        initialize: function (activity) {
            var base = this;
            base.activity = activity;
            base.model = activity;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(EditionTemplate, {
                activity: base.activity,
                types: OrgApp.activity_types.models
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
            //Activity deletion

            base.$el.delegate('.edition_form input, .edition_form select, .edition_form textarea', 'change', function () {
                var elt = $(this);
                if (elt.val() == "on") {
                    base.activity.set(elt.attr("name"), elt.is(":checked"));
                } else {
                    base.activity.set(elt.attr("name"), elt.val());
                }
            });

            base.$el.delegate(".edition_form", 'submit', function () {
                base.activity.save({}, {
                    success: function () {
                        base.SmartBlocks.show_message("The activity was successfully saved.");
                    },
                    error: function () {
                        base.SmartBlocks.show_message("The activity could not be saved.");
                    }
                });
            });

            base.$el.delegate(".delete_button", "click", function () {
                if (confirm("Are you absolutely sure you want to delete this activity ?")) {
                    base.activity.destroy({
                        success: function () {
                            base.SmartBlocks.show_message("Activity successfully deleted.");
                            window.location = "#activities";
                        },
                        error: function () {
                            base.SmartBlocks.show_message("The activity could not be deleted.");
                        }
                    });
                }
            });
        }
    });

    return View;
});