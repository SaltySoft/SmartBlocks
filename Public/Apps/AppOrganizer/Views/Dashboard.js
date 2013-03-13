define([
    'jquery',
    'underscore',
    'backbone',
    'text!AppOrganizer/Templates/dashboard.html'
], function ($, _, Backbone, DashboardTemplate) {
    var Dashboard = Backbone.View.extend({
        tagName:"div",
        className:"k_ao_dashboard",
        initialize:function () {

        },
        init:function (AppEvents) {
            this.AppEvents = AppEvents;
            this.render();
        },
        render:function () {
            var template = _.template(DashboardTemplate, {});
            this.$el.html(template);
            return this;
        }
    });

    return Dashboard;
});