create table email_verification_tokens (
    id varchar(36) primary key,
    user_id varchar(36) not null,
    token varchar(255) not null unique,
    expires_at timestamp not null,
    used_at timestamp null,
    created_at timestamp not null default current_timestamp,
    constraint fk_email_verification_tokens_user_id
        foreign key (user_id) references users(id)
);

create index idx_email_verification_tokens_user_id
    on email_verification_tokens(user_id);

create unique index idx_email_verification_tokens_token
    on email_verification_tokens(token);
