define([
    "underscore",
    "backbone"
], function (_, Backbone) {
    var SchemaText = Backbone.Model.extend({
        urlRoot: "/Enterprise/SchemaTexts",
        defaults: {
        }
    });

    return SchemaText;
});