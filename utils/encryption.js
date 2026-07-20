// AES-256 encryption ka kaam - sensitive data (jaise email) ko lock kar dega
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8'); // must be 32 bytes

// Data ko encrypt karo (lock lagao)
function encrypt(text) {
  const iv = crypto.randomBytes(16); // har baar naya random "lock code"
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // iv ko encrypted data ke saath save karte hain taake decrypt kar sakein
  return iv.toString('hex') + ':' + encrypted;
}

// Data ko decrypt karo (lock kholo)
function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
