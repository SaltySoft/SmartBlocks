define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Schema = Backbone.Model.extend({
        urlRoot: "/Enterprise/Schemas",
        defaults: {
        }
    });

    return Schema;
});