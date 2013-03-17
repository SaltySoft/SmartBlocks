define([
    'underscore',
    'backbone'
], function (_, Backbone){
   var File = Backbone.Model.extend({
       urlRoot: "/Files",
       defaults: {
       },
       parse: function (response, options) {
           console.log(response);

           return response;
       }
   });

    return File;
});