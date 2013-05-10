define([
    'underscore',
    'backbone',
    'UserModel',
    'Meetings/Apps/Notes/Models/Subnote',
    'Meetings/Apps/Notes/Collections/Subnotes',
    'UsersCollection'
], function (_, Backbone, User, Subnote, SubnotesCollection, UsersCollection) {
    var Note = Backbone.Model.extend({
        urlRoot:"/Meetings/Notes",
        defaults:{
        },
        parse:function (response) {
            //Attach subnotes
            var subnotes_array = response.subnotes;
            var subnotes_collection = new SubnotesCollection();
            for (var k in subnotes_array) {
                var subnote = new Subnote(subnotes_array[k]);
                subnotes_collection.add(subnote);
            }
            response.subnotes = subnotes_collection;

            //Attach users
            var users_array = response.users;
            var users_collection = new UsersCollection();
            for (var k in users_array) {
                var user = new User(users_array[k]);
                users_collection.add(user);
            }
            response.users = users_collection;

            return response;
        }
    });

    return Note;
});