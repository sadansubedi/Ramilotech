'''
Tags,category can only have get operation not post put delete coz that only done by admin user
blogpost can be done by user get,post,put and delete by own author not other authenticate user 
comment ko kura garya xaina 
'''

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from blog .serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer,UserChangePasswordSerializer,SendPasswordResetEmailSerializer,UserPasswordResetSerializer,CommentSerializer,CategorySerializer,TagSerializer,BlogPostSerializer
from django.contrib.auth import authenticate
from blog.renderers import UserRenderer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser,AllowAny
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from blog.models import User,Category,Tag,BlogPost,Comment
from django.utils import timezone
from django.conf import settings
from django.http import Http404
from rest_framework.exceptions import PermissionDenied

#generate token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    access_token_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
    access_token_expiry = timezone.now() + access_token_lifetime
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'accessExpiresIn': int(access_token_expiry.timestamp())
    }



class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    
    # def get_permissions(self):
    #     if self.request.method == 'GET':
    #         return [AllowAny()]
    #     return [IsAuthenticated()]
    
    def post(self,request,format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token= get_tokens_for_user(user)
            return Response({'token':token,'msg':'Registration success'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, uid, format=None):
        try:
            user = User.objects.get(pk=uid)
            serializer = UserRegistrationSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request,format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email=email,password=password)
            if user is not None:
                 token= get_tokens_for_user(user)
                 return Response({'token':token,'msg':'login success'},status=status.HTTP_200_OK)
            else:
                 return Response({'errors':{'non_field_errors':['Email or password is not Valid']}},status=status.HTTP_404_NOT_FOUND)
            
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request,format=None):
        # print("UserProfileView User name => ",request.user)
        serializer = UserProfileSerializer(request.user)
        # print(serializer)
        return Response(serializer.data,status=status.HTTP_200_OK)
        

