---
layout: default
title: Email Notification Setup
---

# Email Notification Setup Guide

This guide covers setting up transactional email notifications for the Potluck platform using SendGrid or AWS SES.

## Email Types

Potluck sends the following transactional emails:

| Email Type | Trigger | Recipient |
|------------|---------|-----------|
| Booking Request | New booking created | Chef |
| Booking Confirmed | Chef confirms booking | Diner |
| Booking Cancelled | Booking cancelled | Chef & Diner |
| Payment Receipt | Payment successful | Diner |
| Reminder | 24h before dining | Diner & Chef |
| Review Request | After dining experience | Diner |
| Welcome Email | New account created | User |

---

## Option A: SendGrid Setup

### Step 1: Create SendGrid Account

1. Go to [sendgrid.com](https://sendgrid.com)
2. Click **"Start for Free"**
3. Complete registration
4. Verify your email

### Step 2: Verify Sender Identity

1. Go to **Settings** → **Sender Authentication**
2. Choose **Domain Authentication** (recommended) or **Single Sender Verification**

#### Domain Authentication:
1. Click **"Authenticate Your Domain"**
2. Select your DNS host
3. Add the provided DNS records to your domain
4. Click **"Verify"**

#### Single Sender (for testing):
1. Click **"Verify a Single Sender"**
2. Enter sender details (name, email)
3. Click verification link in email

### Step 3: Create API Key

1. Go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name: `potluck-api`
4. Permissions: **Restricted Access**
   - Mail Send: Full Access
5. Click **"Create & View"**
6. Copy the API key (shown only once!)

### Step 4: Configure Environment

```env
# apps/api/.env

EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=noreply@potluck.sg
EMAIL_FROM_NAME=Potluck
```

### Step 5: Install SendGrid SDK

```bash
cd apps/api
pnpm add @sendgrid/mail
```

### Step 6: Create Email Service

Create `apps/api/src/services/email.ts`:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  const msg = {
    to: options.to,
    from: {
      email: process.env.EMAIL_FROM_ADDRESS!,
      name: process.env.EMAIL_FROM_NAME!,
    },
    subject: options.subject,
    text: options.text || options.subject,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to:', options.to);
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}
```

---

## Option B: AWS SES Setup

### Step 1: Set Up AWS Account

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Create an account or sign in
3. Go to AWS SES console

### Step 2: Verify Domain

1. In SES console, go to **Verified identities**
2. Click **"Create identity"**
3. Select **Domain**
4. Enter your domain: `potluck.sg`
5. Enable DKIM signing
6. Add the provided DNS records
7. Wait for verification (can take up to 72 hours)

### Step 3: Request Production Access

By default, SES is in sandbox mode. To send to any email:

1. Go to **Account dashboard**
2. Click **"Request production access"**
3. Fill in:
   - Mail type: Transactional
   - Website URL: https://potluck.sg
   - Use case description: Booking confirmations, reminders, receipts
4. Submit and wait for approval (24-48 hours)

### Step 4: Create IAM User

1. Go to IAM console
2. Create new user: `potluck-ses`
3. Attach policy: `AmazonSESFullAccess`
4. Create access keys
5. Save Access Key ID and Secret Access Key

### Step 5: Configure Environment

```env
# apps/api/.env

EMAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxx...
AWS_REGION=ap-southeast-1
EMAIL_FROM_ADDRESS=noreply@potluck.sg
EMAIL_FROM_NAME=Potluck
```

### Step 6: Install AWS SDK

```bash
cd apps/api
pnpm add @aws-sdk/client-ses
```

### Step 7: Create Email Service

Create `apps/api/src/services/email.ts`:

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  const command = new SendEmailCommand({
    Source: process.env.EMAIL_FROM_ADDRESS,
    Destination: {
      ToAddresses: [options.to],
    },
    Message: {
      Subject: {
        Data: options.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: options.html,
          Charset: 'UTF-8',
        },
        Text: {
          Data: options.text || options.subject,
          Charset: 'UTF-8',
        },
      },
    },
  });

  try {
    await sesClient.send(command);
    console.log('Email sent to:', options.to);
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}
```

---

## Email Templates

### Create Template Service

Create `apps/api/src/services/emailTemplates.ts`:

```typescript
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { color: #F97316; font-size: 28px; font-weight: bold; }
    .content { background: #fff; padding: 30px; border-radius: 8px; }
    .button { display: inline-block; background: #F97316; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Potluck</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; 2025 Potluck. All rights reserved.</p>
      <p>71 Robinson Road, Singapore 068895</p>
    </div>
  </div>
</body>
</html>
`;

export const templates = {
  bookingRequest: (data: { chefName: string; dinerName: string; date: string; time: string; guests: number; menuName: string }) => ({
    subject: 'New Booking Request - Potluck',
    html: baseTemplate(`
      <h2>New Booking Request!</h2>
      <p>Hi ${data.chefName},</p>
      <p>You have a new booking request from <strong>${data.dinerName}</strong>.</p>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Menu:</strong> ${data.menuName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Guests:</strong> ${data.guests}</p>
      </div>
      <p><a href="https://potluck.sg/chef/bookings" class="button">View Booking</a></p>
      <p>Please confirm or decline within 24 hours.</p>
    `),
  }),

  bookingConfirmed: (data: { dinerName: string; chefName: string; date: string; time: string; address: string; menuName: string }) => ({
    subject: 'Booking Confirmed! - Potluck',
    html: baseTemplate(`
      <h2>Your Booking is Confirmed!</h2>
      <p>Hi ${data.dinerName},</p>
      <p>Great news! <strong>${data.chefName}</strong> has confirmed your booking.</p>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Menu:</strong> ${data.menuName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Location:</strong> ${data.address}</p>
      </div>
      <p><a href="https://potluck.sg/bookings" class="button">View Booking Details</a></p>
      <p>We hope you have a wonderful dining experience!</p>
    `),
  }),

  paymentReceipt: (data: { dinerName: string; amount: number; menuName: string; chefName: string; date: string }) => ({
    subject: 'Payment Receipt - Potluck',
    html: baseTemplate(`
      <h2>Payment Receipt</h2>
      <p>Hi ${data.dinerName},</p>
      <p>Thank you for your payment. Here's your receipt:</p>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Menu:</strong> ${data.menuName}</p>
        <p><strong>Chef:</strong> ${data.chefName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
        <p style="font-size: 18px;"><strong>Total Paid: $${data.amount.toFixed(2)} SGD</strong></p>
      </div>
      <p>A copy of this receipt has been saved to your account.</p>
    `),
  }),

  reminder: (data: { name: string; chefName: string; date: string; time: string; address: string }) => ({
    subject: 'Reminder: Dining Experience Tomorrow - Potluck',
    html: baseTemplate(`
      <h2>Reminder: Your Dining Experience is Tomorrow!</h2>
      <p>Hi ${data.name},</p>
      <p>Just a friendly reminder about your upcoming dining experience.</p>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Chef:</strong> ${data.chefName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Location:</strong> ${data.address}</p>
      </div>
      <p>Please arrive on time and let us know if you have any last-minute changes.</p>
    `),
  }),

  welcome: (data: { name: string }) => ({
    subject: 'Welcome to Potluck!',
    html: baseTemplate(`
      <h2>Welcome to Potluck, ${data.name}!</h2>
      <p>We're excited to have you join our community of food lovers!</p>
      <p>With Potluck, you can:</p>
      <ul>
        <li>Discover talented home chefs in Singapore</li>
        <li>Book unique dining experiences</li>
        <li>Enjoy authentic home-cooked meals</li>
      </ul>
      <p><a href="https://potluck.sg/explore" class="button">Start Exploring</a></p>
      <p>Happy dining!</p>
    `),
  }),
};
```

---

## Using Email Templates

### Send Booking Confirmation

```typescript
import { sendEmail } from '../services/email';
import { templates } from '../services/emailTemplates';

async function sendBookingConfirmation(booking: Booking) {
  const template = templates.bookingConfirmed({
    dinerName: booking.diner.name,
    chefName: booking.chef.name,
    date: formatDate(booking.date),
    time: booking.time,
    address: booking.chef.address,
    menuName: booking.menu.name,
  });

  await sendEmail({
    to: booking.diner.email,
    subject: template.subject,
    html: template.html,
  });
}
```

---

## Email Queue (Recommended)

For production, use a job queue to handle emails asynchronously:

### Install BullMQ

```bash
pnpm add bullmq
```

### Create Email Queue

```typescript
import { Queue, Worker } from 'bullmq';
import { sendEmail } from '../services/email';

const emailQueue = new Queue('emails', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

// Add email to queue
export async function queueEmail(options: EmailOptions) {
  await emailQueue.add('send-email', options);
}

// Process emails
const worker = new Worker('emails', async (job) => {
  await sendEmail(job.data);
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

worker.on('completed', (job) => {
  console.log('Email sent:', job.id);
});

worker.on('failed', (job, err) => {
  console.error('Email failed:', job?.id, err);
});
```

---

## Testing Emails

### Local Development

1. Use [Mailtrap](https://mailtrap.io) or [Mailhog](https://github.com/mailhog/MailHog)
2. Configure SMTP credentials in .env

### Mailtrap Setup

```env
# For testing with Mailtrap
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
```

---

## Monitoring

### SendGrid
- Dashboard shows delivery stats
- Set up email activity notifications
- Monitor bounce and spam rates

### AWS SES
- CloudWatch metrics
- Set up SNS notifications for bounces/complaints
- Monitor sending quotas

---

## Best Practices

1. **Always include unsubscribe link** (for marketing emails)
2. **Use double opt-in** for newsletters
3. **Handle bounces and complaints** promptly
4. **Keep templates mobile-friendly**
5. **Test emails across clients** (Gmail, Outlook, Apple Mail)
6. **Monitor delivery rates** and adjust as needed

---

## Useful Links

- [SendGrid Documentation](https://docs.sendgrid.com)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses)
- [Email Testing with Mailtrap](https://mailtrap.io)

---

[← Back to Documentation](index)
