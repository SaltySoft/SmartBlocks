define([
    'jquery',
    'underscore',
    'backbone',
    'FileSharing/router'
], function ($, _, Backbone, Router) {
    var initialize = function () {
        Router.initialize();
    };
    return {
        initialize:initialize
    };
});