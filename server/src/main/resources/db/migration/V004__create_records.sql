create table records (
    id uuid primary key,
    user_id uuid not null,
    pet_id uuid not null,
    type varchar(30) not null,
    title varchar(120) not null,
    note text,
    occurred_at timestamp not null,
    measurement_value numeric(10, 2),
    unit varchar(20),
    source_schedule_id uuid,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create index idx_records_user_id on records(user_id);
create index idx_records_pet_id on records(pet_id);
create index idx_records_occurred_at on records(occurred_at);
create index idx_records_source_schedule_id on records(source_schedule_id);
