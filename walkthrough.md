# Walkthrough - Task & Project Management Dashboard (With OTP Password Reset)

We transformed your Node/Express/MongoDB codebase into a production-grade **Task & Project Management Dashboard** complete with **OTP Password Reset** capabilities, **Bcrypt security**, and no arbitrary length constraints on username or password.

---

## 🛠️ Updated Features & Enhancements

### 1. OTP Password Reset Flow
- **[config/mailer.js](file:///c:/Users/user/Desktop/javascript-backend/config/mailer.js)**: Integrates `nodemailer` to dispatch 6-digit OTP codes via email. Prominently prints OTPs to the terminal console during development for instant testing.
- **[views/forgot-password.ejs](file:///c:/Users/user/Desktop/javascript-backend/views/forgot-password.ejs)**: User inputs their registered email.
- **[views/reset-password.ejs](file:///c:/Users/user/Desktop/javascript-backend/views/reset-password.ejs)**: User inputs the 6-digit OTP code and their new password.
- **[controllers/authController.js](file:///c:/Users/user/Desktop/javascript-backend/controllers/authController.js)**:
  - Generates secure 6-digit OTP with a 10-minute expiry time (`resetOTPExpires`).
  - Verifies OTP, hashes new password with `bcryptjs`, and updates MongoDB.

### 2. Removed Username & Password Length Constraints
- Updated **[models/user.js](file:///c:/Users/user/Desktop/javascript-backend/models/user.js)** and **[controllers/authController.js](file:///c:/Users/user/Desktop/javascript-backend/controllers/authController.js)**:
  - Removed arbitrary `minlength` checks (`minlength: 3` and `minlength: 6`).
  - Retained strict email regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) to guarantee proper email syntax for OTP delivery.

---

## 🔑 Complete Route Map

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/register` | GET / POST | Guest | User registration with email regex check |
| `/login` | GET / POST | Guest | Password verification with bcrypt |
| `/forgot-password` | GET / POST | Guest | Generates 6-digit OTP & sends email |
| `/reset-password` | GET / POST | Guest | Verifies OTP code & updates password |
| `/dashboard` | GET | Protected | Main task workspace with filter & analytics |
| `/tasks/create` | POST | Protected | Quick task creation |
| `/tasks/:id/status` | POST | Protected | Toggle status (`pending`, `in_progress`, `completed`) |
| `/tasks/:id/delete` | POST | Protected | Delete task |
| `/logout` | GET | Protected | Destroys session |

---

## ⚡ How to Test Password Reset

1. Start server with `npm start`.
2. Go to `http://localhost:3000/login` and click **"Forgot Password?"**.
3. Enter your registered email and submit.
4. Check your **terminal console log** to see the generated OTP code (e.g. `🔑 PASSWORD RESET OTP FOR user@example.com: 482910`).
5. Enter the OTP code on the reset page along with your new password to finish resetting!
