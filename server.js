const express = require("express");
const multer = require("multer");
const cors = require("cors");
const zlib = require("zlib");
const fs = require("fs");
var stream = require("stream");
const path = require("path");
const { encrypt, decrypt } = require("./service");
const app = express();
app.use(cors());

var memStorage = multer.memoryStorage();

var upload = multer({ storage: memStorage });

app.get("/", async (req, res) => {
  const directoryPath = __dirname + "/uploads/";
  await fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan Files!",
      });
    }

    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: "http://localhost:5000/" + file,
      });
    });
    res.status(200).send(fileInfos);
  });
});

app.get("/:name", async (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __dirname + "/uploads/";

  await fs.readFile(directoryPath + fileName, function (err, data) {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }

    const result = decrypt(data);

    var readStream = new stream.PassThrough();
    readStream.end(result);

    readStream.pipe(res);
    console.log(data);
  });
});

app.post("/single", upload.single("files"), async (req, res) => {
  console.log(req.file);
  try {
    const destination = `uploads/${Date.now()}--${req.file.originalname}.gz`;
    let fileBuffer = req.file.buffer;

    await zlib.gzip(fileBuffer, (err, response) => {
      if (err) {
        console.log(err);
      }
      const result = encrypt(response);
      fs.writeFile(path.join(__dirname, destination), result, (err, data) => {
        if (err) {
          console.log(err);
        }
      });
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
  res.json({ text: "Success upload" });
});

app.listen(5000, console.log("Listening...."));
