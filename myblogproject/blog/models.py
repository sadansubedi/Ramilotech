# from django.db import models
# from django.contrib.auth.models import BaseUserManager,AbstractBaseUser

# class UserManager(BaseUserManager):
#     def create_user(self, email, name, password=None,password2=None):
#         """
#         Creates and saves a User with the given email, name and password.
#         """
#         if not email:
#             raise ValueError("Users must have an email address")

#         user = self.model(
#             email=self.normalize_email(email),
#             name=name,
#         )

#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email,name, password=None):
#         """
#         Creates and saves a superuser with the given email, name and password.
#         """
#         user = self.create_user(
#             email,
#             password=password,
#             name=name,
#         )
#         user.is_admin = True
#         user.save(using=self._db)
#         return user


# #custom user model
# class User(AbstractBaseUser):
#     email = models.EmailField(
#         verbose_name="Email",
#         max_length=255,
#         unique=True,
#     )
#     name = models.CharField(max_length=200)
#     is_active = models.BooleanField(default=True)
#     is_admin = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     objects = UserManager()

#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = ["name"]

#     def __str__(self):
#         return self.name

#     def has_perm(self, perm, obj=None):
#         "Does the user have a specific permission?"
#         # Simplest possible answer: Yes, always
#         return self.is_admin

#     def has_module_perms(self, app_label):
#         "Does the user have permissions to view the app `app_label`?"
#         # Simplest possible answer: Yes, always
#         return True

#     @property
#     def is_staff(self):
#         "Is the user a member of staff?"
#         # Simplest possible answer: All admins are staff
#         return self.is_admin


# STATE_CHOICE = (
#     ('Artifical Intelligence','AI/ML'),
#     ('Web dev','Web development'),
#     ('Mobile dev','Mobile development'),
#     # ('Data science','Data science'),
#     # ('Robo','Robotics'),
#     # ('Digit market','Digital marketing'),
#     # ('Graphics design','Graphics designer'),
# )
# class Category(models.Model):
#     name = models.CharField(max_length=100)
#     # select = models.CharField(choices=STATE_CHOICE,max_length=200,null=True)

#     def __str__(self):
#         return self.name
    

# class Tag(models.Model):
#     name = models.CharField(max_length=100)

#     def __str__(self):
#         return self.name

# class BlogPost(models.Model):
#     title = models.CharField(max_length=255)
#     content = models.TextField()
#     author = models.ForeignKey(User, on_delete=models.CASCADE,null=True )
#     creation_date = models.DateTimeField(auto_now_add=True)
#     category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
#     tags = models.ManyToManyField(Tag, null=True)

#     def __str__(self):
#         return self.title

# class Comment(models.Model):
#     post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     content = models.TextField()
#     creation_date = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Comment by {self.author.username} on {self.post.title}"





from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
# from django.db.models import PROTECT
class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, password2=None, **extra_fields):#forget to put password2=None but later got it 
        """
        Creates and saves a User with the given email, name, and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

        # user = self.model(
        #     email=self.normalize_email(email),
        #     name=name,
        # )

        # user.set_password(password)
        # user.save(using=self._db)
        # return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email, name, and password.
        """
        extra_fields.setdefault('is_admin', True)
        if extra_fields.get('is_admin') is not True:
            raise ValueError('Superuser must have is_admin=True.')

        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser):
    email = models.EmailField(verbose_name="Email", max_length=255, unique=True)
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.name

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin


class Category(models.Model):
    name = models.CharField(max_length=100, default="Default Category Name")
    
    def __str__(self):
        return self.name
    
    # def delete(self, *args, **kwargs):
    #     # Optionally handle related BlogPost instances before deleting the Category
    #     self.blogpost_set.all().delete()  # Delete related blog posts
    #     super().delete(*args, **kwargs)
    

class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    # category = models.ForeignKey(Category, on_delete=models.CASCADE,db_constraint=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE) 
    # category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    # category = models.ForeignKey(Category, on_delete=models.CASCADE, db_constraint=False)
    # category = models.ForeignKey(Category, on_delete=PROTECT, db_constraint=False)
    # category = models.ForeignKey(Category, on_delete=models.SET_DEFAULT, default=11, db_constraint=False)

    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    content = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.name} on {self.post.title}"

# class Reply(models.Model):
#     comment = models.ForeignKey(Comment, related_name='replies', on_delete=models.CASCADE)
#     text = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)