define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/launcher'
], function ($, _, Backbone, Launcher) {

    var init = function (SmartBlocks) {
        Launcher.init(SmartBlocks);
    };


    return {
        initialize: init
    };
});