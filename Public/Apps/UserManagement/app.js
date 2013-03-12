define([
    'jquery',
    'underscore',
    'backbone',
    'UserManagement/router'
], function ($, _, Backbone, Router) {
    var initialize = function () {

        Router.initialize();
    };
    return {
        initialize:initialize
    };
});