define([
    'jquery',
    'underscore',
    'backbone',
    'text!/Apps/FileSharing/Templates/main_view.html',
    '/Apps/FileSharing/Views/FolderBrowser.js',
    '/Apps/FileSharing/Views/Controls.js'
], function ($, _, Backbone, MainViewTemplate, FolderBrowserView, ControlsView) {
    var MainView = Backbone.View.extend({
        tagName: "div",
        className:"k_fs_main_view",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();

        },
        render: function () {
            var base = this;
            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);

            var folder_browser = new FolderBrowserView();
            folder_browser.init(base.SmartBlocks);
            base.$el.find(".k_fs_folder_browser_container").html(folder_browser.$el);

            var controls_view = new ControlsView();
            controls_view.init(base.SmartBlocks, folder_browser);
            base.$el.find(".k_fs_dragdrop_container").html(controls_view.$el);
        }
    });

    return MainView;
});