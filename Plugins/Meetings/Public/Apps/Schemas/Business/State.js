define([
    'jquery',
    'underscore',
    'backbone',
    'Class',
    'Meetings/Apps/Schemas/Models/Schema',
    'Meetings/Apps/Schemas/Models/SchemaText',
    'Meetings/Apps/Schemas/Collections/SchemaTexts',
    'jDeepCopy'
], function ($, _, Backbone, Class, Schema, TextOverlay, TextOverlaysCollection) {
    var State = new Class();

    State.include({
        init: function (schema, image) {
            var base = this;
            base.test = new Date().getMilliseconds();
            base.schema = new Schema($.extend_deep(true, {}, schema.attributes));
            base.texts = new Array();
            base.schema.set("texts", new TextOverlaysCollection());
            for (var k in schema.attributes.texts.models) {
                var text = new TextOverlay($.extend_deep(true, {}, schema.attributes.texts.models[k].attributes));
                base.schema.get("texts").add(text);
            }

            base.image = image;
        },
        getSchema: function () {
            var base = this;
            return base.schema;
        },
        getImage: function () {
            var base = this;
            return base.image;
        }
    });

    return State;
});