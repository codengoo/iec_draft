# Phase 1 — Email Infrastructure

**Plan**: [23052026 1618 newsletter-email-campaign.md](23052026%201618%20newsletter-email-campaign.md)  
**Created**: 23/05/2026 16:18  
**Status**: ⬜ Not Started

## Mục tiêu

Cài đặt email adapter và cấu hình Payload CMS để có thể gửi email thực. Hỗ trợ đồng thời cả Nodemailer (SMTP) và Resend, chuyển đổi bằng env var.

---

## Tasks

### 1.1 Cài dependencies

```bash
pnpm add @payloadcms/email-nodemailer @payloadcms/email-resend
```

**File**: `package.json`

---

### 1.2 Tạo email adapter factory

**File**: `src/utilities/email/getAdapter.ts`

- Đọc `process.env.EMAIL_PROVIDER` (`'nodemailer'` | `'resend'`)
- Nếu `nodemailer`: trả về `nodemailerAdapter` cấu hình từ `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Nếu `resend`: trả về adapter Resend cấu hình từ `RESEND_API_KEY`
- `defaultFromAddress`: `process.env.EMAIL_FROM`
- `defaultFromName`: `process.env.EMAIL_FROM_NAME`

---

### 1.3 Thêm email vào payload.config.ts

**File**: `src/payload.config.ts`

```ts
import { getEmailAdapter } from '@/utilities/email/getAdapter'

export default buildConfig({
  // ... existing config
  email: getEmailAdapter(),
})
```

---

## Env vars cần thêm vào `.env`

```env
EMAIL_PROVIDER=nodemailer
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=IEC Team
SITE_URL=https://example.com

# Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=yourpassword

# Resend (dùng thay thế khi EMAIL_PROVIDER=resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
```

---

## Acceptance criteria

- [ ] `pnpm build` không lỗi
- [ ] Đặt `EMAIL_PROVIDER=nodemailer` + SMTP creds → Payload có thể gửi email (kiểm tra qua Payload auth forgot-password)
- [ ] Đặt `EMAIL_PROVIDER=resend` + API key → tương tự

## Dependencies

- Không có phase nào phải hoàn thành trước
- **Phase 2, 3, 4, 5 đều phụ thuộc vào phase này**
