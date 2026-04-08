import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)

# Configure these in your .env
SMTP_HOST     = "smtp.gmail.com"
SMTP_PORT     = 587
SMTP_USER     = "deenuchoudhary47@gmail.com"  # your gmail
SMTP_PASSWORD = "xnjf uhbk Irfc loqq"  # your gmail app password

def send_email(to_email: str, subject: str, body: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.info(f"[EMAIL MOCK] To: {to_email} | Subject: {subject}")
        logger.info(f"[EMAIL BODY] {body}")
        return
    try:
        msg = MIMEMultipart()
        msg['From']    = SMTP_USER
        msg['To']      = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info(f"Email sent to {to_email}")
    except Exception as e:
        logger.error(f"Email failed: {e}")

def notify_claim_submitted(item_title: str, reporter_email: str, reporter_name: str, reporter_phone: str):
    subject = f"Someone submitted a claim for your report: {item_title}"
    body = f"""
    <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;background:#f8fafc;border-radius:12px">
      <h2 style="color:#4f46e5">Lost & Found — New Claim Received</h2>
      <p>Hi <b>{reporter_name}</b>,</p>
      <p>Someone has submitted a <b>claim or found submission</b> for your reported item:</p>
      <div style="background:#fff;border-radius:8px;padding:16px;margin:16px 0;border-left:4px solid #4f46e5">
        <b style="font-size:18px">{item_title}</b>
      </div>
      <p>Our admin team will review the submission and verify the details. You will be contacted at <b>{reporter_phone}</b> or via this email once a decision is made.</p>
      <p style="color:#64748b;font-size:13px;margin-top:24px">— Lost & Found Portal</p>
    </div>
    """
    send_email(reporter_email, subject, body)

def notify_claim_approved(item_title: str, reporter_email: str, reporter_name: str, reporter_phone: str):
    subject = f"✅ Claim Approved — {item_title}"
    body = f"""
    <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;background:#f0fdf4;border-radius:12px">
      <h2 style="color:#16a34a">Lost & Found — Claim Approved!</h2>
      <p>Hi <b>{reporter_name}</b>,</p>
      <p>Great news! The claim for your item <b>"{item_title}"</b> has been <b style="color:#16a34a">approved</b>.</p>
      <p>The admin will facilitate the handover. You may be contacted at <b>{reporter_phone}</b> to coordinate.</p>
      <p style="color:#64748b;font-size:13px;margin-top:24px">— Lost & Found Portal</p>
    </div>
    """
    send_email(reporter_email, subject, body)