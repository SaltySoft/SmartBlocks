define([
    'jquery',
    'underscore',
    'backbone',
    'Chat/router'
], function ($, _, Backbone, Router) {
    var initialize = function () {

        Router.initialize();
    };
    return {
        initialize:initialize
    };
});