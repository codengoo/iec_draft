# Phase 2 — Subscribers Collection

**Plan**: [23052026 1618 newsletter-email-campaign.md](23052026%201618%20newsletter-email-campaign.md)  
**Created**: 23/05/2026 16:18  
**Status**: ✅ Done  
**Depends on**: Phase 1

## Mục tiêu

Tạo collection lưu trữ subscribers và tự động thu thập email từ JobApplications và FormBuilder submissions.

---

## Tasks

### 2.1 Tạo Subscribers collection

**File**: `src/collections/Subscribers/index.ts`

Fields:
| Field | Type | Ghi chú |
|-------|------|---------|
| `email` | email | unique, required |
| `name` | text | optional, denormalized từ nguồn |
| `source` | select | `job_application` \| `form_submission` |
| `subscribed` | checkbox | default: `true` |
| `unsubscribeToken` | text | UUID, unique, `access.read: () => false` (ẩn khỏi admin) |
| `subscribedAt` | date | readOnly, set bởi beforeChange hook |
| `unsubscribedAt` | date | readOnly, null nếu vẫn subscribed |

Access:
- `read`, `update`, `delete`: authenticated
- `create`: `() => true` (cho phép internal upsert không cần session)

Hooks:
- `beforeChange`: sinh `unsubscribeToken` (UUID v4) nếu chưa có; set `subscribedAt = now` khi `operation === 'create'`

---

### 2.2 Tạo upsertSubscriber utility

**File**: `src/utilities/email/upsertSubscriber.ts`

Logic:
1. `payload.find({ collection: 'subscribers', where: { email: { equals: email } } })`
2. Nếu không tìm thấy → `payload.create({ collection: 'subscribers', data: { email, name, source } })`
3. Nếu đã tồn tại → không làm gì (không ghi đè `subscribed: false` của user đã unsubscribe)

Signature:
```ts
upsertSubscriber(args: {
  email: string
  name?: string
  source: 'job_application' | 'form_submission'
  req: PayloadRequest
}): Promise<void>
```

---

### 2.3 Tạo syncSubscriber hook cho JobApplications

**File**: `src/collections/JobApplications/hooks/syncSubscriber.ts`

```ts
// afterChange hook
// Chỉ chạy khi operation === 'create'
// Gọi upsertSubscriber({ email: doc.email, name: doc.fullName, source: 'job_application', req })
```

**File**: `src/collections/JobApplications/index.ts`  
Thêm `syncSubscriber` vào `hooks.afterChange`

---

### 2.4 Tạo syncFormSubscriber hook cho FormSubmissions

**File**: `src/collections/FormSubmissions/hooks/syncFormSubscriber.ts`

Logic:
1. `operation === 'create'` guard
2. Fetch Form cha: `req.payload.findByID({ collection: 'forms', id: doc.form })`
3. Tìm các field có `blockType === 'email'` trong `form.fields`
4. Với mỗi email field, tìm value tương ứng trong `doc.submissionData`
5. Tìm thêm name field (blockName/label chứa 'name') để lấy tên
6. Gọi `upsertSubscriber` cho mỗi email hợp lệ tìm được

**File**: `src/plugins/index.ts`  
Thêm `formSubmissionOverrides` vào `formBuilderPlugin`:
```ts
formBuilderPlugin({
  // ... existing options
  formSubmissionOverrides: {
    hooks: {
      afterChange: [syncFormSubscriber],
    },
  },
})
```

---

### 2.5 Đăng ký Subscribers collection trong payload.config.ts

**File**: `src/payload.config.ts`  
Thêm `Subscribers` vào mảng `collections`

---

## Acceptance criteria

- [ ] Collection `subscribers` xuất hiện trong Payload admin panel
- [ ] Submit CV (bất kỳ form nào có email) → entry mới trong Subscribers
- [ ] Submit FormBuilder form có email field → entry mới trong Subscribers
- [ ] Submit CV với email đã tồn tại trong Subscribers → không tạo duplicate
- [ ] Subscriber đã unsubscribe → submit lại cũng không bị ghi đè thành subscribed

## Dependencies

- **Phase 1** phải hoàn thành trước
