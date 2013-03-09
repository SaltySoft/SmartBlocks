define([
    'underscore',
    'backbone',
    'Models/Group'
], function (_, Backbone, Group) {
    var GroupsCollection = Backbone.Collection.extend({
        model: Group,
        url: "/Groups"
    });

    return GroupsCollection;
});