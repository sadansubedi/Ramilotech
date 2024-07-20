from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from blog.models import User,Category,Tag,BlogPost,Comment
# Register your models here.
class UserModelAdmin(BaseUserAdmin):
   
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["id","email", "name", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["name"]}),
        ("Permissions", {"fields": ["is_admin"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name", "password1", "password2"],
            },
        ),
          ]
    search_fields = ["email"]
    ordering = ["email",'id']
    filter_horizontal = []


# Now register the new UserAdmin...
admin.site.register(User, UserModelAdmin)

@admin.register(Tag)
class TagModelAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(Comment)
class CommentModelAdmin(admin.ModelAdmin):
    list_display = ['post','author','content','parent','creation_date']


@admin.register(BlogPost)
class BlogPostModelAdmin(admin.ModelAdmin):
    list_display = ['title','content','author','creation_date','category']#'tags'


@admin.register(Category)
class CategoryPostModelAdmin(admin.ModelAdmin):
    list_display = ['id','name']#'name'
