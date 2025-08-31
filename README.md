🏫 School Management System
A simple school management system built with Next.js, React, and MySQL. Add and view schools with a clean, responsive interface.

### Features
Add Schools: Form to register new schools with validation

View Schools: Display schools in a clean grid layout

Image Upload: Upload and display school images

Responsive: Works on mobile and desktop

Form Validation: Email, phone, and required field validation

### Tech Stack
Frontend: Next.js, React, CSS Modules

Backend: Node.js, MySQL

Forms: react-hook-form

Database: MySQL

### Quick Start
1. Install Dependencies
bash
npm install
2. Setup Database
Create MySQL database:

sql
CREATE DATABASE school_management;
USE school_management;

CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    contact BIGINT NOT NULL,
    image TEXT,
    email_id TEXT NOT NULL
);
3. Environment Variables
Create .env.local file:

text
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
DB_PORT=3306
4. Create Upload Folder
bash
mkdir public/schoolImages
5. Run Project
bash
npm run dev
Open http://localhost:3000

📁 Pages
Home (/) - Welcome page with navigation

Add School (/addSchool) - Form to add new schools

Schools Directory (/showSchools) - View all schools

🗄️ Database
Schools Table:

id - Auto increment ID

name - School name

address - Full address

city - City name

state - State name

contact - Phone number (10 digits)

email_id - Email address

image - Image file path


Schools Directory
Clean grid layout showing school information and images.



👨‍💻 Developer
Created by: vimal prakash 

GitHub: https://github.com/vimal2645

Email: vimalprakashgnesvns@gmail.com

📄 Assignment Details
This project was built as part of a web development assignment with the following requirements:

✅ Next.js with React

✅ MySQL database integration

✅ Form validation with react-hook-form

✅ Image upload to schoolImages folder

✅ Responsive design

✅ E-commerce style display