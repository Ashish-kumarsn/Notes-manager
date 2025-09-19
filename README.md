# 📚 Notes Manager App (MERN)

A full-stack Notes Manager application built with the MERN stack (MongoDB, Express, React, Node.js).  
Users can register, log in, and manage their personal notes (create, view, update, delete). Admins can view all users and their notes.

---

## 🚀 Live Demo
- **Frontend (Netlify):** [https://notemanagers.netlify.app/](https://notemanagers.netlify.app/)  
- **Backend (Render):** [https://notes-manager-fs29.onrender.com/api](https://notes-manager-fs29.onrender.com/api)  

---

## ✨ Features

### 👤 User Side
- Register & login with email + password  
- Create new note (title + description)  
- View list of personal notes  
- Edit or delete any note  
- Logout securely  

### 🛠️ Admin Side
- View all registered users  
- View all notes created by users  
- Delete inappropriate notes  

---

## ⚙️ Tech Stack

**Frontend (React):**
- React + React Router DOM  
- Axios for API calls  
- Tailwind CSS for UI  
- Netlify for deployment  

**Backend (Node.js + Express + MongoDB):**
- Express.js REST API  
- MongoDB (Mongoose ODM)  
- JWT authentication + bcrypt password hashing  
- Render for deployment  

---

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` → Register new user  
- `POST /api/auth/login` → Login user  

### Notes
- `POST /api/notes` → Add new note  
- `GET /api/notes` → Get all notes of logged-in user  
- `PUT /api/notes/:id` → Edit note  
- `DELETE /api/notes/:id` → Delete note  

---

## 👑 Admin Setup

To **create an admin account**, run the following command inside the `backend` directory:

The script will ask for an email and password in the terminal.

Once entered, an admin user will be created in the database.

The admin can log in via the frontend login page using those credentials.
node deleteAdmin.js


Default Admin (already seeded)

Email: Ashish@gmail.com

Password: Ashish@2022 
```bash
node seedAdmin.js
