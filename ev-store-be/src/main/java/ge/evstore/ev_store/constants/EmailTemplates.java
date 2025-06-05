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

    public static final String BASE_HTML_RESERVATION_TEMPLATE_START= """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>New Order Received</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #F7F7F7;
                  margin: 0;
                  padding: 0;
                  color: #333;
                }
                a {
                  color: inherit;
                  text-decoration: none;
                }
            
                .container {
                  max-width: 800px;
                  margin: 20px auto;
                  background-color: #FFFFFF;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  overflow: hidden;
                }
            
                .header {
                  background-color: #0052CC;
                  color: #FFFFFF;
                  padding: 20px 24px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 24px;
                  font-weight: 600;
                }
                .order-id {
                  background-color: #FFFFFF;
                  color: #0052CC;
                  font-weight: bold;
                  padding: 6px 12px;
                  border-radius: 9999px;
                  font-size: 14px;
                }
            
                .section-title {
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 12px;
                  display: flex;
                  align-items: center;
                  color: #222;
                }
            
                .content {
                  padding: 24px;
                }
            
                .customer-info {
                  background-color: #F5F7FF;
                  border-radius: 6px;
                  padding: 20px;
                  margin-bottom: 24px;
                }
                .info-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 16px;
                }
                .info-left,
                .info-right {
                  flex: 1;
                }
                .info-left p,
                .info-right p {
                  margin: 4px 0;
                  line-height: 1.5;
                }
                .info-left .label,
                .info-right .label {
                  font-weight: bold;
                  font-size: 14px;
                  margin-bottom: 4px;
                  display: flex;
                  align-items: center;
                  color: #444;
                }
            
                .info-left .value,
                .info-right .value {
                  font-size: 16px;
                  color: #111;
                }
            
                .city {
                  font-size: 14px;
                  color: #666;
                  margin-top: 2px;
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
            
                .order-details {
                  margin-bottom: 32px;
                }
                .order-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 12px;
                }
                .order-table th,
                .order-table td {
                  border: 1px solid #E0E0E0;
                  padding: 12px;
                  text-align: left;
                  font-size: 15px;
                }
                .order-table th {
                  background-color: #F0F0F0;
                  color: #333;
                  font-weight: 500;
                }
                .order-table td .badge {
                  display: inline-block;
                  background-color: #F3F4F6;
                  color: #555;
                  padding: 2px 8px;
                  border-radius: 4px;
                  font-size: 13px;
                  font-weight: 500;
                }
            
                /* Total Amount */
                .total-container {
                  display: flex;
                  justify-content: flex-end;
                  margin-top: 16px;
                }
                .total-box {
                  background-color: #E7F3FF;
                  border: 1px solid #A8D0FF;
                  padding: 12px 16px;
                  border-radius: 6px;
                  font-size: 16px;
                  font-weight: bold;
                  color: #0052CC;
                  display: flex;
                  align-items: center;
                }
            
            
                .footer {
                  background-color: #F0F0F0;
                  padding: 16px 24px;
                  font-size: 13px;
                  color: #777;
                  text-align: center;
                }
            
                @media (max-width: 600px) {
                  .info-row {
                    flex-direction: column;
                  }
                  .info-left,
                  .info-right {
                    width: 100%;
                  }
                  .order-table th,
                  .order-table td {
                    font-size: 14px;
                    padding: 8px;
                  }
                  .section-title {
                    font-size: 16px;
                  }
                  .total-box {
                    font-size: 15px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Order Received</h1>
                  <div class="order-id">{{OrderId}}</div>
                </div>
            
                <div class="content">
                  <div class="section-title">
                    Customer Information
                  </div>
                  <div class="customer-info">
                    <div class="info-row">
                      <div class="info-left">
                        <p class="label">
                          Customer Name
                        </p>
                        <p class="value">{{NAME}}</p>
            
                        <p class="label" style="margin-top:12px;">
                          Delivery Address
                        </p>
                        <p class="value">{{ADDRESS}}</p>
                        <p class="city">City: {{CITY}}</p>
                      </div>
                      <div class="info-right">
                        <p class="label">
                          Phone
                        </p>
                        <p class="value">{{PHONE}}</p>
            
                        <p class="label" style="margin-top:12px;">
                          Email
                        </p>
                        <p class="value">{{EMAIL}}</p>
                      </div>
                    </div>
            
                    <p class="label" style="margin-bottom:4px;">
                      Special Instructions
                    </p>
                    <div class="instructions">
                      {{NOTE}}
                    </div>
                  </div>
            
                  <!-- Order Details Section -->
                  <div class="section-title">
                    Order Details
                  </div>
                  <table class="order-table">
                    <thead>
                      <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
            """;
    public static final String BASE_HTML_RESERVATION_TEMPLATE_END = """
              </tbody>
                  </table>
            
                  <div class="total-container">
                    <div class="total-box">
                      Total Amount &nbsp;<span style="font-size:18px; color:#003F9D;">{{GRAND_TOTAL}}</span>
                    </div>
                  </div>
                </div>
            
                <div class="footer">
                  This order was placed on {{OrderDate}}<br>
                  Please process this order and contact the customer if you have any questions.
                </div>
              </div>
            </body>
            </html>
            """;
}
