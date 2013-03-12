requirejs.config({
    baseUrl:'/Apps',
    paths:sb_paths,
    shim:sb_shims
});

/*Fill with default apps (file sharing and chat)*/
var apps = ["Chat/app"];

if (app !== undefined) {
    apps.push(app);
}


requirejs(apps,
    function (/*defaults, */ChatApp, App) {
        ChatApp.initialize();
        if (App)
            App.initialize();
    });