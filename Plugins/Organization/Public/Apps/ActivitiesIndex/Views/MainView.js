define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    './ActivitySearchControls',
    'Organization/Apps/Common/Views/ActivityList',
    './ActivityPreview',
    'Organization/Apps/Common/Collections/ActivityTypes',
    'Organization/Apps/Common/Collections/Activities'
], function ($, _, Backbone, MainViewTemplate, ActivitySearchControlsView, ActivityListView, ActivityPreview, ActivityTypesCollection, ActivitiesCollection) {
    /**
     * Activities Index
     * Main View
     */
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activities_index_view",
        initialize: function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.activity_types = new ActivityTypesCollection();
            base.activities = new ActivitiesCollection();

            base.render();
            base.registerEvents();

            base.search_controls_view = new ActivitySearchControlsView();
            base.$el.find(".search_controls_container").html(base.search_controls_view.$el);
            base.search_controls_view.init(SmartBlocks, base);

            base.activities_list_view = new ActivityListView();
            base.$el.find(".activities_list_container").html(base.activities_list_view.$el);
            base.activities_list_view.init(SmartBlocks, base);

            base.activity_preview = new ActivityPreview();
            base.$el.find(".activity_preview_container").html(base.activity_preview.$el);
            base.activity_preview.init(SmartBlocks, base);

            base.loadActivityTypes();
            base.loadActivities();
        },
        loadActivityTypes: function () {
            var base = this;
            base.activity_types.fetch({
                success: function () {
                    base.events.trigger("activity_types_loaded");
                }
            });
        },
        loadActivities: function () {
            var base = this;
            base.activities.fetch({
                success: function () {
                    base.events.trigger("loaded_activities");
                }
            });
        },
        render: function () {
            var base = this;
            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
            base.SmartBlocks.events.on("org_new_activity", function (activity) {
                base.activities.add(activity);

                base.events.trigger("loaded_activities");
            });

            base.events.on("load_list_with_params", function (params) {
                base.activities.fetch({
                    data: params,
                    success: function () {
                        base.events.trigger("loaded_activities");
                    }
                });
            });
        }
    });
    return View;
});