var sb_paths  = {
    jquery:"/javascript/jquery-1.9.1",
    underscore:"/javascript/underscore",
    backbone:"/javascript/backbone",
    text:"/javascript/text",
    default: "/javascript/default",
    jqueryui:"/javascript/jquery-ui-1.10.1.min",
    SmartBlocks:"/javascript/SmartBlocks",

    UserModel:"/Apps/Common/Models/User",
    JobModel:"/Apps/Common/Models/Job",
    GroupModel:"/Apps/Common/Models/Group",
    UsersCollection:"/Apps/Common/Collections/Users",
    JobsCollection:"/Apps/Common/Collections/Jobs",
    GroupsCollection:"/Apps/Common/Collections/Groups",

    TabView:"/Apps/Common/Views/TabView",
    TabsTemplate:"/Apps/Common/Templates/tabs.html"

};

var sb_shims = {
    'underscore':{
    exports:'_'
},
    'backbone':{
    deps:['underscore', 'jquery'],
        exports:'Backbone'
}
};