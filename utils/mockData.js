// Ye humari "staging database" hai - fake users store karne ke liye
// (Mockaroo.com se bhi fake CSV/JSON bana kar yahan daal sakte ho)
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'users.json');

function loadUsers() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function findUserByEmail(encryptedEmail) {
  const users = loadUsers();
  return users.find(u => u.email === encryptedEmail);
}

function addUser(user) {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
}

function updateUser(id, updates) {
  const users = loadUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
  }
}

module.exports = { loadUsers, saveUsers, findUserByEmail, addUser, updateUser };
