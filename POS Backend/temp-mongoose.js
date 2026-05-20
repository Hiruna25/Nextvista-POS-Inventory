const dns = require("dns");
const mongoose = require("mongoose");
const mongoUri = "mongodb+srv://Hiruna:Dakshitha6531@cluster0.k7pou0s.mongodb.net/pos_inventory";
console.log("using DNS servers", dns.getServers());
dns.setServers(["8.8.8.8","8.8.4.4"]);
console.log("set DNS servers", dns.getServers());
(async () => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000, family:4 });
    console.log('connected');
    await mongoose.disconnect();
  } catch (err) {
    console.error('connection error', err);
    process.exit(1);
  }
})();
