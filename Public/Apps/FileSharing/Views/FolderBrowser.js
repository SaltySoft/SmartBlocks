define([
    'jquery',
    'underscore',
    'backbone',
    'FileSharing/Models/Folder',
    'FileSharing/Models/File',
    'text!/Apps/FileSharing/Templates/folder_browser.html',
    '/Apps/FileSharing/Collections/Folders.js',
    '/Apps/FileSharing/Collections/Files.js',
    'FileSharing/Views/FileUpload',
    'ContextMenuView'
], function ($, _, Backbone, Folder, File, FolderBrowserTemplate, FoldersCollection, FilesCollection, FileUploadView, ContextMenuView) {
    var FolderBrowser = Backbone.View.extend({
        tagName: "div",
        className: "k_file_sharing_choose_file",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.folder_list = new FoldersCollection();
            base.files_list = new FilesCollection();
            base.parent_folder = 0;
            base.current_folder = 0;
            base.fetchAll(0);
        },
        initializeEvents: function () {
            var base = this;
            base.$el.attr("oncontextmenu", "return false;");
            base.$el.find(".k_fs_thumbnail").disableSelection();

            base.$el.find(".k_fs_folder_tb").dblclick(function () {
                var elt = $(this);
                base.fetchAll(elt.attr("data-folder_id"));
            });

            base.$el.find(".k_fs_folder_tb").mousedown(function (e) {
                var elt = $(this);
                switch (e.which) {
                    case 3:
                        var context_menu = new ContextMenuView();
                        context_menu.addButton("Open", function () {
                            base.fetchAll(elt.attr("data-folder_id"));
                        }, '/images/icons/folder_go.png');
                        context_menu.addButton("Delete", function () {
                            if (confirm("Are you sure you want to delete that folder and all the files in it ?")) {
                                var folder = new Folder({id:elt.attr("data-folder_id")});
                                folder.destroy({
                                    success: function () {
                                        base.fetchAll(base.current_folder);
                                    }
                                });
                            }
                        }, '/images/icons/cross.png');
                        context_menu.addButton("Properties", function () {

                        }, '/images/icons/folder_wrench.png');
                        context_menu.show(e);
                        break;
                    default:
                        break;
                }
            });

            base.$el.find(".k_fs_file_tb").mousedown(function (e) {
                var elt = $(this);
                switch (e.which) {
                    case 3:
                        var context_menu = new ContextMenuView();
                        context_menu.addButton("Download", function () {
                            if (elt.attr("data-file_id") != undefined)
                            {
//                                window.open(
//                                    "/Files/get_file/" + elt.attr("data-file_id")
//                                );
                                window.location = "/Files/get_file/" + elt.attr("data-file_id");
                                window.focus();
                            }

                        }, '/images/icons/folder_go.png');
                        context_menu.addButton("Delete", function () {
                            if (confirm("Are you sure you want to delete that file ?")) {
                                var file = new File({ id: elt.attr("data-file_id")});
                                file.destroy({
                                    success: function () {
                                        base.fetchAll(base.current_folder);
                                    }
                                });
                            }
                        }, '/images/icons/cross.png');
                        context_menu.show(e);
                        break;
                    default:
                        break;
                }
            });

            base.$el.find(".k_fs_parent_folder_button").click(function () {
                var elt = $(this);
                base.fetchAll(base.parent_folder);
            });


        },
        render: function () {
            var base = this;
            var template = _.template(FolderBrowserTemplate, {files: base.files_list.models, folders: base.folder_list.models});

            base.$el.html(template);
            base.initializeEvents();
        },
        fetchAll: function (folder_id, callback) {
            var base = this;
            if (base.$el.is(":visible"))
                base.SmartBlocks.startLoading("Loading folder");
            base.fetchFolders(folder_id, function () {
                base.fetchFiles(folder_id, function () {
                    if (base.current_folder != folder_id) {
                        base.parent_folder = base.current_folder;
                        base.current_folder = folder_id;
                    }

                    base.render();
                    base.SmartBlocks.stopLoading();
                });
            });
        },
        fetchFolders: function (folder_id, callback) {
            var base = this;
            base.folder_list.fetch({
                data: {
                    "folder_id": folder_id
                },
                success: function () {
                    if (callback) {
                        callback();
                    }

                }
            });
        },
        fetchFiles: function (folder_id, callback) {
            var base = this;
            base.files_list.fetch({
                data: {
                    "folder_id": folder_id
                },
                success: function () {
                    if (callback) {
                        callback();
                    }
                }
            });
        },
        createFolder: function () {
            var base = this;
            var folder = new Folder({
                name: "sample",
                creator: base.SmartBlocks.current_user,
                parent_folder: base.current_folder
            });
            base.SmartBlocks.startLoading("Creating folder");
            folder.save({}, {
                success: function () {
                    base.SmartBlocks.stopLoading();
                    console.log(folder);
                    base.fetchAll(base.current_folder);
                }
            });
        },
        uploadFile: function () {
            var base = this;
            var file_upload_view = new FileUploadView();
            file_upload_view.init(base.SmartBlocks, base.current_folder);
            $("body").prepend(file_upload_view.$el);
        }

    });

    return FolderBrowser;
});