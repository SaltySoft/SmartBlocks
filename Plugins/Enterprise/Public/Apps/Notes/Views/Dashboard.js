define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryflip',
    'Enterprise/Apps/Notes/Views/Panel',
    'text!Enterprise/Apps/Notes/Templates/dashboard.html'
], function ($, _, Backbone, JqueryFlip, PanelView, DashboardTemplate) {
    var Dashboard = Backbone.View.extend({
        tagName:"div",
        className:"ent_notes_dashboard",
        events:{

        },
        initialize:function () {

        },
        init:function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;

            var template = _.template(DashboardTemplate, {
                enterprise:"enterprise"
            });

            var notes_panel = new PanelView();
            notes_panel.init(this.AppEvents);
            notes_panel.render();
            base.$el.html(notes_panel.$el);
            base.$el.append(template);
        },
        render:function () {
            var base = this;

            base.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;

        }
    });
    return Dashboard;
});