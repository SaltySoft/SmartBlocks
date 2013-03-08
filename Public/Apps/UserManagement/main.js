requirejs.config({
    baseUrl:'/Apps/UserManagement',
    paths:{
        jquery:"/javascript/jquery-1.9.1",
        underscore:"/javascript/underscore",
        backbone:"/javascript/backbone",
        text:"/javascript/text",
        default: "/javascript/default",
        jqueryui:"/javascript/jquery-ui-1.10.1.min"

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