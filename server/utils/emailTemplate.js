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
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Your QuickShow Movie Ticket</title>
  <style>
    body { margin:0; padding:20px; background:#0d0d0d; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width:600px; margin:0 auto; background:#1a1a1a; border-radius:12px; overflow:hidden; }
    .header { padding:32px; text-align:center; border-bottom:1px solid #333; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .content { padding:32px; }
    .footer { padding:32px; text-align:center; font-size:12px; color:#888; border-top:1px solid #333; }
    h1,h2,h3 { color:#fff; margin:0 0 12px 0; }
    p,td { color:#bbb; margin:0; }
    .flex { display:flex; align-items:flex-start; gap:16px; }
    .card { background:#262626; border-radius:8px; padding:24px; } /* increased padding */
    .divider { border:0; border-top:1px solid #333; margin:24px 0; }
    .right { text-align:right; }
  </style>
</head>
<body>
  <div class="container">
    <header class="header" style="padding: 32px; text-align: center; border-bottom: 1px solid #333; display: flex; flex-direction: column; align-items: center; gap: 12px;">
      <img src="${logoUrl}" alt="QuickShow Logo" style="width:150px;height:auto;display:block;margin:0 auto;" />
      <h1>${userName ? `Hey <span style="color:#F84565; font-weight:700">${userName}</span>, your ticket is confirmed!` : 'Your Ticket Is Confirmed!'}</h1>
      <p>We'll see you at the movies.</p>
    </header>

    <main class="content" style="padding: 32px;">
      <div class="flex" style="display:flex; align-items:flex-start; gap:16px;">
        <img src="${posterUrl}" alt="Movie Poster" style="border-radius:8px;width:120px;height:180px;object-fit:cover;" />
        <div>
          <h2>${movieTitle}</h2>
          <!-- Add more metadata if you have it -->
        </div>
      </div>

      <hr class="divider" style="border:0;border-top:1px solid #333;margin:24px 0;" />

      <h3>Booking Details</h3>
      <div class="card" style="background:#262626; border-radius:8px; padding:24px;"> <!-- increased padding -->
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0;font-weight:600;">Date & Time:</td>
            <td class="right" style="padding:12px 0;font-weight:700;color:#fff; text-align:right;">${dateTimeText}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-top:1px solid #333;font-weight:600;">Theater:</td>
            <td class="right" style="padding:12px 0;border-top:1px solid #333;font-weight:700;color:#fff; text-align:right;">${theaterName || "QuickShow"}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-top:1px solid #333;font-weight:600;">Seats:</td>
            <td class="right" style="padding:12px 0;border-top:1px solid #333;font-weight:700;color:#fff; text-align:right;">${seatsText}</td>
          </tr>
        </table>
      </div>

      <hr class="divider" style="border:0;border-top:1px solid #333;margin:24px 0;" />

      <h3>Order Summary</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="font-weight:700;color:#fff;border-top:1px solid #333;">
          <td style="padding:16px 0;">Total</td>
          <td class="right" style="padding:16px 0;font-size:20px; text-align:right;">${totalText}</td>
        </tr>
      </table>
    </main>

    <footer class="footer" style="padding:32px; text-align:center; font-size:12px; color:#888; border-top:1px solid #333;">
      <p>Enjoy the show! 🎥🍿</p>
      <p style="margin-top:8px;">This is an automated message. Please do not reply.</p>
      <p style="margin-top:4px;">QuickShow Theaters</p>
    </footer>
  </div>
</body>
</html>
`;