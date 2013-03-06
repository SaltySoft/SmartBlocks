requirejs.config({
    baseUrl:'/Apps/UserManagement',
    paths:{
        jquery:"/javascript/jquery-1.9.1",
        underscore:"/javascript/underscore",
        backbone:"/javascript/backbone",
        text:"/javascript/text"

    },
    shim:{
        'underscore':{
            exports:'_'
        },
        'backbone':{
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        }
    }
});

requirejs(['app'],
    function (App) {
        App.initialize();
    });