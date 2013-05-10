define([
    'underscore',
    'backbone',
    'Meetings/Apps/Schemas/Models/Schema'
], function (_, Backbone, Schema) {
    var SchemasColletion = Backbone.Collection.extend({
        model: Schema,
        url: "/Meetings/Schemas"
    });

    return SchemasColletion
});