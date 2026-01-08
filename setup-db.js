const mongoose = require('mongoose');
require('dotenv').config();

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

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');

    // Create model
    const Student = mongoose.model('Student', studentSchema);

    // Ensure indexes are created
    await Student.collection.createIndex({ name: 1 });
    await Student.collection.createIndex({ father_name: 1 });
    await Student.collection.createIndex({ email: 1 });
    await Student.collection.createIndex({ roll_number: 1 });
    console.log('✓ Indexes created');

    console.log('✓ Database setup completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('✗ Error setting up database:', err);
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  }
}

setupDatabase();
