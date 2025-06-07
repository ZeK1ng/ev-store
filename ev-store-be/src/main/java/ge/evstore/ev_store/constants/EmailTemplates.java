package ge.evstore.ev_store.constants;


public class EmailTemplates {
    private EmailTemplates() {
    }

    public static final String VERIFICATION_EMAIL_SUBJECT = "EV Store Verification Code";
    public static final String PASSWORD_RESET_EMAIL_SUBJECT = "EV Store Password reset Code";
    public static final String RESERVATION_EMAIL_SUBJECT = "Product Reservation";
    public static final String VERIFICATION_CODE_STR = "{{VERIFICATION_CODE}}";
    public static final String CODE_EXPIRATION_DURATION_STR = "{{CODE_EXPIRATION_DURATION}}";
    public static final String GRAND_TOTAL = "{{GRAND_TOTAL}}";
    public static final String ORDER_ID = "{{ORDER_ID}}";
    public static final String NAME = "{{NAME}}";
    public static final String PHONE = "{{PHONE}}";
    public static final String ADDRESS = "{{ADDRESS}}";
    public static final String CITY = "{{CITY}}";
    public static final String EMAIL = "{{EMAIL}}";
    public static final String NOTE = "{{NOTE}}";
    public static final String BASE_HTML_EMAIL_VERIFICATION_TEMPLATE = """
            <!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <title>Email Verification</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1" />
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #F7F7F7;
                                        margin: 0;
                                        padding: 0;
                                        color: #333;
                                    }
                                    .container {
                                        background-color: #FFFFFF;
                                        border-radius: 8px;
                                        max-width: 420px;
                                        margin-left: 40px;
                                        margin-right: auto;
                                        margin-top: 40px;
                                        margin-bottom: 0;
                                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                        overflow: hidden;
                                        padding: 32px 32px 28px 32px;
                                    }
                                    .header {
                                        background-color: #0052CC;
                                        color: #fff;
                                        padding: 18px 24px 12px 24px;
                                        border-top-left-radius: 8px;
                                        border-top-right-radius: 8px;
                                        font-size: 22px;
                                        font-weight: 600;
                                        margin-top: -32px;
                                        margin-left: -32px;
                                        margin-right: -32px;
                                        margin-bottom: 16px;
                                    }
                                    .message {
                                        font-size: 16px;
                                        margin-bottom: 18px;
                                    }
                                    .code-box {
                                        font-size: 26px;
                                        font-weight: bold;
                                        background-color: #E7F3FF;
                                        color: #0052CC;
                                        padding: 18px 0;
                                        text-align: center;
                                        border-radius: 7px;
                                        letter-spacing: 4px;
                                        margin-bottom: 18px;
                                        margin-top: 8px;
                                    }
                                    .expiration {
                                        font-size: 15px;
                                        color: #333;
                                        margin-bottom: 12px;
                                        text-align: center;
                                    }
                                    .footer {
                                        background-color: #F0F0F0;
                                        padding: 12px 18px;
                                        font-size: 12px;
                                        color: #777;
                                        text-align: center;
                                        border-radius: 0 0 8px 8px;
                                        margin-top: 20px;
                                        margin-left: -32px;
                                        margin-right: -32px;
                                        margin-bottom: -28px;
                                    }
                                    @media (max-width: 700px) {
                                        .container {
                                            max-width: 100%;
                                            margin: 24px auto 0 auto;
                                            padding: 18px 10px 12px 10px;
                                        }
                                        .header {
                                            font-size: 18px;
                                            padding: 14px 10px 10px 10px;
                                            margin-top: -18px;
                                            margin-left: -10px;
                                            margin-right: -10px;
                                            margin-bottom: 12px;
                                        }
                                        .footer {
                                            padding: 10px 10px;
                                            margin-top: 18px;
                                            margin-left: -10px;
                                            margin-right: -10px;
                                            margin-bottom: -12px;
                                            font-size: 11px;
                                        }
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="header">Email Verification</div>
                                    <div class="message">
                                        Hello,<br>
                                        To verify your email address, please use the code below:
                                    </div>
                                    <div class="code-box">{{VERIFICATION_CODE}}</div>
                                    <div class="expiration">
                                        This code will expire in {{CODE_EXPIRATION_DURATION}} minutes.<br>
                                        If you did not request this, please ignore this message.
                                    </div>
                                    <div class="footer">
                                        &copy; 2025 EV Store. All rights reserved.
                                    </div>
                                </div>
                            </body>
                            </html>
            """;
    public static final String BASE_HTML_PWD_RESET_TEMPLATE = """
            <!DOCTYPE html>
                          <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                              <title>Email Verification</title>
                              <meta name="viewport" content="width=device-width, initial-scale=1" />
                              <style>
                                  body {
                                      font-family: Arial, sans-serif;
                                      background-color: #F7F7F7;
                                      margin: 0;
                                      padding: 0;
                                      color: #333;
                                  }
                                  .container {
                                      background-color: #FFFFFF;
                                      border-radius: 8px;
                                      max-width: 420px;
                                      margin-left: 40px;
                                      margin-right: auto;
                                      margin-top: 40px;
                                      margin-bottom: 0;
                                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                      overflow: hidden;
                                      padding: 32px 32px 28px 32px;
                                  }
                                  .header {
                                      background-color: #0052CC;
                                      color: #fff;
                                      padding: 18px 24px 12px 24px;
                                      border-top-left-radius: 8px;
                                      border-top-right-radius: 8px;
                                      font-size: 22px;
                                      font-weight: 600;
                                      margin-top: -32px;
                                      margin-left: -32px;
                                      margin-right: -32px;
                                      margin-bottom: 16px;
                                  }
                                  .message {
                                      font-size: 16px;
                                      margin-bottom: 18px;
                                  }
                                  .code-box {
                                      font-size: 26px;
                                      font-weight: bold;
                                      background-color: #E7F3FF;
                                      color: #0052CC;
                                      padding: 18px 0;
                                      text-align: center;
                                      border-radius: 7px;
                                      letter-spacing: 4px;
                                      margin-bottom: 18px;
                                      margin-top: 8px;
                                  }
                                  .expiration {
                                      font-size: 15px;
                                      color: #333;
                                      margin-bottom: 12px;
                                      text-align: center;
                                  }
                                  .footer {
                                      background-color: #F0F0F0;
                                      padding: 12px 18px;
                                      font-size: 12px;
                                      color: #777;
                                      text-align: center;
                                      border-radius: 0 0 8px 8px;
                                      margin-top: 20px;
                                      margin-left: -32px;
                                      margin-right: -32px;
                                      margin-bottom: -28px;
                                  }
                                  @media (max-width: 700px) {
                                      .container {
                                          max-width: 100%;
                                          margin: 24px auto 0 auto;
                                          padding: 18px 10px 12px 10px;
                                      }
                                      .header {
                                          font-size: 18px;
                                          padding: 14px 10px 10px 10px;
                                          margin-top: -18px;
                                          margin-left: -10px;
                                          margin-right: -10px;
                                          margin-bottom: 12px;
                                      }
                                      .footer {
                                          padding: 10px 10px;
                                          margin-top: 18px;
                                          margin-left: -10px;
                                          margin-right: -10px;
                                          margin-bottom: -12px;
                                          font-size: 11px;
                                      }
                                  }
                              </style>
                          </head>
                          <body>
                              <div class="container">
                                  <div class="header">Password Reset</div>
                                  <div class="message">
                                      Hello,<br>
                                      To reset your password please use the code below:
                                  </div>
                                  <div class="code-box">{{VERIFICATION_CODE}}</div>
                                  <div class="expiration">
                                      This code will expire in {{CODE_EXPIRATION_DURATION}} minutes.<br>
                                      If you did not request this, please ignore this message.
                                  </div>
                                  <div class="footer">
                                      &copy; 2025 EV Store. All rights reserved.
                                  </div>
                              </div>
                          </body>
                          </html>
            """;

