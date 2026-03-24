# Task 12

## Goal
SMTP 기반 메일 발송 어댑터 스켈레톤을 추가한다.

## Files
- server/src/main/kotlin/com/petory/auth/SmtpMailSenderAdapter.kt
- server/src/main/kotlin/com/petory/config/MailConfig.kt

## Requirements
- `MailSenderPort` 구현체를 추가한다.
- Spring Mail bean 또는 설정 연결 자리를 만든다.
- verification 링크 조립 구조를 포함한다.

## Constraints
- 선행 task: `task-11-mail-sender-port.md`, `task-02-auth-application-config.md`
- 실제 provider 자격 증명은 넣지 않는다.

## Done Criteria
- 메일 발송 구현체가 생성되고 AuthService에서 주입 가능한 구조가 된다.

