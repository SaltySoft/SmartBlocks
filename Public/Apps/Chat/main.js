requirejs.config({
    baseUrl:'/Apps/Chat',
    paths:sb_paths,
    shim:sb_shims
});

requirejs(['app'],
    function (App) {
        App.initialize();
    });