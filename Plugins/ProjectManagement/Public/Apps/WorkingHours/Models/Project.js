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
        },
        getWorkingDurationIdAtDate:function (project, date) {
            var base = project;
//            console.log("getWorkingDurationIdAtDate date", date);
            _.each(base.get("working_durations").models, function (k) {
                var wd_date = new Date();
                wd_date.setTime(k.get("date") * 1000);
//                console.log("-------------")
//                console.log("wd_date full year", wd_date.getFullYear());
//                console.log("wd_date month", wd_date.getMonth());
//                console.log("wd_date date", wd_date.getDate());
//                console.log("date year", date.getFullYear());
//                console.log("date month", date.getMonth());
//                console.log("date date", date.getDate());
//                console.log("-------------")
                if (wd_date.getFullYear() == date.getFullYear()
                    && wd_date.getMonth() == date.getMonth()
                    && wd_date.getDate() == date.getDate()) {
//                    console.log("OKAY id?", k.get("id"));
                    return k.get("id");
                }
            });

            return 0;
        },
        getWorkingDurationHoursAtDate:function (project, date) {
            var base = project;
//            console.log("getWorkingDurationHoursAtDate", date);
//            console.log("getWorkingDurationHoursAtDate getTime", date.getTime());
            var wd_hours = 0;
            _.each(base.get("working_durations").models, function (k) {
                var wd_date = new Date();
                wd_date.setTime(k.get("date") * 1000);
//                console.log("-------------")
//                console.log("wd_date full year", wd_date.getFullYear());
//                console.log("wd_date month", wd_date.getMonth());
//                console.log("wd_date date", wd_date.getDate());
//                console.log("date year", date.getFullYear());
//                console.log("date month", date.getMonth());
//                console.log("date date", date.getDate());
//                console.log("-------------")
                if (wd_date.getFullYear() == date.getFullYear()
                    && wd_date.getMonth() == date.getMonth()
                    && wd_date.getDate() == date.getDate()) {
//                    console.log("OKAY id?", k.get("id"));
                    wd_hours = k.get("hours_number");
//                    return k.get("hours_number");
                }
            });
//            console.log("wd_hours", wd_hours);
            return wd_hours;
        }
    });

    return Project;
});