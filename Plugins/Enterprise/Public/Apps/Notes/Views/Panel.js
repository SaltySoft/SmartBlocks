define([
    'jquery',
    'underscore',
    'backbone',
    'text!Enterprise/Apps/Templates/panel.html'
], function ($, _, Backbone, PanelTemplate) {
    var PanelView = Backbone.View.extend({
        tagName:"div",
        className:"ent_notes_panel",
        events:{

        },
        initialize:function () {

        },
        init:function (AppEvents) {
            this.AppEvents = AppEvents;
            this.render();
        },
        render:function () {
            var base = this;
            var template = _.template(TabsTemplate, {
            });
            base.$el.html(template);

            var control_button_li = $(document.createElement("li"));
            control_button_li.addClass("panel_button");
            var control_button = $(document.createElement("a"));
            control_button.attr("href", "javascript:void(0);");
            control_button.html("toutes");

        },
        show:function () {

        }
    });

    return PanelView;
});