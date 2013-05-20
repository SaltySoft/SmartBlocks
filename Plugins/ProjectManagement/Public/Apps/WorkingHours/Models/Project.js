define([
    'underscore',
    'backbone',
    'UserModel',
    'ProjectManagement/Apps/WorkingHours/Models/WorkingDuration',
    'ProjectManagement/Apps/WorkingHours/Collections/WorkingDurations',
    'UsersCollection'
], function (_, Backbone, User, WorkingDuration, WorkingDurationsCollection, UsersCollection) {
    var Project = Backbone.Model.extend({
        urlRoot:"/ProjectManagement/Projects",
        defaults:{
        },
        parse:function (response) {
            //Attach working_duration
            var working_durations_array = response.working_durations;
            var working_durations_collection = new WorkingDurationsCollection();
            for (var k in working_durations_array) {
                var working_duration = new WorkingDuration(working_durations_array[k]);
                working_durations_collection.add(working_duration);
            }
            response.working_durations = working_durations_collection;

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

    return Project;
});