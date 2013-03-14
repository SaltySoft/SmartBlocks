define([
    'jquery',
    'underscore',
    'backbone',
    'text!AppOrganizer/Templates/dashboard.html'
], function ($, _, Backbone, DashboardTemplate) {
    var Dashboard = Backbone.View.extend({
        tagName:"div",
        className:"k_ao_dashboard",
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
            var template = _.template(DashboardTemplate, {});
            base.$el.html(template);
        },
        addAppBlock:function (name, description, apps) {
            var base = this;

            var appBlock = $(document.createElement("div"));
            appBlock.addClass("appBlock_container");
            var block_name = $(document.createElement("div"));
            block_name.addClass("appBlock_name");
            block_name.html(name);
            appBlock.append(block_name);
            var block_description = $(document.createElement("div"));
            block_description.addClass("appBlock_description");
            block_description.html(description);
            appBlock.append(block_description);

            base.$el.find(".blocks_container").append(appBlock);
        }
    });

    return Dashboard;
});