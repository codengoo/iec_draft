'use client'

import React, { useState } from 'react'
import { toast, useDocumentInfo, useFormFields } from '@payloadcms/ui'

export const SendButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { id } = useDocumentInfo()
  const status = useFormFields(([fields]) => fields.status?.value as string | undefined)

  if (status !== 'draft') {
    return null
  }

  const handleSend = async () => {
    if (!id) {
      toast.error('Hãy lưu campaign trước khi gửi.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/email-campaigns/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ campaignId: String(id) }),
      })

      const data = (await res.json()) as { success?: boolean; recipientCount?: number; error?: string }

      if (res.ok && data.success) {
        toast.success(`Đã gửi thành công đến ${data.recipientCount ?? 0} subscribers.`)
        // Reload to reflect updated status fields
        window.location.reload()
      } else {
        toast.error(data.error ?? 'Gửi campaign thất bại.')
      }
    } catch {
      toast.error('Đã xảy ra lỗi khi gửi campaign.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <button
        type="button"
        disabled={loading}
        onClick={handleSend}
        style={{
          backgroundColor: loading ? '#9ca3af' : '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {loading ? 'Đang gửi...' : '📧 Gửi Campaign'}
      </button>
    </div>
  )
}
