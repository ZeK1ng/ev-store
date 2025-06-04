package ge.evstore.ev_store.constants;


public class EmailTemplates {
    private EmailTemplates() {
    }

    public static final String BASE_HTML_EMAIL_VERIFICATION_TEMPLATE = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Email Verification</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f7f9fb; padding: 20px; color: #333; }
                    .container { background-color: #ffffff; border-radius: 8px; max-width: 600px; margin: auto;
                                 padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    .code { font-size: 24px; font-weight: bold; background-color: #e7f3ff; padding: 12px 24px;
                            display: inline-block; border-radius: 6px; color: #0056b3; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Email Verification</h2>
                    <p>Hello,</p>
                    <p>To verify your email address, please use the code below:</p>
                    <div class="code">{{VERIFICATION_CODE}}</div>
                    <p>This code will expire in {{CODE_EXPIRATION_DURATION}} minutes. If you did not request this, please ignore this message.</p>
                    <div class="footer">&copy; 2025 EV Store. All rights reserved.</div>
                </div>
            </body>
            </html>
            """;
    public static final String BASE_HTML_PWD_RESET_TEMPLATE = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Password Reset Code</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f7f9fb; padding: 20px; color: #333; }
                    .container { background-color: #ffffff; border-radius: 8px; max-width: 600px; margin: auto;
                                 padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    .code { font-size: 24px; font-weight: bold; background-color: #e7f3ff; padding: 12px 24px;
                            display: inline-block; border-radius: 6px; color: #0056b3; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Password Reset</h2>
                    <p>Hello,</p>
                    <p>To reset your password, please use the code below:</p>
                    <div class="code">{{VERIFICATION_CODE}}</div>
                    <p>This code will expire in {{CODE_EXPIRATION_DURATION}} minutes. If you did not request this, please ignore this message.</p>
                    <div class="footer">&copy; 2025 EV Store. All rights reserved.</div>
                </div>
            </body>
            </html>
            """;
}
