# WeCode accounts and PostgreSQL

Project: `oapnfhnvisujhrfdvklm` (WeCode). Browser config uses a publishable key only. Never place a database password, secret key or service-role key in frontend code.

## Required dashboard settings

1. Authentication → URL Configuration: set Site URL to `https://wecode-design-preview.genialhinny66.chatgpt.site`. Add `https://wecode-design-preview.genialhinny66.chatgpt.site/` and `http://localhost:5173/` to Redirect URLs.
2. Email signup requires confirmation. Configure custom SMTP before opening registration to the public; the built-in sender restricts delivery and is intended for testing.
3. Authentication → Sign In / Providers: configure Google and GitHub OAuth client IDs and secrets in Supabase. Their callback URL is `https://oapnfhnvisujhrfdvklm.supabase.co/auth/v1/callback`. The frontend checks provider settings and enables each button once its provider is enabled.
4. Google: configure an OAuth web application in Google Auth Platform. GitHub: configure an OAuth App in Developer settings. Keep client secrets in the Supabase provider settings.

The hosted Site currently remains owner-private. Its ChatGPT access gate is separate from WeCode accounts; enabling WeCode registration does not publish the Site to everybody.

## Data

The applied migration creates learning_paths, profiles, lessons, exercises, lesson_progress and user_projects. Every table has RLS enabled. Users can read/change only their own profiles, progress and projects. Published lessons/exercises are readable; clients cannot author lesson content. Two learning paths are seeded; lessons and exercises have not been populated. There is no exercise execution or progress UI yet.

## Verification

TypeScript and production build. Transactional database test verifies own-profile read/update, rejects cross-user profile updates and project inserts, and rolls back all test rows. Security advisors reported no findings after migration. A real signup/email confirmation, password reset and OAuth round trip must be tested after the dashboard configuration is finished.
