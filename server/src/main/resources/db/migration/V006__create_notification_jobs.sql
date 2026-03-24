create table notification_jobs (
    id uuid primary key,
    user_id uuid not null,
    schedule_id uuid not null,
    send_at timestamp not null,
    status varchar(20) not null default 'PENDING',
    sent_at timestamp,
    created_at timestamp not null default current_timestamp
);

create index idx_notification_jobs_schedule_id on notification_jobs(schedule_id);
create index idx_notification_jobs_send_at on notification_jobs(send_at);
