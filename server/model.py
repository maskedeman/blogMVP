from sqlalchemy import ForeignKey, Table, Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

# Association table for the many-to-many relationship between Post and Tag
post_tags = Table('post_tags', Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.post_id')),
    Column('tag_id', Integer, ForeignKey('tags.tag_id'))
)

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    username = Column(String(255))
    password = Column(String(255))
    role = Column(String(255))

class Post(Base):
    __tablename__ = 'posts'

    post_id = Column(Integer, primary_key=True)
    title = Column(String(255))
    content = Column(String(255))
    author = Column(String(255))
    creation_date = Column(String(255))
    user_id = Column(Integer, ForeignKey('users.user_id'))
    category_id = Column(Integer, ForeignKey('categories.category_id'))

    # Relationship to the Tag model
    tags = relationship('Tag', secondary=post_tags, backref='posts')

class Comment(Base):
    __tablename__ = 'comments'

    comment_id = Column(Integer, primary_key=True)
    comment = Column(String(255))
    user_id = Column(Integer, ForeignKey('users.user_id'))
    post_id = Column(Integer, ForeignKey('posts.post_id'))

class Category(Base):
    __tablename__ = 'categories'

    category_id = Column(Integer, primary_key=True)
    category = Column(String(255))

    # Relationship to the Post model
    posts = relationship('Post', backref='category')

class Tag(Base):
    __tablename__ = 'tags'

    tag_id = Column(Integer, primary_key=True)
    tag = Column(String(255))

    # No need for a relationship to the Post model, it's already defined in Post