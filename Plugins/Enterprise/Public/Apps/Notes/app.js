define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/launcher'
], function ($, _, Backbone, Launcher) {
    var initialize = function () {

        Launcher.initialize();
    };
    return {
        initialize:initialize
    };
});