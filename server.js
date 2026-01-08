const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ STEP 1: MongoDB connection via Mongoose
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_db';

// Define Student Schema
const studentSchema = new mongoose.Schema({
  roll_number: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  father_name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  father_phone: String,
  father_email: String,
  eamcet_rank: Number,
  ssc_marks: Number,
  inter_marks: Number,
  achievements: String,
  remarks: String,
  identification_mark: String,
  blood_group: String
}, { timestamps: true });

// Create indexes
studentSchema.index({ name: 1 });
studentSchema.index({ father_name: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ roll_number: 1 });

const Student = mongoose.model('Student', studentSchema);

// Multer setup for handling multipart/form-data and regular forms
const upload = multer();

// ✅ STEP 2: Setup middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ STEP 3: Define API routes

// Root route - redirect to register.html
app.get('/', (req, res) => {
  res.redirect('/register.html');
});

// POST endpoint - handles both JSON and form data
app.post('/api/students', upload.none(), async (req, res) => {
  try {
    console.log('✓ Received POST request to /api/students');
    console.log('✓ Request body:', req.body);
    
    // Validate required fields
    const requiredFields = ['roll_number', 'name', 'father_name', 'address', 'age', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send(`<!doctype html><html><head><meta charset="utf-8"><title>Error</title><link rel="stylesheet" href="style.css"></head><body><div class="container"><h2 class="error-msg">Missing required field: ${field}</h2><pre>All fields marked with * are required.</pre><a class="btn" href="register.html">Back</a></div></body></html>`);
      }
    }

    // Convert age to number
    const bodyData = { ...req.body };
    bodyData.age = Number(bodyData.age);
    if (bodyData.eamcet_rank) bodyData.eamcet_rank = Number(bodyData.eamcet_rank);
    if (bodyData.ssc_marks) bodyData.ssc_marks = Number(bodyData.ssc_marks);
    if (bodyData.inter_marks) bodyData.inter_marks = Number(bodyData.inter_marks);

    // Create new student document
    const student = new Student(bodyData);
    const result = await student.save();

    console.log('✓ Student saved with ID:', result._id);
    res.send(`<!doctype html><html><head><meta charset="utf-8"><title>Saved</title><link rel="stylesheet" href="style.css"></head><body><div class="container"><h2 class="success-msg">Student saved (ID: ${result._id})</h2><a class="btn" href="register.html">Register Another</a> <a class="btn btn-secondary" href="search.html">Search Students</a></div></body></html>`);
  } catch (err) {
    console.error('✗ Error in POST /api/students:', err.message);
    res.status(500).send(`<!doctype html><html><head><meta charset="utf-8"><title>Error</title><link rel="stylesheet" href="style.css"></head><body><div class="container"><h2 class="error-msg">Error saving student</h2><pre>${err.message}</pre><a class="btn" href="register.html">Back</a></div></body></html>`);
  }
});

