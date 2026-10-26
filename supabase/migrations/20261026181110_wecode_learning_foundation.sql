create table public.learning_paths (
 id text primary key check (id in ('front','back')),
 title_ru text not null, title_en text not null
);
insert into public.learning_paths values ('front','Frontend-разработка','Frontend development'),('back','Python / backend','Python / backend');
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (char_length(display_name)<=80),
 path_id text references public.learning_paths(id),
 level smallint not null default 0 check (level between 0 and 2),
 created_at timestamptz not null default now()
);
create index profiles_path_idx on public.profiles(path_id);
create table public.lessons (
 id uuid primary key default gen_random_uuid(),
 path_id text not null references public.learning_paths(id),
 slug text not null unique, title_ru text not null, title_en text not null,
 content_ru text not null default '', content_en text not null default '',
 position integer not null check(position>=0), published boolean not null default false,
 unique(path_id,position)
);
create table public.exercises (
 id uuid primary key default gen_random_uuid(),
 lesson_id uuid not null references public.lessons(id) on delete cascade,
 title text not null, description text not null,
 difficulty smallint not null default 0 check(difficulty between 0 and 2),
 published boolean not null default false
);
create index exercises_lesson_idx on public.exercises(lesson_id);
create table public.lesson_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id uuid not null references public.lessons(id) on delete cascade,
 completed boolean not null default false,
 updated_at timestamptz not null default now(),
 primary key(user_id,lesson_id)
);
create index lesson_progress_lesson_idx on public.lesson_progress(lesson_id);
create table public.user_projects (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 1 and 120),
 description text not null default '' check(char_length(description)<=5000),
 repository_url text check(repository_url is null or repository_url ~ '^https://'),
 created_at timestamptz not null default now()
);
create index user_projects_user_idx on public.user_projects(user_id);
alter table public.learning_paths enable row level security;
alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.exercises enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.user_projects enable row level security;
revoke all on public.learning_paths,public.profiles,public.lessons,public.exercises,public.lesson_progress,public.user_projects from anon,authenticated;
grant select on public.learning_paths,public.lessons,public.exercises to anon,authenticated;
grant select,insert,update on public.profiles to authenticated;
grant select,insert,update,delete on public.lesson_progress,public.user_projects to authenticated;
create policy paths_read on public.learning_paths for select to anon,authenticated using(true);
create policy lessons_published on public.lessons for select to anon,authenticated using(published);
create policy exercises_published on public.exercises for select to anon,authenticated using(published and exists(select 1 from public.lessons where id=lesson_id and published));
create policy profile_read on public.profiles for select to authenticated using((select auth.uid())=id);
create policy profile_create on public.profiles for insert to authenticated with check((select auth.uid())=id);
create policy profile_update on public.profiles for update to authenticated using((select auth.uid())=id) with check((select auth.uid())=id);
create policy progress_owned on public.lesson_progress for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id and exists(select 1 from public.lessons where id=lesson_id and published));
create policy projects_owned on public.user_projects for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
