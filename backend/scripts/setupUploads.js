const fs = require('fs');
const path = require('path');

function setupUploads() {
  const uploadsDir = path.join(__dirname, '..', 'uploads');

  try {
    // Check if directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating uploads directory...');
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Uploads directory created successfully.');
    } else {
      console.log('Uploads directory already exists.');
    }

    // Check directory permissions
    try {
      fs.accessSync(uploadsDir, fs.constants.R_OK | fs.constants.W_OK);
      console.log('Uploads directory has correct read/write permissions.');
    } catch (err) {
      console.error('Error: Uploads directory does not have correct permissions.');
      console.error(err);
      process.exit(1);
    }

  } catch (err) {
    console.error('Error setting up uploads directory:');
    console.error(err);
    process.exit(1);
  }
}

setupUploads(); 