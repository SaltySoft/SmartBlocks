define([
    'jquery',
    'underscore',
    'backbone',
    'Apps/UserManagement/router'
], function ($, _, Backbone, Router) {
    var initialize = function () {

        Router.initialize();
    };
    return {
        initialize:initialize
    };
});