# Phase 4 — Email Campaigns

**Plan**: [23052026 1618 newsletter-email-campaign.md](23052026%201618%20newsletter-email-campaign.md)  
**Created**: 23/05/2026 16:18  
**Status**: ⬜ Not Started  
**Depends on**: Phase 1, Phase 2, Phase 3

## Mục tiêu

Tạo hệ thống quản lý và gửi email campaign. Admin có thể tạo campaign thủ công hoặc campaign sẽ được tạo tự động (Phase 5). Mỗi email gửi đi đều có link unsubscribe. Template cho Job và Post có thể tùy chỉnh.

---

## Tasks

### 4.1 Tạo EmailCampaigns collection

**File**: `src/collections/EmailCampaigns/index.ts`

Fields:
| Field | Type | Ghi chú |
|-------|------|---------|
| `name` | text | required, internal name (hiển thị trong admin list) |
| `subject` | text | required, hỗ trợ token `{{job.title}}`, `{{post.title}}` |
| `previewText` | text | optional, đoạn preview trong email client |
| `type` | select | `manual` \| `new_job` \| `new_post`, default `manual` |
| `body` | richText | Lexical editor, dùng cho type `manual` |
| `relatedJob` | relationship | → `jobs`, hiển thị conditional khi type = `new_job` |
| `relatedPost` | relationship | → `posts`, hiển thị conditional khi type = `new_post` |
| `status` | select | `draft` \| `sending` \| `sent`, default `draft` |
| `sentAt` | date | readOnly, set bởi sendCampaign |
| `recipientCount` | number | readOnly, set bởi sendCampaign |

Access: tất cả operations yêu cầu `authenticated`

Admin:
- `admin.components.afterFields: [SendButton]` — nút Send trong document view
- `admin.defaultColumns: ['name', 'type', 'status', 'sentAt', 'recipientCount']`

---

### 4.2 Tạo email HTML templates

#### Base layout
**File**: `src/utilities/email/templates/base.ts`

```ts
// Nhận: { previewText, bodyHtml, unsubscribeUrl, siteUrl, logoUrl? }
// Trả về: string (HTML hoàn chỉnh)
// Bao gồm: responsive layout, header logo, content area, footer với unsubscribe link
// Inline CSS để đảm bảo tương thích email clients
```

#### New Job template
**File**: `src/utilities/email/templates/newJob.ts`

```ts
// Input: { job: { id, title, description?, ... }, subscriber: { name }, unsubscribeUrl, siteUrl }
// Output: { html: string, subject: string }
// Nội dung: job title, tóm tắt mô tả, CTA button "Xem chi tiết" → /career/[jobId]
```

#### New Post template
**File**: `src/utilities/email/templates/newPost.ts`

```ts
// Input: { post: { title, excerpt?, slug, ... }, subscriber: { name }, unsubscribeUrl, siteUrl }
// Output: { html: string, subject: string }
// Nội dung: post title, excerpt, CTA button "Đọc thêm" → /posts/[slug]
```

#### Manual campaign template
**File**: `src/utilities/email/templates/manual.ts`

```ts
// Input: { subject, bodyHtml, subscriber: { name }, unsubscribeUrl }
// Output: { html: string, subject: string }
// Nội dung: render body richText (đã convert Lexical → HTML) trong base layout
```

---

### 4.3 Tạo sendCampaign utility

**File**: `src/utilities/email/sendCampaign.ts`

Logic:
1. Fetch campaign bằng ID (populate `relatedJob`, `relatedPost`)
2. Guard: nếu `status !== 'draft'` → throw error "Campaign already sent"
3. Update campaign `status: 'sending'`
4. Resolve subject tokens (thay `{{job.title}}` với job title thực tế, v.v.)
5. Fetch tất cả subscribers `subscribed: true`, paginated (limit 100, loop qua tất cả pages)
6. Với mỗi subscriber:
   - Tạo `unsubscribeUrl` từ `subscriber.unsubscribeToken`
   - Render template tương ứng theo `campaign.type`
   - Gọi `req.payload.sendEmail({ to: subscriber.email, subject, html })`
7. **Batching**: gửi 50 email/batch, delay 200ms giữa các batch
8. Update campaign: `status: 'sent', sentAt: new Date(), recipientCount: totalSent`

Signature:
```ts
sendCampaign(args: {
  campaignId: string
  req: PayloadRequest
}): Promise<{ recipientCount: number }>
```

---

### 4.4 Tạo send endpoint

**File**: `src/endpoints/sendCampaign.ts`

```ts
// POST /api/email-campaigns/send
// Body: { campaignId: string }
// Auth: yêu cầu user đăng nhập (kiểm tra req.user)
// Guards:
//   - Campaign tồn tại
//   - Campaign status === 'draft'
// Gọi: sendCampaign({ campaignId, req })
// Response: { success: true, recipientCount: number }
// Error: 400 nếu không hợp lệ, 401 nếu chưa auth, 500 nếu lỗi gửi
```

**File**: `src/payload.config.ts`  
Thêm `sendCampaignEndpoint` vào `endpoints:`

---

### 4.5 Tạo SendButton admin component

**File**: `src/collections/EmailCampaigns/ui/SendButton.tsx`

```tsx
// 'use client'
// Props: nhận document data từ Payload admin context (useDocumentInfo hook)
// Hiển thị: chỉ khi campaign status === 'draft'
// Khi click:
//   1. fetch('POST /api/email-campaigns/send', { campaignId })
//   2. Loading state: disable button + spinner
//   3. Thành công: toast "Đã gửi thành công đến X subscribers" + refresh document
//   4. Lỗi: toast error message
```

---

### 4.6 Đăng ký EmailCampaigns collection

**File**: `src/payload.config.ts`  
Thêm `EmailCampaigns` vào mảng `collections`

---

## Acceptance criteria

- [ ] Collection `email-campaigns` hiển thị trong admin panel
- [ ] Tạo campaign type `manual` → button "Send" xuất hiện trong sidebar
- [ ] Click Send → campaign status chuyển thành `sent`, `recipientCount` được cập nhật
- [ ] Email nhận được có: subject đúng, nội dung đúng, link unsubscribe hoạt động
- [ ] Campaign đã `sent` → button Send không hiển thị nữa
- [ ] Gửi campaign tới 0 subscriber → không lỗi, `recipientCount: 0`

## Dependencies

- **Phase 1**: cần email adapter để `sendEmail()` hoạt động
- **Phase 2**: cần Subscribers collection
- **Phase 3**: cần `getUnsubscribeUrl` utility
