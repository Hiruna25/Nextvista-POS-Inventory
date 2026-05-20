const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ override: true });

const User = require('./models/User');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Branch = require('./models/Branch');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await User.findOne({ email: 'admin@example.com' });
    const category = await Category.findOne({ name: 'General' });
    const supplier = await Supplier.findOne({ name: 'Default Supplier' });
    const branch = await Branch.findOne({ name: 'Main Branch' });
    console.log({
      admin: !!admin,
      category: !!category,
      supplier: !!supplier,
      branch: !!branch
    });
    if (admin) console.log('Admin user found:', { username: admin.username, email: admin.email });
    if (category) console.log('Category found:', category.name);
    if (supplier) console.log('Supplier found:', supplier.name);
    if (branch) console.log('Branch found:', branch.name);
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();