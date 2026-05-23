# Newsletter / Email Campaign Feature — Plan

**Created**: 23/05/2026 16:18  
**Status**: In Progress

## Mục tiêu

Xây dựng tính năng gửi email cho những người theo dõi trang (subscribers), thu thập email tự động từ:
- Người nộp CV (`JobApplications`)
- Người điền form (`FormBuilder` submissions)

Hỗ trợ gửi campaign thủ công và tự động khi có Job/Post mới. Tuân thủ GDPR/CAN-SPAM qua link unsubscribe trong mỗi email.

---

## Phases

| # | File | Nội dung | Status |
|---|------|----------|--------|
| 1 | [23052026 1618 phase-1-email-infrastructure.md](23052026%201618%20phase-1-email-infrastructure.md) | Cài email adapter, cấu hình payload | ⬜ Not Started |
| 2 | [23052026 1618 phase-2-subscribers.md](23052026%201618%20phase-2-subscribers.md) | Subscribers collection + sync hooks | ⬜ Not Started |
| 3 | [23052026 1618 phase-3-unsubscribe.md](23052026%201618%20phase-3-unsubscribe.md) | Unsubscribe endpoint + page | ⬜ Not Started |
| 4 | [23052026 1618 phase-4-email-campaigns.md](23052026%201618%20phase-4-email-campaigns.md) | EmailCampaigns collection + templates + send | ⬜ Not Started |
| 5 | [23052026 1618 phase-5-automation.md](23052026%201618%20phase-5-automation.md) | Auto-notify hooks khi publish Job/Post | ⬜ Not Started |

---

## Quyết định thiết kế

- **Không cần opt-in** — tất cả email nộp CV/form đều tự thành subscriber
- **Không re-subscribe** user đã unsubscribe — admin phải làm thủ công
- **Dual adapter** — cài cả `@payloadcms/email-nodemailer` và `@payloadcms/email-resend`, switch bằng `EMAIL_PROVIDER` env var
- **Auto-create campaign khi publish** — để có lịch sử gửi trong EmailCampaigns collection
- **Batch sending**: 50 email/lần, delay 200ms giữa các batch

## Env vars cần thêm

```env
EMAIL_PROVIDER=nodemailer   # hoặc: resend
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME="IEC Team"
SITE_URL=https://example.com

# Nodemailer:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...

# Resend:
RESEND_API_KEY=re_...
```

## Files sẽ tạo/sửa

### Mới
- `src/collections/Subscribers/index.ts`
- `src/collections/EmailCampaigns/index.ts`
- `src/collections/EmailCampaigns/ui/SendButton.tsx`
- `src/collections/JobApplications/hooks/syncSubscriber.ts`
- `src/collections/FormSubmissions/hooks/syncFormSubscriber.ts`
- `src/collections/Jobs/hooks/notifySubscribers.ts`
- `src/collections/Posts/hooks/notifySubscribers.ts`
- `src/utilities/email/getAdapter.ts`
- `src/utilities/email/upsertSubscriber.ts`
- `src/utilities/email/sendCampaign.ts`
- `src/utilities/email/templates/base.ts`
- `src/utilities/email/templates/newJob.ts`
- `src/utilities/email/templates/newPost.ts`
- `src/utilities/email/templates/manual.ts`
- `src/endpoints/unsubscribe.ts`
- `src/endpoints/sendCampaign.ts`
- `src/app/(frontend)/[locale]/unsubscribe/page.tsx`

### Sửa
- `src/payload.config.ts` — thêm email adapter, collections, endpoints
- `src/plugins/index.ts` — thêm `formSubmissionOverrides`
- `src/collections/JobApplications/index.ts` — thêm afterChange hook
- `src/collections/Jobs/index.ts` — thêm afterChange hook
- `src/collections/Posts/index.ts` — thêm afterChange hook
- `messages/en.json` — i18n keys unsubscribe
- `messages/vi.json` — i18n keys unsubscribe
- `package.json` — dependencies mới

---

## Verification checklist

- [ ] `pnpm install` + `pnpm build` — không có lỗi TypeScript
- [ ] Submit CV → Subscribers có entry mới (nodemailer provider)
- [ ] Submit form có email field → Subscribers có entry mới (resend provider)
- [ ] Publish Job → EmailCampaign tự tạo + gửi → inbox nhận được
- [ ] Publish Post → tương tự
- [ ] Tạo manual campaign → Send → `status: sent`
- [ ] Click unsubscribe link → subscriber `subscribed: false`
- [ ] Unsubscribed user không nhận email campaign tiếp theo
