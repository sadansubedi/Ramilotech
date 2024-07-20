from rest_framework import serializers
from blog.models import User,Category,Tag,BlogPost,Comment
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from blog.utils import Util

class UserRegistrationSerializer(serializers.ModelSerializer):
    
    password2 = serializers.CharField(style={'input_type':'password'},write_only=True)
    class Meta:
        model = User
        fields = ['email','name','password','password2']
        extra_kwargs={
            'password':{'write_only':True}
        }
    #validating password and confirm password while registration
       #it is call when is_valid() is called in view.py  
    def validate(self, attrs):
        password =attrs.get('password')
        password2 =attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("password and confirm password doesn't match ")
        return attrs
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields =['email','password']
        


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields=['id','email','name']

class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    class Meta:
        fields = ['password','password2']

    def validate(self, attrs):# this line execute from views.py line no 57 ok
        password =attrs.get('password')
        password2 =attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("password and confirm password doesn't match ")
        user.set_password(password)
        user.save()
        return attrs
    

class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        fields = ['email']
    
    def validate(self, attrs):
        email  = attrs.get('email')
        if User.objects.filter(email=email).exists():#db email and provided email by user are if exist then
            user = User.objects.get(email=email)
            # uid = user.id
            uid = urlsafe_base64_encode(force_bytes(user.id))
            print('Encoded Uid',uid)
            token = PasswordResetTokenGenerator().make_token(user)
            print('password Reset TOken',token)
            # link = 'http://localhost:3000/api/user/reset/'+uid+'/'+token
            link =' http://localhost:5173/api/user/reset-password/'+uid+'/'+token
            print('password Reset Link',link)
            # Send EMail
            body = 'Click Following Link to Reset Your Password'+link
            data = {
                'subject':'Reset Your Password',
                'body':body,
                'to_email':user.email
            }
            Util.send_email(data)
            return attrs
        else:
            raise serializers.ValidationError("you are not Registered User")
        

class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    class Meta:
        fields = ['password','password2']

    def validate(self, attrs):# this line execute from views.py line no 57 ok
        try:
            password =attrs.get('password')
            password2 =attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            print(password,password2,uid,token)
            if password != password2:
                raise serializers.ValidationError("password and confirm password doesn't match ")
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user,token):
                raise serializers.ValidationError('TOken is not valid or expired')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user,token)
            raise serializers.ValidationError('TOken is not valid or expired')

        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']#'name'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id','name']

class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data
 


class CommentSerializer(serializers.ModelSerializer):
    replies = RecursiveField(many=True, read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author','parent','replies' ,'content', 'creation_date']

   
class BlogPostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'comments','author', 'creation_date', 'category', 'tags']
