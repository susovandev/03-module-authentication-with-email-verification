export const resetPasswordMailTemplate = (name: string, resetLink: string): string => `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Reset Your Password</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 10px;
              padding: 30px;
              text-align: center;
              margin: 5px auto;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            "
          >
            <tr>
              <td align="center">
                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                    color: #333333;
                  "
                >
                  Reset Your Password 🔐
                </h1>

                <p
                  style="
                    font-size: 16px;
                    margin: 15px 0;
                    color: #555555;
                  "
                >
                  Hello <b>${name}</b> 👋,<br />
                  We received a request to reset your password.<br />
                  Click the button below to set a new password:
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding: 20px 0;">

                <a
                  href="${resetLink}"
                  style="
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    background: #1976d2;
                    padding: 14px 28px;
                    border-radius: 6px;
                    text-decoration: none;
                    display: inline-block;
                  "
                >
                  Reset Password
                </a>

              </td>
            </tr>

            <tr>
              <td>
                <p
                  style="
                    font-size: 15px;
                    color: #333333;
                    margin-top: 20px;
                  "
                >
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>

                <p
                  style="
                    font-size: 14px;
                    word-wrap: break-word;
                    color: #1976d2;
                  "
                >
                  ${resetLink}
                </p>

                <p
                  style="
                    font-size: 15px;
                    color: #333333;
                    margin-top: 20px;
                  "
                >
                  This link will expire in <strong>3 minutes</strong> for security reasons.<br />
                  If you did NOT request a password reset, please ignore this email.
                </p>

                <p style="font-size: 15px; margin-top: 25px; color: #555555;">
                  Regards,<br />
                  <strong>Auth Service</strong>
                </p>

                <hr style="margin: 30px 0; opacity: 0.2;" />

                <p
                  style="
                    font-size: 12px;
                    text-align: center;
                    color: #999999;
                  "
                >
                  © 2025 Auth Service. All rights reserved.<br />
                  This is an automated email. Please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
