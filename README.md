# Student Registration & Search System

A full-stack application for student registration and searching using Node.js, Express, and MySQL.

## 📋 Project Structure

```
nag/
├── register.html          # Registration form
├── search.html            # Search form
├── style.css              # Styling for all pages
├── server.js              # Node.js Express backend
├── package.json           # NPM dependencies
├── .env                   # Database credentials (local)
├── .env.example           # Example env file
├── student_db.sql         # Database schema
└── README.md              # This file
```

## 🗄️ Database Setup

The MySQL database `student_db` and table `students` are already created with the following fields:
- id (Primary Key, Auto-increment)
- name, father_name, address, age
- phone, email, father_phone, father_email
- eamcet_rank, ssc_marks, inter_marks
- achievements, remarks, identification_mark, blood_group

**Status**: ✅ Database created, table ready

## 🔧 Prerequisites

1. **MySQL Server** (running on localhost:3306)
   - Username: `root`
   - Password: `nagaraju@26`
   - Database: `student_db`

2. **Node.js & npm**
   - Download from: https://nodejs.org/en/ (choose LTS)
   - During installation, ensure "Add to PATH" is checked
   - Restart PowerShell/CMD after installation

## 🚀 Quick Start

### 1. Verify Node.js Installation
```powershell
node -v
npm -v
```
You should see version numbers for both (e.g., v18.x.x and 9.x.x).

### 2. Install Dependencies
```powershell
cd C:\Users\NAGARAJU\Desktop\nag
npm install
```
This installs: express, mysql2, dotenv

### 3. Start the Server
```powershell
node server.js
```
You should see:
```
Server listening on http://localhost:3000
```

### 4. Access the Application

**Registration Page:**
- Open browser: http://localhost:3000/register.html
- Fill in student details
- Click "Register" button
- Data is saved to MySQL database

**Search Page:**
- Open browser: http://localhost:3000/search.html
- Search by:
  - Roll Number (ID)
  - Student Name
  - Father's Name
- Click "Search" button
- Results displayed in table

## 🔌 API Endpoints

### POST /api/students
Saves a student record to the database.

**Request:**
```
POST http://localhost:3000/api/students
Content-Type: application/x-www-form-urlencoded

name=John&father_name=Robert&address=123%20Main%20St&age=20&phone=9876543210&email=john@email.com&father_phone=9876543200&father_email=robert@email.com&eamcet_rank=5000&ssc_marks=95&inter_marks=98&achievements=Sports&remarks=Good&identification_mark=Scar&blood_group=O+
```

**Response:**
- Success: HTML page with ID confirmation
- Error: Error message with details

### GET /api/students
Searches for students by id, name, or father_name.

**Request:**
```
GET http://localhost:3000/api/students?id=1
GET http://localhost:3000/api/students?name=John
GET http://localhost:3000/api/students?father_name=Robert
```

**Response:**
- Results in HTML table format
- If no results found: "No records found" message

## 📝 Configuration

Edit `.env` file to change database credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=nagaraju@26
DB_NAME=student_db
```

## 🧪 Testing

### Option 1: Browser Testing
1. Start server: `node server.js`
2. Register page: http://localhost:3000/register.html
3. Fill form, click Register
4. Go to Search page: http://localhost:3000/search.html
5. Search by name or ID to verify data saved

### Option 2: Command Line Testing (PowerShell/cURL)

**Insert a student:**
```powershell
curl -X POST "http://localhost:3000/api/students" `
  -d "name=Alice&father_name=Bob&address=456%20Park%20Ave&age=21&phone=9999999999&email=alice@email.com&father_phone=9999999998&father_email=bob@email.com&blood_group=AB+"
```

**Search by name:**
```powershell
curl "http://localhost:3000/api/students?name=Alice"
```

**Search by ID:**
```powershell
curl "http://localhost:3000/api/students?id=1"
```

## ✅ Verification Checklist

- [ ] MySQL running on localhost:3306 with `student_db`
- [ ] Node.js and npm installed
- [ ] `npm install` completed in project folder
- [ ] `.env` file exists with correct credentials
- [ ] Server starts with `node server.js`
- [ ] Register page accessible at http://localhost:3000/register.html
- [ ] Search page accessible at http://localhost:3000/search.html
- [ ] Form submission saves to database
- [ ] Search retrieves correct records

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| npm not recognized | Restart PowerShell after Node.js installation |
| Connection refused (3000) | Port 3000 in use; change PORT env or stop other apps |
| Database connection error | Check MySQL is running; verify credentials in `.env` |
| Form submission fails | Check browser console (F12); see server terminal for errors |
| Search returns no results | Verify data was inserted via MySQL CLI or check form spelling |

## 📞 Server Logs

When running `node server.js`, the server logs all:
- Database connection status
- POST/GET request errors
- Query results (line: `[result] = await pool.execute(...)`)

Check terminal for detailed error messages if something fails.

## 🔐 Security Notes

- Credentials in `.env` are for local testing only
- In production, use environment variables from secure sources
- SQL queries use parameterized queries (prevents SQL injection)
- Always validate/sanitize user input before database operations

---

**Status:** Ready to run. Install Node.js, then follow Quick Start steps above.
