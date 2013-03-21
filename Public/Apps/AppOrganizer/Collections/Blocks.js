define([
    "underscore",
    "backbone",
    "Apps/AppOrganizer/Models/Block",
    "Apps/AppOrganizer/Models/Application"
], function (_, Backbone, Block, Application) {
    var BlocksCollection = Backbone.Collection.extend({
        url:"/Blocks",
        model:Block,
        parse:function (response, status) {
            for (var k in response) {
                var apps = response[k].apps;
                var applications = [];

                for (var i in apps) {
                    var application = new Application(apps[i]);
                    applications.push(application);
                }

                response[k].apps = applications;
            }
            console.log(response);
            return response;
        }
    });

    return BlocksCollection;
});