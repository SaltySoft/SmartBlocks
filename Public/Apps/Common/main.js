requirejs.config({
    baseUrl:'/Apps',
    paths:sb_paths,
    shim:sb_shims
});

/*Fill with default apps (file sharing and chat)*/
var apps = [];

if (app) {
    apps.push(app);
}


requirejs(apps,
    function (/*defaults, */App) {
        if (App)
            App.initialize();
    });