create table schedules (
    id uuid primary key,
    user_id uuid not null,
    pet_id uuid not null,
    type varchar(30) not null,
    title varchar(120) not null,
    note text,
    due_at timestamp not null,
    recurrence_type varchar(20) not null default 'NONE',
    status varchar(20) not null default 'SCHEDULED',
    completed_at timestamp,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create index idx_schedules_user_id on schedules(user_id);
create index idx_schedules_pet_id on schedules(pet_id);
create index idx_schedules_due_at on schedules(due_at);
