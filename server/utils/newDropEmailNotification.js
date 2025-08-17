export const newShowNotificationTemplate = ({
  userName,
  posterUrl,
  movieTitle,
  year,
  genre,
  description,
  bookingUrl
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New Show Added: ${movieTitle}!</title>
  <style>
    /* Mobile tweaks */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .px-32 { padding-left: 16px !important; padding-right: 16px !important; }
      .py-32 { padding-top: 20px !important; padding-bottom: 20px !important; }
      .stack { display: block !important; width: 100% !important; }
      .text-center-sm { text-align: center !important; }
      .poster { width: 120px !important; height: auto !important; margin: 0 auto 16px !important; }
      .cta-button { padding: 12px 24px !important; font-size: 16px !important; }
    }
    body { margin:0; padding:0; background:#0d0d0d; font-family: Arial, Helvetica, sans-serif; }
  </style>
</head>
<body style="margin:0; padding:0; background:#0d0d0d; font-family: Arial, Helvetica, sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    A new movie just dropped at QuickShow! Don't miss out on ${movieTitle}.
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0d0d0d; margin:0; padding:20px 0;">
    <tr>
      <td align="center">
        <!-- Inner container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:600px; background:#1a1a1a; border-radius:12px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td class="px-32 py-32" style="padding:32px; border-bottom:1px solid #333333; text-align:center;">
              <img src="https://raw.githubusercontent.com/AbhisekDas01/Quick-Show-Movie-App/bd8d1013fb6b85d285d89e8b25b72079ec427a88/client/src/assets/logo.svg" alt="QuickShow Logo" width="150" style="display:block; margin:0 auto; border:0; outline:none; text-decoration:none; width:150px; height:auto;" />
              <h1 style="margin:16px 0 6px; color:#ffffff; font-size:24px; line-height:1.3; font-weight:700;">
                 Just Dropped: A New Movie!
              </h1>
              <p style="margin:0; color:#bbbbbb; font-size:14px; line-height:1.6;">Hey ${userName || 'movie lover'}, check out what's new at QuickShow.</p>
            </td>
          </tr>

          <!-- Movie section -->
          <tr>
            <td class="px-32 py-32" style="padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="stack" valign="top" style="width:140px;">
                    <img class="poster" src="${posterUrl}" alt="Movie Poster" width="120" style="display:block; border-radius:8px; width:120px; height:180px; object-fit:cover; border:0;" />
                  </td>
                  <td class="stack text-center-sm" valign="top" style="padding-left:20px;">
                    <h2 style="margin:0 0 6px; color:#ffffff; font-size:18px; line-height:1.4; font-weight:600;">${movieTitle}</h2>
                    <p style="margin:6px 0 0; color:#888888; font-size:14px; line-height:1.6;">${year} | ${genre}</p>
                    <p style="margin:12px 0 0; color:#bbbbbb; font-size:14px; line-height:1.6;">${description}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:0 32px 28px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 8px; background: #F84565;">
                    <a href="${bookingUrl}" target="_blank" class="cta-button" style="background: #F84565; border: 1px solid #F84565; font-family: Arial, sans-serif; font-size: 18px; line-height: 1.5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block; font-weight: bold;">
                      Book Tickets Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px-32 py-32" style="padding:28px 32px; border-top:1px solid #333333; text-align:center;">
              <p style="margin:0; color:#888888; font-size:13px; line-height:1.6;">Don't miss out on the next big hit!</p>
              <p style="margin:8px 0 0; color:#666666; font-size:12px; line-height:1.6;">You are receiving this email because you are a registered user of QuickShow.</p>
              <p style="margin:4px 0 0; color:#666666; font-size:12px; line-height:1.6;">QuickShow Theaters</p>
            </td>
          </tr>
        </table>
        <!-- /Inner container -->
      </td>
    </tr>
  </table>
</body>
</html>
`;
