define([
    'jquery',
    'underscore',
    'backbone',
    'Meetings/Apps/Schemas/launcher'
], function ($, _, Backbone, Launcher) {

    var init = function (SmartBlocks) {
        Launcher.init(SmartBlocks);
    };


    return {
        initialize: init
    };
});