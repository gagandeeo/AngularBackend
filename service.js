var crypto = require("crypto");
const { ALGORITHM, SECRETKEY, HASHTYPE } = require("./config");

const key = crypto
  .createHash(HASHTYPE)
  .update(SECRETKEY)
  .digest("base64")
  .substr(0, 32);

function encrypt(buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return result;
}

function decrypt(buffer) {
  const iv = buffer.slice(0, 16);
  buffer = buffer.slice(16);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  const result = Buffer.concat([decipher.update(buffer), decipher.final()]);

  return result;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
