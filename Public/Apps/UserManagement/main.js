requirejs.config({
    baseUrl:'/Apps/UserManagement',
    paths:sb_paths,
    shim:sb_shims
});

requirejs(['app'],
    function (App) {
        App.initialize();
    });
