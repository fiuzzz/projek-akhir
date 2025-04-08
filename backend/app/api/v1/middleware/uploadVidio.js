const multer = require("multer");
const path = require("path");

// Menentukan tipe file yang diizinkan
const FILE_TYPE = {
  "video/mp4": "mp4",
  "video/avi": "avi",
  "video/x-matroska": "mkv", 
  "video/quicktime": "mov", 
  "video/x-ms-wmv": "wmv",
  "video/x-flv": "flv",
  "video/webm": "webm",
};

// Menentukan direktori penyimpanan dan nama file yang disimpan
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/public/uploads"); // Pastikan folder ini ada
  },

  filename: function (req, file, cb) {
    // Custom file name, sesuaikan dengan kebutuhan
    const date = new Date();
    const format =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") + // Menambahkan 1 karena bulan dimulai dari 0
      "-" +
      String(date.getDate()).padStart(2, "0") +
      "-" +
      String(date.getHours()).padStart(2, "0") + // Menggunakan jam
      "-" +
      String(date.getMinutes()).padStart(2, "0") + // Menggunakan menit
      "-" +
      String(date.getSeconds()).padStart(2, "0"); // Menggunakan detik
    cb(null, file.fieldname + "-" + format + "." + FILE_TYPE[file.mimetype]);
  },
});

// Memeriksa ekstensi file yang diizinkan
const fileFilter = (req, file, cb) => {
  const mimetype = FILE_TYPE[file.mimetype];
  if (mimetype) {
    return cb(null, true);
  }
  cb(new Error("Error: File upload hanya diperbolehkan untuk format video!"));
};

// Memeriksa ukuran file yang diizinkan
const limits = {
  fileSize: 100 * 1024 * 1024, // Maksimal ukuran file adalah 100MB
};

const uploadVideo = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = uploadVideo;
