
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cek dan buat folder jika belum ada
const uploadDir = "app/public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Format file yang diizinkan
const FILE_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "video/mp4": "mp4",
  "video/avi": "avi",
  "video/x-matroska": "mkv",
  "video/quicktime": "mov",
  "video/x-ms-wmv": "wmv",
  "video/x-flv": "flv",
  "video/webm": "webm",
};

// Konfigurasi penyimpanan di disk
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const ext = FILE_TYPE[file.mimetype];
    if (!ext) {
      return cb(new Error("Format file tidak didukung!"));
    }

    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, ""); // Format timestamp lebih rapi
    cb(null, `${file.fieldname}-${timestamp}.${ext}`);
  },
});

// Filter file berdasarkan tipe
const fileFilter = (req, file, cb) => {
  if (FILE_TYPE[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("Error: Format file tidak didukung!"));
  }
};

// Batas ukuran file
const limits = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, { fileSize: 50 * 1024 * 1024 }); // Maksimal 5MB untuk gambar
  } else if (file.mimetype.startsWith("video/")) {
    cb(null, { fileSize: 50 * 1024 * 1024 }); // Maksimal 100MB untuk video
  } else {
    cb(new Error("Tipe file tidak didukung!"));
  }
};

// Middleware upload
const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // Maksimal 100MB (untuk video, gambar tetap 5MB)
  },
});


module.exports = { upload, uploadErrorHandler };
