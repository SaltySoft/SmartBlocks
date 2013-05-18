define([
    'jquery',
    'underscore',
    'backbone',
    './launcher'
], function ($, _, Backbone, Launcher) {

    var init = function (SmartBlocks) {
        Launcher.init(SmartBlocks);
    };

    return {
        initialize: init
    };
});