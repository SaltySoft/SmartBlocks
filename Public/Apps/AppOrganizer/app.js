define([
    'jquery',
    'underscore',
    'backbone',
    'AppOrganizer/router'
], function ($, _, Backbone, Router) {
    var initialize = function () {

        Router.initialize();
    };
    return {
        initialize:initialize
    };
});