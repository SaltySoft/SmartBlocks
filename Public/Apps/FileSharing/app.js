define([
    'jquery',
    'underscore',
    'backbone',
    'FileSharing/router'
], function ($, _, Backbone, Router) {
    var initialize = function (SmartBlocks) {
        Router.initialize(SmartBlocks);
    };
    return {
        initialize:initialize
    };
});