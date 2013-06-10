define([
    'jquery',
    'underscore',
    'backbone',
    'ProjectManagement/Apps/WorkingHours/launcher'
], function ($, _, Backbone, Launcher) {
    var initialize = function (SmartBlocks) {

        Launcher.initialize(SmartBlocks);
    };
    return {
        initialize:initialize
    };
});