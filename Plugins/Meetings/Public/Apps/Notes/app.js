define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/launcher'
], function ($, _, Backbone, Launcher) {
    var initialize = function (SmartBlocks) {

        Launcher.initialize(SmartBlocks);
    };
    return {
        initialize:initialize
    };
});