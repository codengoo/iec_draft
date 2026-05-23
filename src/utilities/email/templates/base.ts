type BaseTemplateArgs = {
  previewText?: string
  bodyHtml: string
  unsubscribeUrl: string
  siteUrl: string
  logoUrl?: string
}

export function baseTemplate({
  previewText,
  bodyHtml,
  unsubscribeUrl,
  siteUrl,
  logoUrl,
}: BaseTemplateArgs): string {
  const preview = previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : ''

  const logo = logoUrl
    ? `<img src="${logoUrl}" alt="IEC" style="height:40px;display:block;" />`
    : `<span style="font-size:22px;font-weight:bold;color:#1a1a1a;">IEC</span>`

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>IEC Newsletter</title>
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  ${preview}
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f5;">
    <tr>
      <td style="padding:32px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;background-color:#ffffff;border-bottom:1px solid #e5e7eb;">
              <a href="${siteUrl}" style="text-decoration:none;">
                ${logo}
              </a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#374151;font-size:15px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">
                Bạn nhận được email này vì đã đăng ký nhận thông tin từ IEC.
              </p>
              <p style="margin:0;font-size:13px;color:#6b7280;">
                <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Hủy đăng ký</a>
                &nbsp;|&nbsp;
                <a href="${siteUrl}" style="color:#6b7280;text-decoration:underline;">Truy cập website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
