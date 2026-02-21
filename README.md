# Database Analyst - Relational Database AI Tool

A professional database analysis tool built with Next.js 15, featuring AI-powered SQL generation, schema visualization, and comprehensive database insights.

## Features

- **Authentication**: Secure email/password authentication with bcrypt
- **Data Preview**: Visual charts and statistics of your database tables
- **Key Analysis**: Detailed view of primary and foreign key relationships
- **Relationship Map**: Interactive ER diagram showing table relationships
- **AI SQL Generator**: Natural language to SQL using Google Gemini AI

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Setup Database

Run the SQL setup script against your PostgreSQL database:

```bash
psql $DATABASE_URL -f scripts/setup-database.sql
```

This creates the required `users` and `sessions` tables.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI SQL generation |

## Database Requirements

- PostgreSQL database (any version with `information_schema` support)
- Connection permissions to query `information_schema` tables
- Tables in the `public` schema (or adjust queries for your schema)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with `pg` driver
- **Auth**: Custom implementation with bcrypt
- **UI**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts
- **ER Diagrams**: React Flow
- **AI**: Google Gemini API

## Project Structure

```
├── app/
│   ├── actions/         # Server actions for auth and database
│   ├── dashboard/       # Dashboard page
│   ├── page.tsx         # Auth page
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # Reusable UI components
│   ├── dashboard-*.tsx  # Dashboard components
│   └── *.tsx            # Feature components
├── lib/
│   ├── auth.ts          # Authentication logic
│   ├── db.ts            # Database connection
│   └── schema.ts        # Schema analysis functions
└── scripts/
    └── setup-database.sql  # Database setup script
```

## License

MIT
