const express = require('express');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const passport = require('passport');
const { encrypt, decrypt } = require('../utils/encryption');

// Simple unique ID generator (koi extra package ki zaroorat nahi)
function uuidv4() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
const { loadUsers, findUserByEmail, addUser, updateUser } = require('../utils/mockData');

const router = express.Router();

// ---------- 1) REGISTER (email encrypted with AES-256, password hashed) ----------
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email aur password dono chahiye' });

  const encryptedEmail = encrypt(email);
  if (findUserByEmail(encryptedEmail)) {
    return res.status(400).json({ error: 'User pehle se exist karta hai' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    email: encryptedEmail,     // AES-256 se encrypted
    password: hashedPassword,  // bcrypt se hashed
    twoFASecret: null,
    twoFAEnabled: false
  };
  addUser(newUser);

  res.json({ message: 'Registration successful', userId: newUser.id });
});

// ---------- 2) LOGIN (password check, phir agar 2FA on hai to token maango) ----------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const encryptedEmail = encrypt(email);
  const user = findUserByEmail(encryptedEmail);

  if (!user) return res.status(400).json({ error: 'User nahi mila' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Galat password' });

  if (user.twoFAEnabled) {
    // Password sahi hai lekin ab 2FA code bhi chahiye
    return res.json({ requires2FA: true, userId: user.id });
  }

  req.session.userId = user.id;
  res.json({ message: 'Login successful', requires2FA: false });
});

// ---------- 3) 2FA SETUP (QR code generate hota hai, Google Authenticator se scan karo) ----------
router.get('/2fa/setup/:userId', async (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User nahi mila' });

  const secret = speakeasy.generateSecret({ name: `SecureAuthApp (${user.id})` });
  updateUser(user.id, { twoFASecret: secret.base32 });

  const qrImage = await qrcode.toDataURL(secret.otpauth_url);
  res.json({ qrCodeImage: qrImage, manualSecret: secret.base32 });
});

// ---------- 4) 2FA VERIFY (Google Authenticator app wala 6-digit code check hota hai) ----------
router.post('/2fa/verify', (req, res) => {
  const { userId, token } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.id === userId);
  if (!user || !user.twoFASecret) return res.status(400).json({ error: '2FA setup nahi hua' });

  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: 'base32',
    token,
    window: 1
  });

  if (!verified) return res.status(400).json({ error: 'Galat 2FA code' });

  updateUser(user.id, { twoFAEnabled: true });
  req.session.userId = user.id;
  res.json({ message: '2FA verified, login complete!' });
});

// ---------- 5) GOOGLE OAuth 2.0 LOGIN ----------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    req.session.userId = req.user.id;
    res.redirect('/');
  }
);

module.exports = router;
