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

            //AppBlock
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

            //Apps
            $(apps).each(function () {
                var app = $(document.createElement("div"));
                app.addClass("app_container");
                var app_name = $(document.createElement("div"));
                app_name.addClass("app_name");
                app_name.html(this.name);
                app.append(app_name);
                var app_description = $(document.createElement("div"));
                app_description.addClass("app_description");
                app_description.html(this.description);
                app.append(app_description);
                var app_link = $(document.createElement("div"));
                app_link.addClass("app_link");
                app_link.html(this.link);
                app.append(app_link);
                appBlock.append(app);
            });
            base.$el.find(".blocks_container").append(appBlock);
        }
    });

    return Dashboard;
});