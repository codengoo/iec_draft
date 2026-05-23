# Phase 5 — Automation Hooks (Notify on Publish)

**Plan**: [23052026 1618 newsletter-email-campaign.md](23052026%201618%20newsletter-email-campaign.md)  
**Created**: 23/05/2026 16:18  
**Status**: ⬜ Not Started  
**Depends on**: Phase 4

## Mục tiêu

Tự động gửi email cho tất cả subscribers khi admin publish Job mới hoặc Post mới. Campaign được tạo tự động và lưu vào EmailCampaigns collection để có lịch sử gửi.

---

## Tasks

### 5.1 Tạo notifySubscribers hook cho Jobs

**File**: `src/collections/Jobs/hooks/notifySubscribers.ts`

```ts
// afterChange hook
// Guard: doc._status === 'published' && previousDoc?._status !== 'published'
// (Chỉ kích hoạt lần đầu publish, không kích hoạt khi save lại bài đã published)
//
// Logic:
// 1. Tạo EmailCampaign mới:
//    payload.create({
//      collection: 'email-campaigns',
//      data: {
//        name: `[Auto] New Job: ${doc.title}`,
//        subject: 'Cơ hội việc làm mới: {{job.title}}',
//        type: 'new_job',
//        relatedJob: doc.id,
//        status: 'draft',
//      }
//    })
// 2. Gọi sendCampaign({ campaignId: campaign.id, req })
```

**File**: `src/collections/Jobs/index.ts`  
Thêm `notifyJobSubscribers` vào `hooks.afterChange`

> **Lưu ý**: Jobs collection hiện không có `_status` guard trong `revalidateJob`. Cần kiểm tra `doc._status` có tồn tại không. Nếu Jobs không track `_status` thì dùng `previousDoc === null` (lần create đầu tiên) hoặc thêm điều kiện khác.

---

### 5.2 Tạo notifySubscribers hook cho Posts

**File**: `src/collections/Posts/hooks/notifySubscribers.ts`

```ts
// afterChange hook
// Guard: doc._status === 'published' && previousDoc?._status !== 'published'
// (Posts đã có schedulePublish và _status tracking — guard này hoạt động đúng)
//
// Logic:
// 1. Tạo EmailCampaign mới:
//    payload.create({
//      collection: 'email-campaigns',
//      data: {
//        name: `[Auto] New Post: ${doc.title}`,
//        subject: 'Bài viết mới: {{post.title}}',
//        type: 'new_post',
//        relatedPost: doc.id,
//        status: 'draft',
//      }
//    })
// 2. Gọi sendCampaign({ campaignId: campaign.id, req })
```

**File**: `src/collections/Posts/index.ts`  
Thêm `notifyPostSubscribers` vào `hooks.afterChange`

---

### 5.3 Kiểm tra edge cases

| Case | Expected behavior |
|------|-------------------|
| Publish → Unpublish → Publish lại | Gửi email lần 2 ✅ (mỗi lần publish đều notify — chấp nhận được) |
| Auto-save khi đã published | Không gửi (guard `previousDoc._status === 'published'` chặn) |
| schedulePublish ở tương lai → đến giờ tự publish | Gửi đúng (Payload set `_status: 'published'` trong afterChange) |
| Không có subscribers | Không lỗi, campaign tạo với `recipientCount: 0` |
| Email adapter lỗi (SMTP down) | Log lỗi, campaign ở `status: 'draft'` không chuyển sang `sent` — admin có thể retry thủ công |

---

### 5.4 Error handling

- Wrap toàn bộ hook trong `try/catch`
- Nếu lỗi: `console.error('[notifySubscribers]', error)` — **không** throw (tránh block save operation của Payload)
- Campaign vẫn tồn tại ở `status: 'draft'` → admin có thể vào EmailCampaigns và click Send thủ công

---

## Acceptance criteria

- [ ] Publish Job mới → EmailCampaign `[Auto]` được tạo tự động trong admin
- [ ] Subscribers nhận được email về job mới trong vòng < 30 giây
- [ ] Publish Post mới → tương tự với template post
- [ ] Save lại bài đã published → **không** gửi email lần 2
- [ ] Unpublish → Publish lại → gửi email (behavior chấp nhận được)
- [ ] Lỗi SMTP/Resend → campaign vẫn ở `draft`, không crash Payload, admin có thể retry

## Dependencies

- **Phase 4** phải hoàn thành trước (`sendCampaign` utility và EmailCampaigns collection)
