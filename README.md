# Food Journal

A modern, mobile-first food journal application built with Next.js, Neon Auth, and Prisma.

## Getting Started

### Prerequisites

- Node.js
- A Neon Postgres database
- A Neon Auth (Stack Auth) project

### Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```bash
# Neon Auth environment variables
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Neon Database connection string
DATABASE_URL=your_postgres_connection_string
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Push the schema to your database:
   ```bash
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Neon Postgres
- **ORM**: Prisma
- **Authentication**: Neon Auth (Stack Auth)

## Features

- **Secure Authentication**: Powered by Neon Auth.
- **Meal Tracking**: Log meals with descriptions, quantities, and timestamps.
- **Daily View**: View meals by date with a calendar selector.
- **Mobile First**: Responsive design with a mobile navigation bar and drawers.
- **Profile Management**: Customize default preferences like meal types and dietary tags.
