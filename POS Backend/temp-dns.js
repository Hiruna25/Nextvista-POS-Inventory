const dns = require("dns");
dns.setServers(["8.8.8.8","8.8.4.4"]);
console.log("Servers:", dns.getServers());
const host = "cluster0.k7pou0s.mongodb.net";
dns.resolveSrv(`_mongodb._tcp.${host}`, (err, addresses) => {
  if (err) {
    console.error("resolveSrv err", err);
    process.exit(1);
  }
  console.log("resolveSrv", addresses);
});
