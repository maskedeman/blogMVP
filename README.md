# blogMVP

blogMVP is a minimal viable product for a blog application. It allows users to create, read, update, and delete blog posts. Users can also register, log in, and log out. Admin users have additional privileges, such as deleting any post.

This project is built using Python for the backend with FastAPI as the web framework. The frontend is built using React with Vite. The project uses a MySQL database for data storage. Authentication is handled using JSON Web Tokens (JWT).

## Setup and Running the Application

### Clone the repository
 ```bash
git clone https://github.com/maskedeman/blogMVP.git
```
### Install packages and run the frontend
 ```bash
make run_client 
```
### Change the api url from .env file, default backend port:8000 && frontend port:5173

### Also configure database in database.py
### Install packages and run the backend
 ```bash
make run_server 
```
### Create an admin
 ```bash
cd server
python make_admin.py
```
### Setup venv
 ```bash
make env
```
### Activate virtualenv and install required packages
 ```bash
make env_activate
```
### Add new packages
 ```bash
make add_requirements
```
