export const bookingConfirmationTemplate = ({
    logoUrl,
    posterUrl,
    movieTitle,
    dateTimeText,
    theaterName,
    seatsText,
    totalText,
    userName 
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Your QuickShow Movie Ticket</title>
  <style>
    /* Mobile tweaks */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .px-32 { padding-left: 16px !important; padding-right: 16px !important; }
      .py-32 { padding-top: 20px !important; padding-bottom: 20px !important; }
      .stack { display: block !important; width: 100% !important; }
      .text-center-sm { text-align: center !important; }
      .mt-16-sm { margin-top: 16px !important; }
      .poster { width: 120px !important; height: auto !important; }
    }
    body { margin:0; padding:20px; background:#0d0d0d; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width:600px; margin:0 auto; background:#1a1a1a; border-radius:12px; overflow:hidden; }
    .header { padding:32px; text-align:center; border-bottom:1px solid #333; }
    .content { padding:32px; }
    .footer { padding:32px; text-align:center; font-size:12px; color:#888; border-top:1px solid #333; }
    h1,h2,h3 { color:#fff; margin:0 0 12px 0; }
    p,td { color:#bbb; margin:0; }
    .flex { display:flex; align-items:flex-start; gap:16px; }
    .card { background:#262626; border-radius:8px; padding:16px; }
    .divider { border:0; border-top:1px solid #333; margin:24px 0; }
    .right { text-align:right; }
  </style>
</head>
<body style="margin:0; padding:0; background:#0d0d0d; font-family: Arial, Helvetica, sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your QuickShow ticket is confirmed.
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
              <img src="${logoUrl}" alt="QuickShow Logo" width="150" style="display:block; margin:0 auto; border:0; outline:none; text-decoration:none; width:150px; height:auto;" />
              <h1 style="margin:16px 0 6px; color:#ffffff; font-size:24px; line-height:1.3; font-weight:700;">
                ${userName ? `Hey <span style="color:#F84565; font-weight:700">${userName}</span>, your ticket is confirmed!` : 'Your Ticket Is Confirmed!'}
              </h1>
              <p style="margin:0; color:#bbbbbb; font-size:14px; line-height:1.6;">We’ll see you at the movies.</p>
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
                    <p style="margin:6px 0 0; color:#888888; font-size:14px; line-height:1.6;"></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:0; border-top:1px solid #333333; margin:0;" />
            </td>
          </tr>

          <!-- Booking details -->
          <tr>
            <td class="px-32 py-32" style="padding:24px 32px;">
              <h3 style="margin:0 0 12px; color:#ffffff; font-size:16px; line-height:1.4; font-weight:600;">Booking Details</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#262626; border-radius:8px;">
                <tr>
                  <td style="padding:14px 16px; color:#bbbbbb; font-weight:600; font-size:14px;">Date & Time:</td>
                  <td align="right" style="padding:14px 16px; color:#ffffff; font-weight:700; font-size:14px;">${dateTimeText}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px; border-top:1px solid #333333; color:#bbbbbb; font-weight:600; font-size:14px;">Theater:</td>
                  <td align="right" style="padding:14px 16px; border-top:1px solid #333333; color:#ffffff; font-weight:700; font-size:14px;">${theaterName || 'QuickShow'}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px; border-top:1px solid #333333; color:#bbbbbb; font-weight:600; font-size:14px;">Seats:</td>
                  <td align="right" style="padding:14px 16px; border-top:1px solid #333333; color:#ffffff; font-weight:700; font-size:14px;">${seatsText}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:0; border-top:1px solid #333333; margin:0;" />
            </td>
          </tr>

          <!-- Order summary -->
          <tr>
            <td class="px-32 py-32" style="padding:24px 32px;">
              <h3 style="margin:0 0 12px; color:#ffffff; font-size:16px; line-height:1.4; font-weight:600;">Order Summary</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:14px 0; color:#ffffff; font-weight:700; border-top:1px solid #333333;">Total</td>
                  <td align="right" style="padding:14px 0; color:#ffffff; font-weight:700; font-size:18px; border-top:1px solid #333333;">₹${totalText}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px-32 py-32" style="padding:28px 32px; border-top:1px solid #333333; text-align:center;">
              <p style="margin:0; color:#888888; font-size:13px; line-height:1.6;">Enjoy the show! 🎥🍿</p>
              <p style="margin:8px 0 0; color:#666666; font-size:12px; line-height:1.6;">This is an automated message. Please do not reply.</p>
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