app.get('/api/students', async (req, res) => {
  try {
    console.log('✓ Received GET request to /api/students');
    console.log('✓ Query params:', req.query);
    
    const { id, name, father_name, roll_number } = req.query;
    let query = {};
    let hasSearchCriteria = false;
    let orConditions = [];

    // Build $or conditions for flexible searching
    // Search by Name
    if (name && name.trim()) {
      hasSearchCriteria = true;
      orConditions.push({ name: { $regex: name.trim(), $options: 'i' } });
      console.log('✓ Adding search by name:', name);
    }
    
    // Search by Roll Number (search.html uses 'id' as roll number field)
    if (id && id.trim()) {
      hasSearchCriteria = true;
      // Try both as string and as number
      orConditions.push({ roll_number: { $regex: id.trim(), $options: 'i' } });
      orConditions.push({ roll_number: Number(id) || undefined });
      console.log('✓ Adding search by roll_number (id):', id);
    }
    
    // Search by Roll Number (if explicitly provided)
    if (roll_number && roll_number.trim()) {
      hasSearchCriteria = true;
      orConditions.push({ roll_number: { $regex: roll_number.trim(), $options: 'i' } });
      console.log('✓ Adding search by roll_number:', roll_number);
    }
    
    // Search by Father's Name
    if (father_name && father_name.trim()) {
      hasSearchCriteria = true;
      orConditions.push({ father_name: { $regex: father_name.trim(), $options: 'i' } });
      console.log('✓ Adding search by father_name:', father_name);
    }

    // Build final query
    if (hasSearchCriteria) {
      // Filter out undefined conditions and use $or
      const validConditions = orConditions.filter(cond => {
        return Object.values(cond)[0] !== undefined;
      });
      
      if (validConditions.length > 0) {
        query = { $or: validConditions };
      }
      console.log('✓ Final search query:', JSON.stringify(query));
    } else {
      console.log('✓ No search criteria provided - returning all students');
      query = {};
    }

    // Execute search
    const rows = await Student.find(query).sort({ _id: -1 }).exec();
    console.log('✓ Found', rows.length, 'students');

    // Build HTML response
    let html = `<!doctype html><html><head><meta charset="utf-8"><title>Search Results</title><link rel="stylesheet" href="style.css"></head><body><div class="container"><h1>Search Results</h1>`;

    if (!rows.length) {
      html += `<p class="no-results">No student records found matching your search criteria.</p>`;
    } else {
      html += `<p class="result-count">Found ${rows.length} student(s)</p><div class="results-list">`;
      for (const r of rows) {
        html += `<div class="student-card">`;
        html += `<h2>Student Record #${r._id}</h2>`;
        if (r.roll_number) html += `<div class="field"><label>Roll Number:</label> <span>${escapeHtml(String(r.roll_number))}</span></div>`;
        html += `<div class="field"><label>Name:</label> <span>${escapeHtml(r.name)}</span></div>`;
        html += `<div class="field"><label>Father's Name:</label> <span>${escapeHtml(r.father_name)}</span></div>`;
        html += `<div class="field"><label>Age:</label> <span>${r.age || 'N/A'}</span></div>`;
        html += `<div class="field"><label>Phone Number:</label> <span>${escapeHtml(r.phone)}</span></div>`;
        html += `<div class="field"><label>Email:</label> <span>${escapeHtml(r.email)}</span></div>`;
        html += `<div class="field"><label>Father's Phone:</label> <span>${escapeHtml(r.father_phone) || 'N/A'}</span></div>`;
        html += `<div class="field"><label>Father's Email:</label> <span>${escapeHtml(r.father_email) || 'N/A'}</span></div>`;
        html += `<div class="field"><label>Address:</label> <span>${escapeHtml(r.address)}</span></div>`;
        html += `<div class="field"><label>Blood Group:</label> <span>${escapeHtml(r.blood_group) || 'N/A'}</span></div>`;
        html += `<div class="field"><label>SSC Marks:</label> <span>${r.ssc_marks || 'N/A'}</span></div>`;
        html += `<div class="field"><label>Inter Marks:</label> <span>${r.inter_marks || 'N/A'}</span></div>`;
        html += `<div class="field"><label>EAMCET Rank:</label> <span>${r.eamcet_rank || 'N/A'}</span></div>`;
        html += `<div class="field"><label>Achievements:</label> <span>${escapeHtml(r.achievements) || 'N/A'}</span></div>`;
        html += `<div class="field"><label>Remarks:</label> <span>${escapeHtml(r.remarks) || 'N/A'}</span></div>`;
        html += `<div class="field"><label>Identification Mark:</label> <span>${escapeHtml(r.identification_mark) || 'N/A'}</span></div>`;
        html += `</div>`;
      }
      html += `</div>`;
    }

    html += `<div class="button-group"><a class="btn" href="search.html">New Search</a> <a class="btn btn-secondary" href="register.html">Register Student</a></div></div></body></html>`;
    res.send(html);
  } catch (err) {
    console.error('✗ Error in GET /api/students:', err.message);
    console.error('✗ Full error:', err);
    res.status(500).send(`<!doctype html><html><head><meta charset="utf-8"><title>Error</title><link rel="stylesheet" href="style.css"></head><body><div class="container"><h2 class="error-msg">Search Error</h2><p>Error: ${escapeHtml(err.message)}</p><a class="btn" href="search.html">Back to Search</a></div></body></html>`);
  }
});

// ✅ STEP 4: Static files
app.use(express.static(path.join(__dirname)));

// ✅ Helper function
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ✅ STEP 5: Connect and start server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB via Mongoose');

    app.listen(PORT, () => {
      console.log(`\n🚀 Server listening on http://localhost:${PORT}`);
      console.log(`📝 Student Registration: http://localhost:${PORT}/register.html`);
      console.log(`🔍 Search Students: http://localhost:${PORT}/search.html\n`);
    });
  } catch (err) {
    console.error('✗ Failed to connect or start server:', err);
    process.exit(1);
  }
}

startServer();
