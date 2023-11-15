const multer = require('multer');
const storage = multer.memoryStorage();
const maxSize = 3 * 1048576;
const upload = multer({ storage: storage });

module.exports = upload;
