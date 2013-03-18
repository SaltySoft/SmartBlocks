define([
    'jquery',
    'underscore',
    'underscore_string',
    'backbone',
    'FileSharing/Models/Folder',
    'FileSharing/Models/File',
    'text!/Apps/FileSharing/Templates/folder_browser.html',
    '/Apps/FileSharing/Collections/Folders.js',
    '/Apps/FileSharing/Collections/Files.js',
    'FileSharing/Views/FileUpload',
    'FileSharing/Views/FolderCreation',
    'FileSharing/Views/FolderProperties',
    'ContextMenuView'
], function ($, _, _s, Backbone, Folder, File, FolderBrowserTemplate, FoldersCollection, FilesCollection, FileUploadView, FolderCreationView, FolderPropertiesView, ContextMenuView) {
    console.log(_s);
    var FolderBrowser = Backbone.View.extend({
        tagName: "div",
        className: "k_fs_folder_browser",
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.folder_list = new FoldersCollection();
            base.files_list = new FilesCollection();
            base.parent_folder = 0;
            base.current_folder = 0;
            SmartBlocks.events.on("ws_notification", function (message) {
                console.log(message);
                if (message.app == "k_fs") {

                    if (message.status == "changed_directory")
                    {
                        if (message.folder_id == base.current_folder) {
                            base.reload();
                        }
                    }
                }

            });

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
                                var folder = new Folder({id: elt.attr("data-folder_id")});
                                folder.destroy({
                                    success: function () {
                                        base.fetchAll(base.current_folder);
                                    }
                                });
                            }
                        }, '/images/icons/cross.png');
                        context_menu.addButton("Properties", function () {
                            var folder_properties = new FolderPropertiesView({ model: new Folder({id: elt.attr('data-folder_id')}) });
                            folder_properties.init(base.SmartBlocks, base);
                            $("body").prepend(folder_properties.$el);
                        }, '/images/icons/folder_wrench.png');
                        context_menu.show(e);
                        break;
                    default:
                        break;
                }
            });

            base.$el.find(".k_fs_file_tb").dblclick(function (e) {
                var elt = $(this);
                if (elt.attr("data-file_id") != undefined) {
                    window.location = "/Files/get_file/" + elt.attr("data-file_id");
                    window.focus();
                }
            });

            base.$el.find(".k_fs_file_tb").mousedown(function (e) {
                var elt = $(this);
                switch (e.which) {
                    case 3:
                        var context_menu = new ContextMenuView();
                        context_menu.addButton("Download", function () {
                            if (elt.attr("data-file_id") != undefined) {
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

            $(".k_fs_parent_folder").click(function () {
                var elt = $(this);
                base.fetchAll(base.parent_folder);
            });


        },
        render: function () {
            var base = this;
            var template = _.template(FolderBrowserTemplate, {_s: _s, files: base.files_list.models, folders: base.folder_list.models});

            base.$el.html(template);
            base.initializeEvents();
        },
        reload: function () {
            var base = this;
            base.fetchAll(base.current_folder);
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

            var fc_view = new FolderCreationView();
            fc_view.init(base.SmartBlocks, base);
            $("body").prepend(fc_view.$el);


        },

        uploadFile: function () {
            var base = this;
            var file_upload_view = new FileUploadView();
            file_upload_view.init(base.SmartBlocks, base);
            $("body").prepend(file_upload_view.$el);
        }

    });

    return FolderBrowser;
});