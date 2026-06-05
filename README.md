# Villa Serenity — Luxury Villa Website

A complete Next.js 14 luxury villa website with public-facing pages, interactive booking system, and a secure admin panel.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: Radix UI primitives, shadcn/ui-style components
- **Database**: MongoDB + Prisma ORM
- **Auth**: NextAuth v5 (Credentials provider, JWT)
- **Email**: Nodemailer (SMTP)
- **Forms**: React Hook Form + Zod validation
- **Calendar**: React Day Picker

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

| Variable | Value |
|---|---|
| `DATABASE_URL` | MongoDB connection string (see below) |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `ADMIN_EMAIL` | Your admin login email |
| `ADMIN_PASSWORD` | Your admin login password |
| SMTP fields | Your email provider credentials |

**Getting a MongoDB URL (free):**
- **MongoDB Atlas** (recommended): [mongodb.com/atlas](https://www.mongodb.com/atlas) → create free cluster → Connect → copy the `mongodb+srv://...` string
- **Local**: Install MongoDB Community and use `mongodb://localhost:27017/villa_db`

### 3. Set up the database

```bash
npm run db:generate   # generate Prisma client
npm run db:push       # create collections in MongoDB
npm run db:seed       # create admin user + default villa settings
```

> ⚠️ MongoDB uses `db:push` only — there are no migration files. Never run `db:migrate`.

### 4. Run

```bash
npm run dev
```

| URL | Description |
|---|---|
| http://localhost:3000 | Public website |
| http://localhost:3000/admin | Admin panel |

Login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env.local`.

---

## Project Structure

```
villa-website/
├── app/
│   ├── (public)/          # Home, About, Villa, Gallery, Experiences, Booking, Contact, FAQ
│   ├── admin/             # Dashboard, Bookings, Calendar, Inquiries, Settings
│   └── api/               # bookings, availability, blocked-dates, inquiries, settings, auth
├── components/
│   ├── ui/                # Button, Input, Badge, Card, Dialog, Select, etc.
│   ├── layout/            # Header, Footer
│   ├── home/              # Hero, Features, Stats, Gallery preview, CTA
│   └── admin/             # Sidebar, BookingsTable, BookingDetail, SettingsForm
├── lib/
│   ├── prisma.ts          # Prisma singleton
│   ├── auth.ts            # NextAuth config
│   ├── email.ts           # Email helpers
│   └── utils.ts
├── prisma/
│   ├── schema.prisma      # MongoDB schema
│   └── seed.ts
└── types/index.ts
```

---

## Key Features

| Feature | Details |
|---|---|
| Booking flow | 2-step: date picker → guest details |
| Availability | Blocked from confirmed bookings + manual blocks |
| Admin dashboard | Stats, recent bookings, upcoming stays |
| Booking management | Confirm / Reject with automatic email notifications |
| Calendar | Visual calendar, manual date blocking |
| Conflict detection | Prevents double-booking on confirm |
| Settings | Villa name, capacity, pricing, contact, social links |
| Auth | JWT, middleware-protected admin routes |
| Email | Guest confirmation + admin alerts on new/status-changed bookings |

---

## Customisation

- Replace Unsplash image URLs in `components/home/` and `app/(public)/gallery/page.tsx`
- Update villa details via the admin **Settings** page
- To add payments: integrate Stripe in `app/api/bookings/route.ts`
- To enable gallery uploads: add Cloudinary/S3 + a `GalleryImage` model in `schema.prisma`

---

## Deployment

**Vercel + MongoDB Atlas (recommended):**
1. Push code to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add all env vars in Vercel project settings
4. Deploy — Vercel runs `npm run build` automatically

Then run the seed once from your local machine pointing at the Atlas URL.
