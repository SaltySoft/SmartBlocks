define([
    "underscore",
    "backbone",
    "Enterprise/Apps/Schemas/Models/SchemaText"
], function (_, Backbone, SchemaText) {
    var SchemaTextsColletion = Backbone.Collection.extend({
        model: SchemaText,
        url: "/Enterprise/SchemaTexts"
    });

    return SchemaTextsColletion;
});