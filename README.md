# DevCommand

The "Command Center" for freelancers. Manage clients, projects, invoices, and time tracking in one efficient dashboard.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Prisma)
- **Styling:** Tailwind CSS + Shadcn/ui
- **Auth:** (Planned: Supabase/Middleware)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   This project uses Prisma with PostgreSQL.
   - Create a `.env` file (see `.env.example` if available, or use `prisma init` generated one).
   - Set your `DATABASE_URL`.
   - Run the migration (or push for prototyping):
     ```bash
     npx prisma db push
     ```
   - Generate the client:
     ```bash
     npx prisma generate
     ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Folder Structure
- `/app`: App Router pages and layouts.
  - `/dashboard`: Main overview.
  - `/projects`: Project management and Kanban.
  - `/clients`: Client directory.
  - `/invoices`: Billing and invoicing.
- `/prisma`: Database schema and config.

## Architecture
See `DevCommand-ARCHITECTURE.md` and `DevCommand-DESIGN.md` in the parent directory for details.
