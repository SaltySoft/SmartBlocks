define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/launcher'
], function ($, _, Backbone, Launcher) {

    var init = function (SmartBlocks) {
        Launcher.init(SmartBlocks);


    };

    var sync = function () {


            $.ajax({
                url: "/Organization/Tasks/todoist_sync",
                success: function (data, status) {
//                    console.log("todoist_synced", data);
                }
            });
    };

    return {
        initialize: init,
        sync: sync
    };
});