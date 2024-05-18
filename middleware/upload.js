const util = require("util");
const Multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).array("files", 5)

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;