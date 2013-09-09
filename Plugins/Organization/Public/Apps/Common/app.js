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
        console.log("Calling todoist sync");
        $.ajax({
            url:"/Organization/Tasks/todoist_sync",
            success:function (data, status) {
                    console.log("todoist_synced", data);
            }
        });
        console.log("Calling gcal sync");
        $.ajax({
            url:"/Organization/Tasks/gcal_sync",
            success:function (data, status) {
                    console.log("gcal_synced", data);
            }
        });
    };

    return {
        initialize:init,
        sync:sync
    };
});