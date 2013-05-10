define([
    'jquery',
    'underscore',
    'underscore_string',
    'backbone',
    'Meetings/Apps/Schemas/Collections/Schemas',
    'Meetings/Apps/Schemas/Models/Schema',
    'text!Meetings/Apps/Schemas/Templates/main_view.html',
    'text!Meetings/Apps/Schemas/Templates/schemas_list.html',
    'Meetings/Apps/Schemas/Views/DrawingView',
    'Meetings/Apps/Schemas/Views/CreationView',
    'ContextMenuView'

], function ($, _, _s,Backbone, SchemasCollection, Schema, MainTemplate, SchemasListTemplate, DrawingView, CreationView, ContextMenu) {
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
                var creation_view = new CreationView();
                creation_view.init(base.SmartBlocks, base);
                creation_view.show();
            });


        },
        fetchSchemas: function (callback) {
            var base = this;
            console.log("Fetching schemas");
            base.user_schemas.fetch({
                data: {

                },
                success: function () {
                    var template = _.template(SchemasListTemplate, { schemas: base.user_schemas.models, _s: _s });
                    base.$el.find(".ent_sch_mv_shemas_container").html(template);
                    base.$el.find(".text_on_hover").mouseenter(function (e) {
                        var elt = $(this);
                        var info =  base.$el.find("#informations");
                        info.html(elt.attr("data-text"));
                        info.show();
                    });


                    base.$el.find(".text_on_hover").mousemove(function (e) {
                        var info =  base.$el.find("#informations")
                        info.css("left", e.pageX - 30 );
                        info.css("top", e.pageY );
                    });

                    base.$el.find(".text_on_hover").mouseout(function (e) {
                        var info =  base.$el.find("#informations")
                        info.hide();
                    });

                    base.$el.find(".ent_sch_schema_button_tile").mouseup(function (e) {
                        var elt = $(this);
                        if (e.which == 1) {


                            var drawing_view = new DrawingView();
                            drawing_view.init(base.SmartBlocks, base.controller, elt.attr("data-id"));
                            base.controller.setContent(drawing_view.$el);
                        }
                        if (e.which == 3) {
                            var cxt = new ContextMenu();
                            cxt.addButton("Delete", function () {
                                if (confirm("Are you sure you want to delete this drawing ?")) {
                                    var schema = new Schema({ id: elt.attr("data-id")});
                                    base.SmartBlocks.startLoading("Deleting schema");
                                    schema.destroy({
                                        success: function () {
                                            base.fetchSchemas(function () {
                                                base.SmartBlocks.stopLoading();
                                            });
                                        }
                                    });
                                }
                            });
                            cxt.addButton("Properties", function () {

                            });
                            cxt.show(e);
                        }
                        e.stopPropagation();
                        e.preventDefault();
                        return false;

                    });
                    if (callback !== undefined)
                        callback();
                }
            });
        }
    });

    return MainView;
});