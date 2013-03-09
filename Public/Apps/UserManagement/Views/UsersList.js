define([
    'underscore',
    'backbone',
    'UserModel',
    'UsersCollection',
    'text!Templates/user_list.html',
    'text!Templates/user_list_inner.html'
], function (_, Backbone, User, UsersCollection, UsersListTemplate, UsersListInnerTemplate) {
    var UsersListView = Backbone.View.extend({
        tagName:"div",
        className:"k_users_list",
        events:{
            "click a.next_button":"next_page",
            "click a.previous_button":"previous_page",
            "keyup input.search_input":"reload"
        },
        initialize:function () {
            this.current_page = 1;
            var base = this;
            base.collection = new UsersCollection();
            base.timer = 0;
            base.page_size = 8;
        },
        init:function (AppEvents) {
            this.AppEvents = AppEvents;
            this.render();
            this.load_page(this.current_page);
        },
        render:function () {
            var base = this;
            base.filter = base.$el.find(".search_input").val();
            var template = _.template(UsersListTemplate, {
                users:base.collection.models,
                filter:base.filter
            });

            this.AppEvents.bind("user_updated", function () {
                base.load_page();
            });

            base.$el.html(template);


        },
        render_list:function () {
            var base = this;
            base.filter = base.$el.find(".search_input").val();
            var pagesize = base.page_size - 1;
            var template = _.template(UsersListInnerTemplate, {
                users:base.collection.models,
                filter:base.filter,
                current_page: base.current_page,
                page_size:pagesize
            });
            $(".k_um_list_holder").html(template);
        },
        load_page:function () {
            base = this;
            base.collection.fetch({
                data:{
                    page:base.current_page,
                    filter:base.$el.find(".search_input").val(),
                    page_size: base.page_size
                },
                success:function (data) {
                    base.render_list();
                }
            });
        },
        next_page:function () {
            base = this;
            if (base.collection.models.length > 1) {
                base.current_page++;

            }

            base.load_page();

        },
        previous_page:function () {
            base = this;
            base.current_page -= 1;
            if (base.current_page >= 1) {
                base.load_page();
            }
            else {
                base.current_page++;
            }

        },
        reload: function () {
            var base = this;
            clearTimeout(base.timer);
            base.timer = setTimeout(function () {
                base.load_page();
            }, 500);
        }
    });

    return UsersListView
});