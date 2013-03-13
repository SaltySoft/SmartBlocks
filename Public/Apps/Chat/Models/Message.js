define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Message = Backbone.Model.extend({
        urlRoot: "/Messages",
        defaults: {
        },
        parse: function (response, options) {
            console.log(response);
            console.log(" HAAHA");

            return response;
        }
    });

    return Message;
});

