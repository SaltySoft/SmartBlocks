define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryflip',
    'text!Enterprise/Apps/Notes/Templates/dashboard.html'
], function ($, _, Backbone, JqueryFlip, DashboardTemplate) {
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

        },
        render:function () {
            var base = this;
            var template = _.template(DashboardTemplate, {
                enterprise:"enterprise"

            });

            base.$el.html(template);
            base.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;

        }
    });
    return Dashboard;
});