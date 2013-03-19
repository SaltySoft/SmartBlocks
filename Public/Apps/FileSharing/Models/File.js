define([
    'underscore',
    'backbone'
], function (_, Backbone){
   var File = Backbone.Model.extend({
       urlRoot: "/Files",
       defaults: {
       }
   });

    return File;
});