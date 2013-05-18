define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Calendar/launcher'
], function ($, _, Backbone, Launcher) {

    var init = function (SmartBlocks) {
        Launcher.init(SmartBlocks);
    };

    return {
        initialize: init
    };
});