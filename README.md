# Student Management System

A simple web-based Student Management System developed using:

- Node.js
- Express.js
- EJS
- MySQL
- Git
- GitHub

## Features

- View students
- Add students
- Edit students
- Delete students
- Search students
- Form validation

## Installation

Clone the repository:

```
git clone YOUR_REPOSITORY_URL
```

Install dependencies:

```
npm install
```

Create the database:

1. Start MySQL (XAMPP or MAMP).
2. Open phpMyAdmin and run the SQL below.

```sql
CREATE DATABASE student_management;
USE student_management;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  year_level INT NOT NULL,
  email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Configure the database connection by creating a `.env` file in the main folder:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=student_management
```

If you use MAMP, set `DB_PORT=8889` and `DB_PASSWORD=root`.

Run:

```
node app.js
```

Open:

```
http://localhost:3000
```