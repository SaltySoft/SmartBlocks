define([
    'jquery',
    'underscore',
    'backbone',
    'Views/AppView',
    'Views/UserCard',
    'Models/User',
    'Views/UsersList',
    'Views/JobsList'
], function ($, _, Backbone, AppView, UserCardView, User, UsersListView, JobsListView) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            'edit_user/:id':'editUser',
            '':"home"
        }
    });

    var initialize = function () {
        var AppEvents = _.extend({}, Backbone.Events);

        var user_list_container = $(document.createElement("div"));
        $("#app_container").append(user_list_container);

        var user_list = new UsersListView();
        user_list.init(AppEvents);

        user_list_container.html(user_list.$el);


        var user_edition_container = $(document.createElement("div"));
        $("#app_container").append(user_edition_container);




        var app_router = new AppRouter();
        app_router.on('route:editUser', function (id) {

            var user = new User({ id: id });
            user.fetch({
                success: function () {
                    var user_card = new UserCardView({ model: user });
                    user_card.init(AppEvents);
                    user_edition_container.html(user_card.$el);
                }
            });



        });

        app_router.on("route:home", function () {

        });
        Backbone.history.start();
    };

    return {
        initialize:initialize
    };

});