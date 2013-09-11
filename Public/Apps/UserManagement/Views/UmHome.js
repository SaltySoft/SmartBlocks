define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/UserManagement/Templates/home.html'
], function ($, _, Backbone, HomeTemplate) {
    var UmHome = Backbone.View.extend({
        tagName: "div",
        className: "k_um_home",
        initialize: function () {

        },
        init:function (AppEvents) {
            this.AppEvents = AppEvents;
            this.render();
        },
        render: function () {
            var template = _.template(HomeTemplate, {});
            this.$el.html(template);
            return this;
        }
    });

    return UmHome;
});