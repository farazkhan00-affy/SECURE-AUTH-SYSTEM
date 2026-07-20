# 🔐 Secure User Authentication System

## Ye kya hai? (Bacho wali analogy)

Socho tumhara ek ghar hai (**user account**).

1. **Password** = ghar ki normal chaabi 🔑
2. **2FA (Google Authenticator)** = ghar ke andar ek doosra lock jiski chaabi sirf tumhare **mobile** mein hoti hai aur har 30 second mein badal jaati hai. Koi chor password chura bhi le, dusra lock nahi khol sakta.
3. **OAuth 2.0 (Google Login)** = tumhare dost (Google) ke paas already tumhari ID hai, wo guard se keh deta hai "haan ye banda sahi hai, ander jaane do" — bina tumhe naya password banaye.
4. **AES-256 Encryption** = tumhara email/data ek locked box mein dala jata hai jo sirf ek khaas chaabi (encryption key) se khulta hai. Agar koi database chura bhi le, usse sirf ulta-seedha code dikhega, asli email nahi.

Ye project in chaaron cheezon ko implement karta hai — sab **free** tools se.

---

## Kaunse Free Tools use huye

| Kaam | Tool | Free? |
|---|---|---|
| Server | Node.js + Express | ✅ Free |
| 2FA | speakeasy + qrcode (npm packages) | ✅ Free |
| OAuth 2.0 | Passport.js + Google OAuth | ✅ Free (Google Cloud Console free tier) |
| Encryption | Node's built-in `crypto` module | ✅ Free (no package needed) |
| Database | JSON file (staging ke liye) / Mockaroo fake data | ✅ Free |

Koi bhi paid service, koi hosting bill, koi credit card involve nahi.

---

## Step 1: Node.js install karo (agar pehle se nahi hai)

Terminal mein check karo:
```bash
node -v
npm -v
```
Agar nahi hai to https://nodejs.org se LTS version download kar lo (free).

---

## Step 2: Project setup

Is poore folder ko apne computer par le jao, phir terminal mein:

```bash
cd secure-auth-system
npm install
```

Ye sab dependencies (express, bcryptjs, speakeasy, qrcode, passport waghera) automatically install kar dega.

---

## Step 3: `.env` file banao

```bash
cp .env.example .env
```

Phir `.env` file open karke:
- `SESSION_SECRET` mein koi bhi random lambi string daal do
- `ENCRYPTION_KEY` **exactly 32 characters** ki honi chahiye (jaisi maine example mein di hai, chahiyo to same rakh lo demo ke liye)

---

## Step 4: Google OAuth 2.0 credentials (FREE)

1. Jao: https://console.cloud.google.com/
2. Naya project banao (free)
3. "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth Client ID"
4. Application type: **Web application**
5. Authorized redirect URI mein daalo:
   ```
   http://localhost:3000/auth/google/callback
   ```
6. Jo `Client ID` aur `Client Secret` milega, wo `.env` file mein paste kar do

Ye bilkul free hai, Google koi charge nahi karta OAuth credentials banane ka.

---

## Step 5: Server chalao

```bash
npm start
```

Browser mein jao: `http://localhost:3000`

Yahan se:
- **Register** karo (email + password) → tumhara email AES-256 se encrypt ho kar `users.json` mein save hoga
- Register hote hi QR code dikhega → apne phone mein **Google Authenticator app** kholo (Play Store se free) → "Scan QR" karo
- App mein 6-digit code aayega → wahi code website par daalo → 2FA activate ho jayega
- Ab jab bhi login karoge, password ke baad 2FA code bhi maangega
- "Login with Google" button se OAuth 2.0 bhi test kar sakte ho

---

## Step 6 (Optional): Mockaroo se fake data generate karna

Agar task mein Mockaroo se fake users chahiye:
1. Jao https://mockaroo.com (free plan mein 1000 rows tak free hai)
2. Fields banao: `id`, `email`, `password`
3. Format: JSON select karke Download karo
4. Us file ko `users.json` mein daal do (ya seed script bana kar import kar lo)

---

## Submission (same tareeqa jaisa pehle tasks mein tha)

1. **GitHub**: Naya public repo banao, ye poora folder push kar do
   ```bash
   git init
   git add .
   git commit -m "Secure User Authentication System - 2FA, OAuth 2.0, AES-256"
   git branch -M main
   git remote add origin https://github.com/<your-username>/secure-auth-system.git
   git push -u origin main
   ```
   ⚠️ `.env` file ko push MAT karna (secrets hai). `.gitignore` file add karo:
   ```bash
   echo "node_modules/
.env
users.json" > .gitignore
   ```

2. **LinkedIn post**: Chota post likho, jaise:
   > "Completed my internship task at Internee.pk — Built a Secure User Authentication System with 2FA (Google Authenticator), OAuth 2.0, and AES-256 encryption using Node.js. #Internship #CyberSecurity #NodeJS"

   GitHub repo link post mein add karo, screenshot bhi laga do.

3. Task Portal mein "Submit Work" par jao aur GitHub + LinkedIn link paste kar do.

---

## Security Notes (agar koi pooche)

- Password kabhi plain text mein save nahi hota — bcrypt se hash hota hai
- Email AES-256 se encrypted store hota hai
- 2FA secret bhi TOTP standard (RFC 6238) follow karta hai, jo Google Authenticator use karta hai
- OAuth 2.0 se koi password Google ke bahar share nahi hota
