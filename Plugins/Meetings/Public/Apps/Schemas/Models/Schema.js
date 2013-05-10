define([
    'underscore',
    'backbone',
    'Meetings/Apps/Schemas/Models/SchemaText',
    'Meetings/Apps/Schemas/Collections/SchemaTexts'
], function (_, Backbone, SchemaText, SchemaTextsCollection) {
    var Schema = Backbone.Model.extend({
        urlRoot: "/Meetings/Schemas",
        defaults: {
        },
        parse: function (response, option) {
            var schema_texts = response.texts;
            var texts_array = new SchemaTextsCollection();
            for (var k in schema_texts) {
                var text = new SchemaText(schema_texts[k]);
                texts_array.add(text);
            }
            response.texts = texts_array;
            return response;
        }
    });

    return Schema;
});