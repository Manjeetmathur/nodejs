const mongoose = require("mongoose");
const mongoURL = "mongodb://localhost:27017/hotels";

mongoose.connect(mongoURL, {
  useNewurlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("connected", () => {
  console.log("connected with mongo server");
});
db.on("error", (err) => {
  console.log("do not connected with mongo server error : ", err);
});
db.on("disconnected", () => {
  console.log("disconnected with mongo server");
});

module.exports = db;