    public static final String BASE_HTML_RESERVATION_TEMPLATE_START = """
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8" />
              <title>New Order Received</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  background-color: #F7F7F7;
                  font-family: Arial, sans-serif;
                  color: #333;
                }
            
                .container {
                  max-width: 800px;
                  width: 100%;
                  background: #fff;
                  border-radius: 8px;
                  margin-left: 40px;
                  margin-right: auto;
                  margin-top: 20px;
                  margin-bottom: 0;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                }
            
                .section-title {
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 12px;
                  color: #222;
                }
            
                .instructions {
                  background-color: #FFF8E1;
                  border-left: 4px solid #FFD700;
                  padding: 12px;
                  border-radius: 4px;
                  margin-top: 8px;
                  font-size: 15px;
                  color: #333;
                }
            
                .footer {
                  background-color: #F0F0F0;
                  padding: 16px 24px;
                  font-size: 13px;
                  color: #777;
                  text-align: center;
                }
            
                @media only screen and (max-width: 700px) {
                  .container {
                    margin: 24px auto 0 auto !important;
                    max-width: 98% !important;
                  }
            
                  .footer {
                    padding: 12px 8px !important;
                    font-size: 12px !important;
                  }
                }
            
                @media only screen and (max-width: 500px) {
                  .container {
                    margin: 8px auto 0 auto !important;
                    max-width: 100% !important;
                    border-radius: 0 !important;
                  }
            
                  .footer {
                    padding: 10px 4px !important;
                    font-size: 11px !important;
                  }
                }
            
                @media only screen and (max-width: 700px) {
            
                  .order-table,
                  .order-table thead,
                  .order-table tbody,
                  .order-table tr,
                  .order-table th,
                  .order-table td {
                    display: block !important;
                    width: 100% !important;
                  }
            
                  .order-table thead {
                    display: none !important;
                  }
            
                  .order-table tr {
                    margin-bottom: 20px !important;
                    border: 1px solid #E0E0E0 !important;
                    border-radius: 6px !important;
                    background: #f9f9f9 !important;
                    padding: 10px 0 !important;
                  }
            
                  .order-table td {
                    border: none !important;
                    position: relative !important;
                    padding: 8px 12px 8px 110px !important;
                    min-height: 36px !important;
                    box-sizing: border-box !important;
                    font-size: 15px !important;
                    background: transparent !important;
                  }
            
                  .order-table td:before {
                    position: absolute !important;
                    left: 12px !important;
                    top: 8px !important;
                    width: 90px !important;
                    padding-right: 8px !important;
                    font-weight: bold !important;
                    color: #444 !important;
                    font-size: 13px !important;
                    white-space: nowrap !important;
                    content: attr(data-label) !important;
                  }
                }
              </style>
            </head>
            
            <body>
              <table width="100%" bgcolor="#F7F7F7" cellpadding="0" cellspacing="0" border="0"
                style="width:100%;background:#F7F7F7;">
                <tr>
                  <td>
                    <table class="container" width="800" cellpadding="0" cellspacing="0" border="0" align="left"
                      style="max-width:800px;width:100%;background:#fff;border-radius:8px;margin-left:40px;margin-top:20px;margin-bottom:0;box-shadow:0 2px 8px rgba(0,0,0,0.1);overflow:hidden;">
                      <tr>
                        <td colspan="2" style="padding:0;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0052CC"
                            style="background-color:#0052CC;">
                            <tr>
                              <td style="padding:20px 24px;">
                                <span style="font-size:24px;font-weight:600;line-height:28px;vertical-align:middle;color:#fff;">New
                                  Order Received</span>
                              </td>
                              <td align="right" style="padding:20px 24px;">
                                <span
                                  style="background:#fff;color:#0052CC;font-weight:bold;padding:6px 12px;border-radius:9999px;font-size:14px;">{{ORDER_ID}}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding:24px;">
                          <div class="section-title">Customer Information</div>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F5F7FF"
                            style="background-color:#F5F7FF;border-radius:6px;margin-bottom:24px;">
                            <tr>
                              <td width="50%" style="padding:20px 12px 20px 20px;vertical-align:top;">
                                <div style="font-weight:bold;font-size:14px;color:#444;margin-bottom:4px;">Customer Name</div>
                                <div style="font-size:16px;color:#111;margin-bottom:12px;">{{NAME}}</div>
                                <div style="font-weight:bold;font-size:14px;color:#444;margin-bottom:4px;">Delivery Address</div>
                                <div style="font-size:16px;color:#111;margin-bottom:4px;">{{ADDRESS}}</div>
                                <div style="font-size:14px;color:#666;">City: {{CITY}}</div>
                              </td>
                              <td width="50%" style="padding:20px 20px 20px 12px;vertical-align:top;">
                                <div style="font-weight:bold;font-size:14px;color:#444;margin-bottom:4px;">Phone</div>
                                <div style="font-size:16px;color:#111;margin-bottom:12px;">{{PHONE}}</div>
                                <div style="font-weight:bold;font-size:14px;color:#444;margin-bottom:4px;">Email</div>
                                <div style="font-size:16px;color:#111;">{{EMAIL}}</div>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding:12px 20px 12px 20px;">
                                <div style="font-weight:bold;font-size:14px;color:#444;margin-bottom:4px;">Special Instructions
                                </div>
                                <div class="instructions">
                                  {{NOTE}}
                                </div>
                              </td>
                            </tr>
                          </table>
            
                          <div class="section-title">Order Details</div>
                          <table class="order-table" width="100%" cellpadding="0" cellspacing="0" border="0"
                            style="border-collapse:collapse;margin-top:12px;">
                            <thead>
                              <tr>
                                <th align="left"
                                  style="border:1px solid #E0E0E0;padding:12px 8px 12px 12px;font-size:15px;background:#F0F0F0;color:#333;font-weight:500;">
                                  Product ID</th>
                                <th align="left"
                                  style="border:1px solid #E0E0E0;padding:12px 8px 12px 8px;font-size:15px;background:#F0F0F0;color:#333;font-weight:500;">
                                  Product Name</th>
                                <th align="left"
                                  style="border:1px solid #E0E0E0;padding:12px 8px 12px 8px;font-size:15px;background:#F0F0F0;color:#333;font-weight:500;">
                                  Quantity</th>
                                <th align="left"
                                  style="border:1px solid #E0E0E0;padding:12px 8px 12px 8px;font-size:15px;background:#F0F0F0;color:#333;font-weight:500;">
                                  Unit Price</th>
                                <th align="left"
                                  style="border:1px solid #E0E0E0;padding:12px 8px 12px 8px;font-size:15px;background:#F0F0F0;color:#333;font-weight:500;">
                                  Total</th>
                              </tr>
                            </thead>
                            <tbody>
            """;
    public static final String BASE_HTML_RESERVATION_TEMPLATE_END = """
             </tbody>
                          </table>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
                            <tr>
                              <td align="right">
                                <div
                                  style="display:inline-block;background-color:#E7F3FF;border:1px solid #A8D0FF;padding:12px 16px;border-radius:6px;font-size:16px;font-weight:bold;color:#0052CC;">
                                  Total Amount &nbsp;<span style="font-size:18px;color:#003F9D;">{{GRAND_TOTAL}}</span>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" class="footer"
                          style="background-color:#F0F0F0;padding:16px 24px;font-size:13px;color:#777;text-align:center;">
                          This order was placed on {{ORDER_DATE}}<br>
                          Please process this order and contact the customer if you have any questions.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            
            </html>
            """;
}
