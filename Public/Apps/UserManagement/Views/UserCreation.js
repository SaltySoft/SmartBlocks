define([
    'jquery',
    'underscore',
    'backbone',
    'SmartBlocks',
    'UserModel',
    'text!Templates/user_add.html'
], function ($, _, Backbone, SmartBlocks, User, UserAddTemplate) {
    var UserCreationView = Backbone.View.extend({
        tagName:"div",
        className:"k_um_user_creation",
        initialize:function () {

        },
        init:function (AppEvents) {
            this.AppEvents = AppEvents;
            this.render();
        },
        render:function () {
            var template = _.template(UserAddTemplate, {});

            this.$el.html(template);
            this.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;
            base.$el.find('.user_creation_button').click(function () {
                base.createUser();
            });
        },
        createUser:function () {
            var base = this;

            var paramObj = {};
            $.each(base.$el.find('form').serializeArray(), function (_, kv) {
                if (paramObj.hasOwnProperty(kv.name)) {
                    paramObj[kv.name] = $.makeArray(paramObj[kv.name]);
                    paramObj[kv.name].push(kv.value);
                }
                else {
                    paramObj[kv.name] = kv.value;
                }
            });


            if (paramObj.password == paramObj.password_check) {
                delete paramObj.password_check;
                var user = new User(paramObj);

                user.save({}, {
                    success:function () {
                        if (!user.isNew())
                        {
                            SmartBlocks.show_message("The user was successfully created");
                            document.location.hash = "edit_user/" + user.get('id');
                        }
                        else
                        {
                            SmartBlocks.show_message("The username is already taken");
                        }

                    }
                });
                console.log(user);
            }
            else {
                SmartBlocks.show_message("Passwords don't match");
            }


        }
    });

    return UserCreationView;
});