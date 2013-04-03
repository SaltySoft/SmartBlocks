define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Schemas/Views/DrawingView'
], function ($, _, Backbone, DrawingView) {
    var initialize = function (SmartBlocks) {
        var drawing_view = new DrawingView();
        drawing_view.init(SmartBlocks, 24);
        $("#schema_app_container").html(drawing_view.$el);
    };

    return {
        init: initialize
    };
});