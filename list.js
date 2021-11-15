const path = require("path");
const fs = require("fs");

const directoryPath = path.join(__dirname, "uploads");

fs.readdir(directoryPath, function (err, res) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  res.forEach(function (file) {
    console.log(file);
  });
});
