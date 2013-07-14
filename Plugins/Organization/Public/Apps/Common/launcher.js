define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Views/OrganizationView',
    'Organization/Apps/Calendar/Views/MainView',
    'Organization/Apps/Tasks/Views/MainView'
], function ($, _, Backbone, OrganizationView, CalendarView, WeekView) {
    var initialize = function (SmartBlocks) {
        var org_view = new OrganizationView();
        $("#app_container").html(org_view.$el);
        org_view.init(SmartBlocks);
    };

    return {
        init:initialize
    };
});