class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request,format=None):
        serializer = UserChangePasswordSerializer(data=request.data,context={'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'password change successfully'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
        
class SendPasswordResetEmailView(APIView):
    renderer_classes =[UserRenderer]
    def post(self,request,format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'password Reset Link send.please check your Email'},status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
    renderer_classes =[UserRenderer]
    def post(self,request,uid,token,format=None):
        serializer = UserPasswordResetSerializer(data=request.data,context={'uid':uid,'token':token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'password Reset successfully'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

#blogpost CRUD Operation
class BlogPostAPIView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get(self, request):
        print("BlogPostAPIView get opeation user name =>",request.user)
        posts = BlogPost.objects.all()
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)
        # print("Request Headers =>", request.headers)

        # authorization_header = request.headers.get('Authorization')
        # print("Authorization Header =>", authorization_header)

        # if authorization_header is not None:
        #     try:
        #         jwt_auth = JWTAuthentication()
        #         user, token = jwt_auth.authenticate(request)
        #         print("Authenticated user =>", user)
        #     except AuthenticationFailed as e:
        #         print("Authentication failed: ", str(e))
        # else:
        #     print("Authorization header missing")

        # print("blogpost user name =>", request.user)
        # posts = BlogPost.objects.all()
        # serializer = BlogPostSerializer(posts, many=True)
        # return Response(serializer.data)
    
    def post(self, request):
        print("blogpostapiview post method",request.user)
        serializer = BlogPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogPostDetailAPIView(APIView):
   
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            return BlogPost.objects.select_related('author','category').prefetch_related('tags', 'comments').get(pk=pk)
        except BlogPost.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        print("BlogPostDetailAPIView get operation user name =>",request.user)
        post = self.get_object(pk)
        serializer = BlogPostSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        post = self.get_object(pk)
        
        print("BlogPostDetailAPIView put operation user name =>",request.user)

        print("BlogPostDetailAPIView post ma k xa ? ",post)
        print("BlogPostDetailAPIView post ma username k xa ? ",post.author)
        if post.author != request.user: 
            raise PermissionDenied("You do not have permission to edit this post.")
        
        serializer = BlogPostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    def delete(self, request, pk):
        post = self.get_object(pk)
        print("BlogPostDetailAPIView delete user name =>",request.user)
        print("BlogPostDetailAPIView delete ma username k xa ? ",post.author)


        if post.author != request.user:
            raise PermissionDenied("You do not have permission to delete this post.")
        
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#Category Section
class CategoryAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    # def get_permissions(self):
    #     if self.request.method == 'GET':
    #         return [AllowAny()]
    #     return [IsAdminUser()]#IsAuthenticated
    
    def get(self, request):
        print("CategoryAPIView get opeartion user name =>",request.user)

        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response({'detail': 'Only admins can create categories.'}, status=status.HTTP_403_FORBIDDEN)
         
        print("CategoryAPIView post opeartion user name =>",request.user)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        print("CategoryDetailAPIView get opeartion user name =>",request.user)
        
        category = self.get_object(pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    
    #no need it for user it is useful for admin only 
    # def delete(self, request, pk):
    #     # print("CategoryAPIView get opeartion user name =>",request.user)
        
    #     category = self.get_object(pk)
    #     category.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
'''tagapi view chai gareko xaina ramro sanga only multipletag matra get opeation gareym for everyone put post delete chai matra admin ko kam ho '''
class TagAPIView(APIView):
    # def get_permissions(self):
    #     if self.request.method == 'GET':
    #         return [AllowAny()]
    #     return [IsAuthenticated()]
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAdminUser]
    def get(self, request):
        print("TagAPIView get opeartion user name =>",request.user)

        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("TagAPIView post opeartion user name =>",request.user)
        
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class TagDetailAPIView(APIView):
#     def get_object(self, pk):
#         try:
#             return Tag.objects.get(pk=pk)
#         except Tag.DoesNotExist:
#             raise Http404

#     def get(self, request, pk):
#         print("id = ",pk)
#         tag = self.get_object(pk)
#         serializer = TagSerializer(tag)
#         return Response(serializer.data)

# class MultipleTagsDetailAPIView(APIView):
#     def get(self, request,*args, **kwargs):
#         ids = request.query_params.getlist('id')
#         print("id=",ids)
#         tags = Tag.objects.filter(id__in=ids)
#         serializer = TagSerializer(tags, many=True)
#         return Response(serializer.data)

class MultipleTagsDetailAPIView(APIView):
    
    permission_classes = [AllowAny]
    def get(self, request):
        id_param = request.query_params.get('id', '')
        print("MultipleTagsDetailAPIView get opeartion user name =>",request.user)
        # print("id_param => ",id_param)
        ids = id_param.split(',')  # Split the string at commas
        # print("ids => ",ids)
        try:
            ids = [int(id) for id in ids]  # Convert each part to an integer
        except ValueError:
            raise Http404("Invalid ID format")  # Handle invalid ID format
        
        tags = Tag.objects.filter(id__in=ids)
        # print("Tags value =>",tags)
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

# class CommentAPIView(APIView):
#     def get(self, request):
#         # comments = Comment.objects.all()
#         # serializer = CommentSerializer(comments, many=True)
#         # return Response(serializer.data)
#         comments = Comment.objects.filter(parent=None)  # Only fetch top-level comments
#         serializer = CommentSerializer(comments, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = CommentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class CommentAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        post_id = request.query_params.get('post_id')
        if post_id:
            comments = Comment.objects.filter(post_id=post_id, parent=None)
        else:
            comments = Comment.objects.filter(parent=None)  # Only fetch top-level comments if no post_id is provided
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    
    def delete(self, request, pk):
        comment = Comment.objects.get(pk=pk)
        


        # if post.author != request.user:
        #     raise PermissionDenied("You do not have permission to delete this post.")
        
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


'''
gmail=> admin@gmail.com
password=> admin
'''
