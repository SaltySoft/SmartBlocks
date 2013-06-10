define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/launcher'
], function ($, _, Backbone, Launcher) {

    var init = function (SmartBlocks) {
        Launcher.init(SmartBlocks);
    };

    return {
        initialize: init
    };
});