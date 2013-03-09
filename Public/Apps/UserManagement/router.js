define([
    'jquery',
    'underscore',
    'backbone',
    'Views/AppView',
    'Views/UserCard',
    'Models/User',
    'Views/UsersList',
    'Views/UmHome',
    'Views/UserCreation'
], function ($, _, Backbone, AppView, UserCardView, User, UsersListView, UmHomeView, UserCreationView) {

    var AppRouter = Backbone.Router.extend({
        routes:{
            'edit_user':'editUser',
            'edit_user/:id':'editUser',
            'user_creation':'user_creation',
            '':"home"
        }
    });

    var initialize = function () {
        var AppEvents = _.extend({}, Backbone.Events);

        var app_view = new AppView();
        app_view.init(AppEvents);
        $("#app_container").html(app_view.$el);
        //Home view: 1
        var home_view = new UmHomeView();
        home_view.init(AppEvents);
        app_view.addTab("User Management", home_view.$el, "");

        //User creation: 2
        var u_creation = new UserCreationView();
        u_creation.init(AppEvents);
        app_view.addTab("User creation", u_creation.$el, "user_creation");

        //User edition: 3
        var user_mod_tab = $(document.createElement("div"));
        var user_list_container = $(document.createElement("div"));
        user_mod_tab.append(user_list_container);
        var user_list = new UsersListView();
        user_list.init(AppEvents);
        user_list_container.html(user_list.$el);
        var user_edition_container = $(document.createElement("div"));
        user_mod_tab.append(user_edition_container);

        app_view.addTab("User edition", user_mod_tab, "edit_user");



        var app_router = new AppRouter();
        app_router.on('route:editUser', function (id) {
            var user = new User({ id: id });
            user.fetch({
                success: function () {
                    var user_card = new UserCardView({ model: user });
                    user_card.init(AppEvents);
                    user_edition_container.html(user_card.$el);
                    app_view.show(3);
                }
            });
        });

        app_router.on("route:user_creation", function () {
            app_view.show(2);
        });

        app_router.on("route:home", function () {
            app_view.show(1);
        });
        Backbone.history.start();
    };

    return {
        initialize:initialize
    };

});