# Phase 3 — Unsubscribe Flow

**Plan**: [23052026 1618 newsletter-email-campaign.md](23052026%201618%20newsletter-email-campaign.md)  
**Created**: 23/05/2026 16:18  
**Status**: ✅ Done  
**Depends on**: Phase 2

## Mục tiêu

Cho phép subscriber hủy đăng ký nhận email bằng cách click link trong email. Tuân thủ GDPR/CAN-SPAM. Link dạng `https://site.com/vi/unsubscribe?token=UUID`.

---

## Tasks

### 3.1 Tạo Payload custom endpoint unsubscribe

**File**: `src/endpoints/unsubscribe.ts`

```ts
// GET /api/unsubscribe?token=TOKEN
// 1. Validate token param tồn tại
// 2. payload.find({ collection: 'subscribers', where: { unsubscribeToken: { equals: token } } })
// 3. Nếu không tìm thấy → return 404 { error: 'Invalid or expired token' }
// 4. Nếu tìm thấy → payload.update({ id, data: { subscribed: false, unsubscribedAt: new Date().toISOString() } })
// 5. return 200 { success: true }
```

**File**: `src/payload.config.ts`  
Đăng ký endpoint trong `endpoints: [unsubscribeEndpoint]`

---

### 3.2 Tạo unsubscribe page (frontend)

**File**: `src/app/(frontend)/[locale]/unsubscribe/page.tsx`

- Server component
- Đọc `searchParams.token`
- Gọi trực tiếp `getPayload()` để update subscriber (không qua HTTP)
- Hiển thị 3 trạng thái:
  - **Thành công**: "Bạn đã hủy đăng ký thành công" + link về trang chủ
  - **Token không hợp lệ**: "Link không hợp lệ hoặc đã hết hạn"
  - **Đã unsubscribe rồi**: "Bạn đã hủy đăng ký trước đó"
- Dùng `next-intl` cho text localization

---

### 3.3 Thêm i18n keys

**File**: `messages/en.json`
```json
{
  "unsubscribe": {
    "title": "Unsubscribe",
    "success": "You have successfully unsubscribed.",
    "successDescription": "You will no longer receive emails from us.",
    "alreadyUnsubscribed": "You have already unsubscribed.",
    "invalidToken": "This unsubscribe link is invalid or has expired.",
    "backHome": "Back to homepage"
  }
}
```

**File**: `messages/vi.json`
```json
{
  "unsubscribe": {
    "title": "Hủy đăng ký",
    "success": "Bạn đã hủy đăng ký thành công.",
    "successDescription": "Bạn sẽ không còn nhận email từ chúng tôi nữa.",
    "alreadyUnsubscribed": "Bạn đã hủy đăng ký trước đó.",
    "invalidToken": "Link hủy đăng ký không hợp lệ hoặc đã hết hạn.",
    "backHome": "Về trang chủ"
  }
}
```

---

### 3.4 Template helper cho unsubscribe URL

**File**: `src/utilities/email/getUnsubscribeUrl.ts`

```ts
// Tạo URL unsubscribe từ token
// export function getUnsubscribeUrl(token: string, locale = 'vi'): string {
//   return `${process.env.SITE_URL}/${locale}/unsubscribe?token=${token}`
// }
```

> Utility này được dùng ở Phase 4 khi render email templates.

---

## Acceptance criteria

- [ ] `GET /api/unsubscribe?token=VALID_TOKEN` → subscriber `subscribed: false`
- [ ] `GET /api/unsubscribe?token=INVALID_TOKEN` → 404 response
- [ ] `/vi/unsubscribe?token=VALID_TOKEN` → trang hiển thị "Hủy đăng ký thành công"
- [ ] `/en/unsubscribe?token=VALID_TOKEN` → trang hiển thị "Unsubscribed successfully"
- [ ] Click unsubscribe → subscriber không còn nhận email ở lần gửi tiếp theo

## Dependencies

- **Phase 2** phải hoàn thành trước (cần có `unsubscribeToken` trong subscriber)
