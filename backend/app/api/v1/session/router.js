const express = require('express');
const router = express.Router();
// Cek session
router.get('/get', (req, res) => {
  if (req.session.user) {
    res.json({ message: 'Session ditemukan', session: req.session.user });
  } else {
    res.status(404).json({ message: 'Tidak ada session' });
  }
});

// Hapus session
router.delete('/destroy', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Gagal hapus session' });
    res.json({ message: 'Session dihapus' });
  });
});

module.exports = router;
