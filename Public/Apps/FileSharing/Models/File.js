define([
    'underscore',
    'backbone'
], function (_, Backbone){
   var File = Backbone.Model.extend({
       urlRoot: "/Files",
       defaults: {
       },
       parse : function (response) {

           var parent_f_object = response.parent_folder;
           var parent_folder = new File(parent_f_object);
           response.parent_folder = parent_folder;
           console.log(response);
           return response;
       }
   });

    return File;
});