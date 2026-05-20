const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
console.log('URI:', uri);
mongoose.connect(uri)
  .then(() => {
    console.log('Direct connect success');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error('Direct connect error:', err);
    process.exit(1);
  });