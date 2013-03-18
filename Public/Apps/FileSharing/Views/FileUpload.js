define([
    'jquery',
    'underscore',
    'backbone',
    'text!/Apps/FileSharing/Templates/file_upload.html'
], function ($, _, Backbone, FileUploadTemplate) {
    var FileUploadView = Backbone.View.extend({
        tagName: "div",
        className: "k_fs_file_upload",
        initialize: function () {

        },
        init: function (SmartBlocks, parent_folder_id) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent_folder_id = parent_folder_id;
            base.render();
        },
        render: function () {
            var base = this;
            base.$el.addClass("cache");
            var container = $(document.createElement("div"));
            container.addClass("file_upload_form");
            base.$el.append(container);

            var template = _.template(FileUploadTemplate, { parent_folder_id:base.parent_folder_id  });
            container.html(template);
        },
        initializeEvents: function () {
            var base = this;
        }
    });

    return FileUploadView
});