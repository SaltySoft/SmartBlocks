requirejs.config({
    baseUrl:'/Apps',
    paths:sb_paths,
    shim:sb_shims
});

/*Fill with default apps (file sharing and chat)*/
var apps = ["Chat/app", "FileSharing/app"];

if (app !== undefined) {
    apps.push(app);
}


requirejs(apps,
    function (/*defaults, */ChatApp, FileSharingApp, App) {
        ChatApp.initialize();
        FileSharingApp.initialize();
        if (App)
            App.initialize();
    });