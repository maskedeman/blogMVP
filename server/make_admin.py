import getpass
from fastapi import FastAPI, HTTPException, Depends, status, Security
from sqlalchemy.orm import Session
from typing import Annotated
from database import engine, Sessionlocal
import model 
from main import UserBase
import getpass
import traceback

from auth import Auth
import bcrypt

def create_admin():
    
    username = input("Enter admin username: ")
    password = getpass.getpass("Enter admin password: ")

 # Check if the admin user already exists
    with Sessionlocal() as session:
        existing_admin = session.query(model.User).filter_by(username=username).first()
    if existing_admin:
        print("Admin user with the same username already exists!")
        return
    # Encrypt the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create a new admin user
    admin = model.User(username=username, role="admin")
    admin.password = hashed_password

    # Insert the admin user into the database
    try:
        with Sessionlocal() as session:
            session.add(admin)
            session.commit()
            print("Admin user created successfully!")
    except Exception as e:
        traceback.print_exc()
        print("Failed to create admin user:", str(e))

if __name__ == "__main__":
    create_admin()

