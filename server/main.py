from fastapi import FastAPI, HTTPException, Depends, status, Security
from pydantic import BaseModel
from fastapi import status
from typing import List
import model
import database
import traceback
from database import engine, Sessionlocal
from sqlalchemy.orm import Session
from typing import Annotated
import datetime
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from auth import Auth
import re 
from typing import Optional

app=FastAPI()
security = HTTPBearer()
auth_handler = Auth()




model.Base.metadata.create_all(bind = engine)

class PostList(BaseModel):
    title: str
    author: str
    creation_date: str

class PostBase(PostList):
    content: str
    category_id: str
    tag_id: List[str]

class UserBase(BaseModel):
    username: str
    password: str

class UserCreate(UserBase):
    role: str

class CommentBase(BaseModel):
    comment: str
    user_id: int
    post_id: int

class CategoryBase(BaseModel):
    category: str

class TagBase(BaseModel):
    tag: str

def get_db():
    db = Sessionlocal()
    try: 
        yield db

    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/")
def read_root():
    return {"Hello": "World"}

def is_password_strong(password: str) -> bool:
    # Password must be at least 8 characters long
    if len(password) < 8:
        return False

    # Password must contain at least one uppercase letter
    if not re.search(r'[A-Z]', password):
        return False

    # Password must contain at least one lowercase letter
    if not re.search(r'[a-z]', password):
        return False

    # Password must contain at least one digit
    if not re.search(r'\d', password):
        return False

    # Password must contain at least one special character
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False

    return True

@app.post('/signup', status_code=status.HTTP_200_OK)
def signup(user_details: UserBase, db: Session = Depends(get_db)):
    user = db.query(model.User).filter(model.User.username == user_details.username).first()
    if user is not None:
       raise HTTPException(status_code=409, detail='Account already exists')
    try:
        if not is_password_strong(user_details.password):
            raise HTTPException(status_code=401, detail='Password is not strong enough') 

        hashed_password = auth_handler.encode_password(user_details.password)
        new_user = model.User(username=user_details.username, password=hashed_password, role='user')  # Set user role to 'user'
        db.add(new_user)
        db.commit()
        return 'Account created'
    except Exception:
        db.rollback()
        traceback.print_exc()  # print the exception to the console
        raise HTTPException(status_code=500, detail='Error creating account')

@app.post('/login')
def login(user_details: UserBase, db: Session = Depends(get_db)):
    user = db.query(model.User).filter(model.User.username == user_details.username).first()
    if user is None:
        raise HTTPException(status_code=401, detail='Invalid username')
    if not auth_handler.verify_password(user_details.password, user.password):
        raise HTTPException(status_code=401, detail='Invalid password')
    
    access_token = auth_handler.encode_token(user.username and user.password and user.role)
    refresh_token = auth_handler.encode_refresh_token(user.username and user.password and user.role)
    return {'access_token': access_token, 'refresh_token': refresh_token}

@app.get('/refresh_token')
def refresh_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    refresh_token = credentials.credentials
    new_token = auth_handler.refresh_token(refresh_token)
    return {'access_token': new_token}

