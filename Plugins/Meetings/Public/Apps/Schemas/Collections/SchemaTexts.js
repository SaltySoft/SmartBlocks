define([
    "underscore",
    "backbone",
    "Meetings/Apps/Schemas/Models/SchemaText"
], function (_, Backbone, SchemaText) {
    var SchemaTextsColletion = Backbone.Collection.extend({
        model: SchemaText,
        url: "/Meetings/SchemaTexts"
    });

    return SchemaTextsColletion;
});