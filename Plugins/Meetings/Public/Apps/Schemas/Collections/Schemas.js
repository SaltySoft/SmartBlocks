define([
    'underscore',
    'backbone',
    'Enterprise/Apps/Schemas/Models/Schema'
], function (_, Backbone, Schema) {
    var SchemasColletion = Backbone.Collection.extend({
        model: Schema,
        url: "/Enterprise/Schemas"
    });

    return SchemasColletion
});