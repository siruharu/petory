create table users (
    id varchar(36) primary key,
    email varchar(255) not null unique,
    password_hash varchar(255) not null,
    email_verified boolean not null default false,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create unique index idx_users_email on users(email);
