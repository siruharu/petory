create table notification_tokens (
    id uuid primary key,
    user_id uuid not null,
    device_type varchar(20) not null,
    push_token text not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);

create index idx_notification_tokens_user_id on notification_tokens(user_id);
