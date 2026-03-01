create table applications (
 id bigserial primary key,
 discord_id text,
 discord_username text,
 answers text,
 score text,
 created_at timestamptz default now(),
 status text default 'pending',
 discord_message_id text
);

create table test_questions (
 id bigserial primary key,
 prompt text,
 correct text,
 enabled boolean default true,
 "order" int
);
