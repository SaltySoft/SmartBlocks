define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryflip',
    'text!Apps/AppOrganizer/Templates/dashboard.html',
    "Apps/AppOrganizer/Collections/Blocks"
], function ($, _, Backbone, JqueryFlip, DashboardTemplate, BlocksCollection) {
    var Dashboard = Backbone.View.extend({
            tagName:"div",
            className:"k_ao_dashboard",
            events:{

            },
            initialize:function () {

            },
            init:function (AppEvents) {
                var base = this;
                this.AppEvents = AppEvents;

                base.blocks_collection = new BlocksCollection();
                base.blocks_collection.fetch({
                    data:{

                    },
                    success:function () {
                        base.render();
                    }
                });
            },
            render:function () {
                var base = this;
                var template = _.template(DashboardTemplate, {
                    blocks:base.blocks_collection.models,
                    kernel:"kernel"
                });

                base.$el.html(template);
                base.initializeEvents();
            },
            initializeEvents: function () {
                var base = this;
                base.$el.find(".dashboard_app").click(function () {
                    if ($(this).attr("data-flip") == 0) {
                        var randomNumber = Math.floor((Math.random() * 4) + 1);
                        var flipDir = 'tb';
                        if (randomNumber == 2)
                            flipDir = 'bt';
                        if (randomNumber == 3)
                            flipDir = 'lr';
                        if (randomNumber == 4)
                            flipDir = 'rl';

                        $(this).flip({
                            direction:flipDir,
                            color:$(this).css("background-color"),
                            content:$(this).attr("data-description"),
                            speed: 100
                        });
                        $(this).attr("data-flip", 1);
                    }
                    else {
                        $(this).revertFlip();
                        $(this).attr("data-flip", 0);
                    }
                });
                base.$el.find(".nameLink").click(function (e) {
                    e.stopPropagation();
                });

            }
        })
        ;

    return Dashboard;
});