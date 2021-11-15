var crypto = require("crypto");

export function getCipherKey(password) {
  return crypto.createHash("sha256").update(password).digest();
}
