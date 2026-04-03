# Supabase Setup

## 1. Create the project

Create a Supabase project, then copy the project URL and `anon` key.

## 2. Enable auth providers

In `Authentication`:

- Enable `Email`
- Enable `Anonymous Sign-Ins`

Email is for real admin logins. Anonymous sessions are what let normal visitors securely claim one free lesson and download only what they own.

## 3. Run the SQL setup

Open the Supabase SQL Editor and run `supabase/setup.sql`.

This now creates:

- `public.admin_users`
- `public.lesson_assets`
- `public.lesson_availability`
- `public.lesson_entitlements`
- `public.is_admin()`
- `public.claim_free_lesson(text)`

It also makes the storage bucket private and locks direct file access down to admins only.

## 4. Set the frontend config

Put your project values in `shared/scripts/supabaseConfig.js`:

```js
export const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
export const SUPABASE_STORAGE_BUCKET = "lesson-assets";
```

Do not put the `service_role` key in that file.

## 5. Add the Vercel server env vars

In Vercel, add:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

Use `lesson-assets` for the bucket unless you also change it in the SQL file and frontend config.

`SUPABASE_SERVICE_ROLE_KEY` is only for the Vercel API route. Never expose it in browser code.

## 6. Create the admin auth user

In `Authentication > Users`, click `Add user`, create an email/password user, and confirm it if Supabase asks.

## 7. Mark that user as an admin

Run this in the SQL Editor with the same email:

```sql
insert into public.admin_users (email)
values ('teacher@example.com')
on conflict (email) do nothing;
```

Only users listed in `public.admin_users` can open the upload dashboard or write files.

## 8. Test the secure flow

After deploy:

1. Open the public site.
2. Claim one live lesson.
3. Download it.
4. Confirm the browser is downloading through `/api/bundle-manifest` instead of directly from a public bucket.

## 9. Grant paid access manually for now

The free-claim flow is enforced now. Paid bundle fulfillment still needs either manual entitlement inserts or a real payment webhook later.

For manual testing, you can grant one lesson like this:

```sql
insert into public.lesson_entitlements (user_id, slice_key, source)
values ('USER_UUID_HERE', 'M7NS-Ia_7_Q1_slice-1', 'manual');
```

You can inspect the user UUID from `Authentication > Users`.
