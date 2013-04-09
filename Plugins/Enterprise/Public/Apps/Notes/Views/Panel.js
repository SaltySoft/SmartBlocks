define([
    'jquery',
    'underscore',
    'backbone',
    'text!Enterprise/Apps/Notes/Templates/panel.html'
], function ($, _, Backbone, PanelTemplate) {
    var PanelView = Backbone.View.extend({
        tagName:"div",
        className:"ent_notes_panel",
        events:{

        },
        initialize:function () {

        },
        init:function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;
        },
        render:function () {
            var base = this;
            var template = _.template(PanelTemplate, {
            });
            base.$el.html(template);

            var control_button_li = $(document.createElement("li"));
            control_button_li.addClass("panel_button");
            var control_button = $(document.createElement("a"));
            control_button.addClass("panel_button_link");
            control_button.attr("href", "#create_note");
            control_button.html("Create a note");
            control_button_li.append(control_button);
            base.$el.find(".panel_container").append(control_button_li);

            var control_button_li = $(document.createElement("li"));
            control_button_li.addClass("panel_button");
            var control_button = $(document.createElement("a"));
            control_button.addClass("panel_button_link");
            control_button.attr("href", "#show_all");
            control_button.html("All");
            control_button_li.append(control_button);
            base.$el.find(".panel_container").append(control_button_li);

            var control_button_li = $(document.createElement("li"));
            control_button_li.addClass("panel_button");
            var control_button = $(document.createElement("a"));
            control_button.addClass("panel_button_link");
            control_button.attr("href", "#show_importants");
            control_button.html("Importants");
            control_button_li.append(control_button);
            base.$el.find(".panel_container").append(control_button_li);
        },
        show:function () {

        }
    });

    return PanelView;
});