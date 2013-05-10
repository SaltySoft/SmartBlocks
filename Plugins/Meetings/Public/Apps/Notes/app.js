define([
    'jquery',
    'underscore',
    'backbone',
    'Meetings/Apps/Notes/launcher'
], function ($, _, Backbone, Launcher) {
    var initialize = function (SmartBlocks) {

        Launcher.initialize(SmartBlocks);
    };
    return {
        initialize:initialize
    };
});