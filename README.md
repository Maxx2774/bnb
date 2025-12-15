## Instruktioner

1. `npm install`

2. Skapa en fil `.env.local` i projektets rot med följande innehåll:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=din_supabase_url
SUPABASE_URL=din_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=din_supabase_publishable_key
SUPABASE_KEY=din_supabase_publishable_key
```

3. `npm run dev`

4. Öppna [http://localhost:3000](http://localhost:3000)