@app.post('/secret')
def secret_data(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        return 'Top Secret data only authorized users can access this info'

@app.get('/notsecret')
def not_secret_data():
    return 'Not secret data'


@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create admin users")
    db_user = model.User(**user.dict())
    db.add(db_user)
    db.commit()

@app.get("/user/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(user_id: int, db: db_dependency):
    user = db.query(model.User).filter(model.User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return user

@app.post("/posts/", status_code=status.HTTP_201_CREATED)
async def create_post(post: PostBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    username = auth_handler.decode_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    # Query the database to get the user object
    user = db.query(model.User).filter(model.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    tags = [db.query(model.Tag).filter(model.Tag.tag == tag_name).first() for tag_name in post.tag_names]
    if any(tag is None for tag in tags):
        raise HTTPException(status_code=400, detail='One or more tags not found')

    category = db.query(model.Category).filter(model.Category.category_id == post.category_id).first()
    if category is None:
        raise HTTPException(status_code=400, detail='Category not found')

    post_dict = post.dict()
    post_dict['user_id'] = user.user_id
    post_dict['author'] = user.username
    post_dict['category_id'] = category.category_id  # Use the category ID instead of the name

    # Create the post in the database
    db_post = model.Post(**post_dict)
    db.add(db_post)
    db.commit()
    return db_post

@app.get("/posts/{post_id}", status_code=status.HTTP_200_OK)
async def read_post(post_id: int, db: db_dependency):
    post = db.query(model.Post).filter(model.Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail='Post was not found')
    
    # Convert post and its comments to dictionaries
    post_dict = post.to_dict()
    post_dict['comments'] = [comment.to_dict() for comment in post.comments]
    
    return post_dict

@app.post("/comment/", status_code=status.HTTP_201_CREATED)
async def create_comment(comment: CommentBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    username = auth_handler.decode_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    db_user = db.query(model.User).filter(model.User.username == username).first()
    if db_user is None:
        raise HTTPException(status_code=400, detail='User not found')
    post = db.query(model.Post).filter(model.Post.post_id == comment.post_id).first()
    if post is None:
        raise HTTPException(status_code=400, detail='Post not found')
    db_comment = model.Comment(user_id=db_user.user_id, post_id=comment.post_id, comment=comment.comment)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.get("/comment/{comment_id}", status_code=status.HTTP_200_OK)
async def read_comment(comment_id: int, db: db_dependency):
    comment = db.query(model.Comment).filter(model.Comment.comment_id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment

@app.post("/category/", status_code=status.HTTP_201_CREATED)
async def create_category(category: CategoryBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    username = auth_handler.decode_token(token)
    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Query the database to get the user object
    user = db.query(model.User).filter(model.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
   
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User does not have permission to create category")
    
    db_category = model.Category(category=category.category)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/category/{category_id}",status_code=status.HTTP_200_OK)
async def read_category(category_id: int, db: db_dependency):
    category = db.query(model.Category).filter(model.Category.category_id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@app.post("/tag/", status_code=status.HTTP_201_CREATED)
async def create_tag(tag: TagBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    username = auth_handler.decode_token(token)
    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Query the database to get the user object
    user = db.query(model.User).filter(model.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can create tags")
    
    db_tag = model.Tag(tag=tag.tag)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

@app.get("/tag/{tag_id}", status_code=status.HTTP_200_OK)
def read_tag(tag_id: int, db: db_dependency):
    tag = db.query(model.Tag).filter(model.Tag.tag_id == tag_id).first()
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

@app.get("/tags/", status_code=status.HTTP_200_OK)
def read_tags(tag_id: Optional[int] = None, db: Session = Depends(get_db)):
    if tag_id:
        posts = db.query(model.Post).filter(model.Post.tag_id == tag_id).all()
        return posts
    else:
        tags = db.query(model.Tag).all()
        return tags

@app.get("/categories/", status_code=status.HTTP_200_OK)
def read_categories(category_id: Optional[int] = None,db: Session = Depends(get_db)):
    if category_id:
        posts = db.query(model.Post).filter(model.Post.category_id == category_id).all()
        return posts
    else:
        categories = db.query(model.Category).all()
        return categories

@app.get("/posts/", response_model=List[PostList], status_code=status.HTTP_200_OK)
def read_posts(category: Optional[str] = None, tag: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(model.Post)
    
    if category:
        query = query.filter(model.Post.category == category)
    
    if tag:
        query = query.filter(model.Post.tag == tag)
    
    posts = query.all()
    
    return [PostList(
        title=post.title,
        author=post.author,
        tag=post.tag,
        category=post.category,
        creation_date=post.creation_date
    ) for post in posts]

@app.get("/comments/", status_code=status.HTTP_200_OK)
def read_comments(db: db_dependency):
    comments = db.query(model.Comment).all()
    return comments

@app.get("/users/", status_code=status.HTTP_200_OK)
def read_users(db: db_dependency):
    users = db.query(model.User).all()
    return users

@app.delete("/user/{user_id}",status_code=status.HTTP_200_OK)
async def delete_user(user_id: int, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    user = auth_handler.decode_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    if user.role != "admin" and user.user_id != user_id:
        raise HTTPException(status_code=403, detail='Unauthorized')
    
    # Delete associated comments
    db.query(model.Comment).filter(model.Comment.user_id == user_id).delete()
    
    # Delete associated posts
    db.query(model.Post).filter(model.Post.user_id == user_id).delete()
    
    # Delete the user
    user = db.query(model.User).filter(model.User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.delete("/post/{post_id}",status_code=status.HTTP_200_OK)
async def delete_post(post_id: int, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    user = auth_handler.decode_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail='Unauthorized')
    post = db.query(model.Post).filter(model.Post.post_id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail='Post not found')
    if user.role != "admin" and user.user_id != post.user_id:
        raise HTTPException(status_code=403, detail='Forbidden')
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}

@app.delete("/comment/{comment_id}", status_code=status.HTTP_200_OK)
async def delete_comment(comment_id: int, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    user = auth_handler.decode_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail='Unauthorized')
    comment = db.query(model.Comment).filter(model.Comment.comment_id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail='Comment not found')
    post = db.query(model.Post).filter(model.Post.post_id == comment.post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail='Post not found')
    if user.role != "admin" and user.user_id != comment.user_id and user.user_id != post.user_id:
        raise HTTPException(status_code=403, detail='Forbidden')
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}

@app.delete("/category/{category_id}",status_code=status.HTTP_200_OK)
async def delete_category(category_id: int, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    user = auth_handler.decode_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail='Unauthorized')
    if user.role != "admin":
        raise HTTPException(status_code=403, detail='Forbidden')
    category = db.query(model.Category).filter(model.Category.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail='Category not found')
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}

@app.delete("/tag/{tag_id}",status_code=status.HTTP_200_OK)
async def delete_tag(tag_id: int, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    user = auth_handler.decode_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail='Unauthorized')
    if user.role != "admin":
        raise HTTPException(status_code=403, detail='Forbidden')
    tag = db.query(model.Tag).filter(model.Tag.tag_id == tag_id).first()
    if tag is None:
        raise HTTPException(status_code=404, detail='Tag not found')
    db.delete(tag)
    db.commit()
    return {"message": "Tag deleted successfully"}

@app.put("/user/{user_id}", status_code=status.HTTP_200_OK)
async def update_user(user_id: int, user: UserBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    user = auth_handler.decode_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail='Unauthorized')
    if user.role != "admin":
        raise HTTPException(status_code=403, detail='Forbidden')
    db_user = db.query(model.User).filter(model.User.user_id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail='User not found')
    db_user.username = user.username
    db_user.password = user.password
    db_user.email = user.email
    db.commit()
    return db_user

@app.put("/post/{post_id}", status_code=status.HTTP_200_OK)
async def update_post(post_id: int, post: PostBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    username = auth_handler.decode_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail='Unauthorized')
    
    # Query the database to get the user object
    user = db.query(model.User).filter(model.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    
    db_post = db.query(model.Post).filter(model.Post.post_id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail='Post not found')
    if db_post.user_id != user.user_id:
        raise HTTPException(status_code=403, detail='Forbidden')
    
    db_post.title = post.title
    db_post.content = post.content
    db_post.category_id = post.category_id
    db_post.tag_id = post.tag_id
    db.commit()
    return db_post

@app.put("/comment/{comment_id}",status_code=status.HTTP_200_OK)
async def update_comment(comment_id: int, comment: CommentBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    username = auth_handler.decode_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail='Unauthorized')
    
    # Query the database to get the user object
    user = db.query(model.User).filter(model.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    
    db_comment = db.query(model.Comment).filter(model.Comment.comment_id == comment_id).first()
    if db_comment is None:
        raise HTTPException(status_code=404, detail='Comment not found')
    if db_comment.user_id != user.user_id:
        raise HTTPException(status_code=403, detail='Forbidden')
    
    db_comment.comment = comment.comment
    db.commit()
    return db_comment

@app.put("/category/{category_id}", status_code=status.HTTP_200_OK)
async def update_category(category_id: int, category: CategoryBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    username = auth_handler.decode_token(token)
    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Query the database to get the user object
    user = db.query(model.User).filter(model.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
   
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User does not have permission to update category")
    
    db_category = db.query(model.Category).filter(model.Category.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
    db_category.category = category.category
    db.commit()
    return db_category

@app.put("/tag/{tag_id}", status_code=status.HTTP_200_OK)
async def update_tag(tag_id: int, tag: TagBase, db: db_dependency, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    username = auth_handler.decode_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail='Unauthorized')
    
    # Query the database to get the user object
    user = db.query(model.User).filter(model.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    
    if user.role != "admin":
        raise HTTPException(status_code=403, detail='Forbidden')
    
    db_tag = db.query(model.Tag).filter(model.Tag.tag_id == tag_id).first()
    if db_tag is None:
        raise HTTPException(status_code=404, detail='Tag not found')
    
    db_tag.tag = tag.tag
    db.commit()
    return db_tag

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
    