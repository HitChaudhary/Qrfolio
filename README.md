# Qrfolio

**A dynamic QR platform for creating branded QR codes and sharing your complete digital business presence in one place.**

Businesses sign up, create one profile, add their important links (menu, Google Maps, Instagram, WhatsApp, reviews and more), and download a branded QR code. Customers scan the code and land on a clean public page with every link in one place. Owners can see how many people scanned the code and which links they tapped.

**Live demo:** https://qrfolio-one.vercel.app

<!--
Add screenshots here (put the images in a /screenshots folder):

![Public profile](screenshots/public-profile.png)
![Dashboard](screenshots/dashboard.png)
![QR code page](screenshots/qr-code.png)
![Analytics](screenshots/analytics.png)
-->

---

## Features

### For business owners
- **Business profile:** name, description, category, logo, and a custom public URL (`/p/your-business`).
- **Link manager:** add, edit, hide, delete and reorder links. Built-in link types include Instagram, Facebook, Website, Google Maps, Google Reviews, WhatsApp, YouTube, LinkedIn, X, Telegram, Menu, Zomato, Swiggy, Booking, Phone and Email.
- **Branded QR code:** generated in the browser with the business logo in the centre. Download as PNG or SVG, or print it.
- **Analytics:** total scans and link clicks, with click counts for each link.
- **Google Review Assistant:** an optional page for a review link. The customer picks what they liked (options depend on the business category), gets a ready-made draft review, copies it, and is sent to the Google review page.
- **Account settings:** change password.

### For customers
- Fast, mobile-friendly public page opened by scanning the QR code, with no login needed.

### For admins
- Admin dashboard with platform-wide statistics.
- Manage all users and businesses: view, edit (including active status) and delete.
- Platform analytics.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router, Tailwind CSS 4, Axios, `qrcode`, Lucide icons |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose |
| Auth and security | JWT (7-day tokens), bcrypt password hashing, role-based access (user / admin), Helmet, CORS, `express-rate-limit` |
| File uploads | Multer (in-memory) and Cloudinary for logos |
| Deployment | Vercel (frontend), Render-style hosting for the API |

---

## How It Works

1. An owner registers, creates a business profile and adds links.
2. The QR code points to `https://<your-site>/p/<slug>`.
3. When someone opens that page, the API returns **only the public fields** (name, description, category, logo, active links, in order) and records a scan.
4. Each link on the page goes through `GET /api/go/:profileId/:linkId`, which records the click and then redirects to the stored `http(s)` URL.
5. The owner's dashboard reads the saved counts to show analytics.

### Design decisions
- **Owner-scoped data access.** Business queries always filter by the logged-in user's id from the JWT, so one user cannot read or change another user's business.
- **Admin routes are checked on the server.** Every admin route requires a valid login and then checks the admin role in the database (401 for no login, 403 for non-admins).
- **Privacy-friendly analytics.** Stats are stored as counts only: one `DailyStat` document per business per day, with no personal data.
- **Race-safe counting.** Daily counters use atomic `$inc` upserts, a unique index on `(businessId, date)`, and a retry when two requests create the same day at once.
- **Analytics never break the page.** A failed stat write is logged and the visitor still sees the profile.
- **Safe redirects.** Only links starting with `http://` or `https://` are redirected to.
- **Rate limiting** on login and register (50 per 15 minutes) and on public routes (120 per minute).
- **Upload validation.** Logos must be JPG, PNG or WEBP and 2 MB or smaller.

---

## Project Structure

```
Qrfolio/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── pages/          # Home, Login, Register, Dashboard, Links, QrCode,
│       │                   # Analytics, Settings, PublicProfile, ReviewAssistant
│       │   └── admin/      # Admin dashboard, users, businesses, analytics
│       ├── components/     # Layouts, forms, cards, ProtectedRoute, Toast
│       ├── hooks/          # useBusiness, useQr, useAnalytics, useAdmin
│       ├── context/        # AuthContext
│       └── lib/            # API client, QR generator, link types, helpers
└── server/                 # Express + TypeScript API
    └── src/
        ├── routes/         # auth, business, admin, public
        ├── controllers/    # request handlers
        ├── models/         # User, BusinessProfile, DailyStat
        ├── middleware/     # auth, guards, error handling
        ├── utils/          # token, slug, stats, cloudinary
        └── scripts/        # createAdmin
```

---

## API Overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/auth/me` | User | Current user |
| PUT | `/api/auth/password` | User | Change password |
| POST / GET | `/api/business` | User | Create or list own business |
| GET / PUT / DELETE | `/api/business/:id` | Owner | Read, update or delete a business |
| GET | `/api/business/:id/analytics` | Owner | Scans and clicks |
| POST | `/api/business/:id/links` | Owner | Add a link |
| PUT | `/api/business/:id/links/reorder` | Owner | Reorder links |
| PUT / DELETE | `/api/business/:id/links/:linkId` | Owner | Edit or delete a link |
| POST / DELETE | `/api/business/:id/logo` | Owner | Upload or remove the logo |
| GET | `/api/public/:slug` | Public | Public profile data (records a scan) |
| GET | `/api/go/:profileId/:linkId` | Public | Record a click and redirect |
| GET | `/api/admin/dashboard`, `/analytics` | Admin | Platform statistics |
| GET / PATCH / DELETE | `/api/admin/users`, `/api/admin/businesses` | Admin | Manage users and businesses |

---

## Run Locally

### Prerequisites
- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account (only needed for logo upload)

### 1. Clone and install

```bash
git clone https://github.com/HitChaudhary/Qrfolio.git
cd Qrfolio

cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/linkqr
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-string
ANALYTICS_TIMEZONE=Asia/Kolkata

# Needed only for logo upload
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Create `client/.env`:

```env
# Leave empty in development (Vite proxies /api to the server).
# In production, set this to your API origin.
VITE_API_URL=
# Public site URL encoded inside the QR code
VITE_PUBLIC_URL=http://localhost:5173
```

### 3. Start the app

```bash
# Terminal 1: API on http://localhost:5000
cd server
npm run dev

# Terminal 2: frontend on http://localhost:5173
cd client
npm run dev
```

### 4. Create an admin user (optional)

Add `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME` to `server/.env`, then run:

```bash
cd server
npm run create-admin
```

### Production build

```bash
cd server && npm run build && npm start
cd client && npm run build
```

---

## Author

**Hitkumar Chaudhary**
[Portfolio](https://hit-chaudhary.onrender.com/) | [LinkedIn](https://www.linkedin.com/in/hit-chaudhary) | [GitHub](https://github.com/HitChaudhary)
