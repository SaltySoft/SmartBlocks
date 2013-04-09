define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Schemas/Collections/Schemas',
    'text!Enterprise/Apps/Schemas/Templates/main_view.html',
    'text!Enterprise/Apps/Schemas/Templates/schemas_list.html',
    'Enterprise/Apps/Schemas/Views/DrawingView'

], function ($, _, Backbone, SchemasCollection, MainTemplate, SchemasListTemplate, DrawingView) {
    var MainView = Backbone.View.extend({
        tagName: "div",
        className: "ent_sch_mm",
        initialize: function () {

        },
        init: function (SmartBlocks, SchemaController) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.user_schemas = new SchemasCollection();
            base.controller = SchemaController;
            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(MainTemplate, {});

            base.$el.html(template);

            base.initializeEvents();
        },
        initializeEvents: function () {
            var base = this;
            base.fetchSchemas();

            base.$el.find(".ent_sch_mv_createdrawing_button").click(function () {
            });
        },
        fetchSchemas: function () {
            var base = this;
            console.log("Fetching schemas");
            base.user_schemas.fetch({
                data: {

                },
                success: function () {
                    var template = _.template(SchemasListTemplate, { schemas: base.user_schemas.models });
                    base.$el.find(".ent_sch_mv_shemas_container").html(template);
                    base.$el.find(".ent_sch_schema_button_tile").click(function () {
                        var elt = $(this);
                        var drawing_view = new DrawingView();
                        drawing_view.init(base.SmartBlocks, base.controller, elt.attr("data-id"));
                        base.controller.setContent(drawing_view.$el);
                    });
                }
            });
        }
    });

    return MainView;
});