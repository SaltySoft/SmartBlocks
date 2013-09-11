define([
    'jquery',
    'underscore',
    'backbone',
    'ProjectManagement/Apps/CostsManagement/Views/CostsManagement'
], function ($, _, Backbone, CostsManagementView) {

    var initialize = function (SmartBlocks) {
        var costsManagement = new CostsManagementView();
        costsManagement.init(SmartBlocks);

        $("#app_container").html(costsManagement.$el);

        Backbone.history.start();
    };

    return {
        initialize:initialize
    };
});