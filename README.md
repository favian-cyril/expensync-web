# ExpenSync web client

Web client for ExpenSync based on supabase. Production link: https://expensync.com
## Tech Stack
 
SvelteKit, Tailwind, DaisyUI, Supabase-js, chart.js, Dinero, dayjs.
 
## Project setup

.env structure
```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIRECT_SETUP_EMAIL_URL=
```
run install npm
```
npm i
```
generate supabase types 
```
npx supabase link --project-ref {project}
npx supabase gen types typescript --linked > src/lib/database.types.ts
```
run project
```
npm run dev
```