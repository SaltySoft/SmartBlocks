define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Schemas/Views/DrawingView',
    'Enterprise/Apps/Schemas/Views/MainView'
], function ($, _, Backbone, DrawingView, MainView) {
    var initialize = function (SmartBlocks) {


//        var drawing_view = new DrawingView();
//        drawing_view.init(SmartBlocks, 24);
//        $("#schema_app_container").html(drawing_view.$el);

        var SchemasController = {
            main_view: null,
            setContent: function (element) {
                $("#schema_app_container").html(element);
            },
            Menu: function () {
                SchemasController.main_view = new MainView();
                SchemasController.main_view.init(SmartBlocks, SchemasController);
                SchemasController.setContent(SchemasController.main_view.$el)
            }
        };

        SchemasController.Menu();

    };

    return {
        init: initialize
    };
});