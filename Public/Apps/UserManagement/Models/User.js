define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var User = Backbone.Model.extend({
        urlRoot: "/Users",
        defaults: {
            username: "unregistered"
        }
    });

    return User;
});

