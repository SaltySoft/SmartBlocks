define([
    "underscore",
    "backbone"
], function (_, Backbone) {
    var SchemaText = Backbone.Model.extend({
        urlRoot: "/Meetings/SchemaTexts",
        defaults: {
        }
    });

    return SchemaText;
});