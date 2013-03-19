define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Application = Backbone.Model.extend({
        defaults: {
            "logoUrl":"/Public/images/logo.png"
        }
    });

    return Application;
});