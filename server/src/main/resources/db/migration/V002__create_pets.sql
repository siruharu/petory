create table pets (
    id uuid primary key,
    user_id uuid not null,
    name varchar(100) not null,
    species varchar(20) not null,
    breed varchar(100),
    sex varchar(20),
    neutered_status varchar(20),
    birth_date date,
    age_text varchar(50),
    weight numeric(8, 2),
    note text,
    photo_url text,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create index idx_pets_user_id on pets(user_id);
