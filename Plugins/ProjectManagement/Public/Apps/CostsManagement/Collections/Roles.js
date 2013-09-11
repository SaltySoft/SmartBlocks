define([
    "underscore",
    "backbone",
    'ProjectManagement/Apps/CostsManagement/Models/Role'
], function (_, Backbone, Role) {
    var RolesCollection = Backbone.Collection.extend({
        url:"/ProjectManagement/Roles",
        model:Role
    });

    return RolesCollection;
});