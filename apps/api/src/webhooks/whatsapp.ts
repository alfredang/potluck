import type { FastifyPluginAsync } from 'fastify';
import https from 'https';

// WhatsApp Cloud API Configuration
const WHATSAPP_VERIFY_TOKEN = 'potluck_whatsapp_verify_2026';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

// Telegram notification config (forward messages to PotLuck group)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5089150604';

interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; caption?: string };
  audio?: { id: string };
  video?: { id: string };
  document?: { id: string; filename?: string };
  contacts?: Array<{ name: { formatted_name: string } }>;
  location?: { latitude: number; longitude: number };
}

interface WhatsAppWebhookBody {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: WhatsAppMessage[];
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export const whatsappWebhookRoutes: FastifyPluginAsync = async (fastify) => {
  // Webhook verification (GET) - Meta sends this to verify the endpoint
  fastify.get('/whatsapp', async (request, reply) => {
    const query = request.query as Record<string, string>;
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      fastify.log.info('WhatsApp webhook verified successfully');
      return reply.status(200).send(challenge);
    }

    fastify.log.warn('WhatsApp webhook verification failed');
    return reply.status(403).send('Forbidden');
  });

  // Webhook handler (POST) - receives incoming messages
  fastify.post('/whatsapp', async (request, reply) => {
    const body = request.body as WhatsAppWebhookBody;

    if (body.object !== 'whatsapp_business_account') {
      return reply.status(404).send('Not Found');
    }

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        // Handle incoming messages
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            const contact = value.contacts?.[0];
            const senderName = contact?.profile?.name || 'Unknown';
            const senderPhone = message.from;

            fastify.log.info(`WhatsApp message from ${senderName} (${senderPhone}): ${message.type}`);

            // Forward to Telegram group
            await forwardToTelegram(senderName, senderPhone, message);

            // Auto-reply for common queries
            await handleAutoReply(senderPhone, message);
          }
        }

        // Handle message status updates
        if (value.statuses) {
          for (const status of value.statuses) {
            fastify.log.info(`WhatsApp status: ${status.status} for ${status.recipient_id}`);
          }
        }
      }
    }

    // Always respond with 200 quickly (Meta requires this)
    return reply.status(200).send('OK');
  });
};

// Forward incoming WhatsApp message to Telegram PotLuck group
async function forwardToTelegram(senderName: string, senderPhone: string, message: WhatsAppMessage): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  let text = '';

  switch (message.type) {
    case 'text':
      text = `📱 *WhatsApp Message*\n\n👤 *From:* ${senderName} (+${senderPhone})\n💬 ${message.text?.body || '(empty)'}`;
      break;
    case 'image':
      text = `📱 *WhatsApp Message*\n\n👤 *From:* ${senderName} (+${senderPhone})\n🖼️ Image received${message.image?.caption ? ': ' + message.image.caption : ''}`;
      break;
    case 'audio':
      text = `📱 *WhatsApp Message*\n\n👤 *From:* ${senderName} (+${senderPhone})\n🎵 Audio message received`;
      break;
    case 'video':
      text = `📱 *WhatsApp Message*\n\n👤 *From:* ${senderName} (+${senderPhone})\n🎬 Video received`;
      break;
    case 'document':
      text = `📱 *WhatsApp Message*\n\n👤 *From:* ${senderName} (+${senderPhone})\n📄 Document: ${message.document?.filename || 'unnamed'}`;
      break;
    case 'location':
      text = `📱 *WhatsApp Message*\n\n👤 *From:* ${senderName} (+${senderPhone})\n📍 Location: ${message.location?.latitude}, ${message.location?.longitude}`;
      break;
    default:
      text = `📱 *WhatsApp Message*\n\n👤 *From:* ${senderName} (+${senderPhone})\n📎 ${message.type} message received`;
  }

  const postData = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: 'Markdown',
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, () => resolve());

    req.on('error', () => resolve());
    req.write(postData);
    req.end();
  });
}

// Auto-reply to common messages
async function handleAutoReply(senderPhone: string, message: WhatsAppMessage): Promise<void> {
  if (message.type !== 'text' || !message.text?.body) return;

  const text = message.text.body.toLowerCase().trim();
  let replyText = '';

  // Greeting
  if (['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'].some(g => text.startsWith(g))) {
    replyText = `Hello! 👋 Welcome to PotLuck — Singapore's home dining marketplace!\n\nHow can we help you?\n\n1️⃣ Browse home chefs\n2️⃣ How it works\n3️⃣ Become a home chef\n4️⃣ Contact support\n\nVisit us at: https://potluckhub.io`;
  }
  // Menu/Food
  else if (text.includes('menu') || text.includes('food') || text.includes('chef')) {
    replyText = `🍽️ Explore our amazing home chefs and their menus at:\nhttps://potluckhub.io/explore\n\nYou can browse by cuisine type and find chefs near you!`;
  }
  // Pricing
  else if (text.includes('price') || text.includes('cost') || text.includes('how much')) {
    replyText = `💰 PotLuck is free for customers! You only pay for the meals you order.\n\nFor home chefs, we offer:\n• Basic: $10/mo\n• Pro: $20/mo\n• Unlimited: $50/mo\n\nLearn more: https://potluckhub.io/pricing`;
  }
  // Sign up
  else if (text.includes('sign up') || text.includes('register') || text.includes('join')) {
    replyText = `✨ Great to have you interested!\n\nSign up here: https://potluckhub.io/register\n\nWant to become a home chef? Visit: https://potluckhub.io/become-chef`;
  }
  // Help
  else if (text.includes('help') || text.includes('support') || text.includes('problem') || text.includes('issue')) {
    replyText = `🤝 We're here to help!\n\nYou can:\n📧 Email: hello@potluckhub.io\n💬 Chat here on WhatsApp\n🌐 Visit: https://potluckhub.io/help\n\nOur team will get back to you shortly!`;
  }

  if (replyText) {
    await sendWhatsAppMessage(senderPhone, replyText);
  }
}

// Send a WhatsApp message
async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) return;

  const postData = JSON.stringify({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text },
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'graph.facebook.com',
      path: `/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }, () => resolve());

    req.on('error', () => resolve());
    req.write(postData);
    req.end();
  });
}

// Manual reply endpoint - for sending replies from Telegram
// Usage: POST /webhooks/whatsapp/reply { "to": "6590480277", "message": "Hello!" }
fastify.post('/whatsapp/reply', async (request: any, reply: any) => {
  const body = request.body as { to: string; message: string };
  
  if (!body.to || !body.message) {
    return reply.status(400).send({ error: 'Missing to or message' });
  }

  // Format phone number
  let phone = body.to.replace(/\D/g, '');
  if (!phone.startsWith('65')) {
    phone = '65' + phone;
  }

  fastify.log.info(`Sending manual WhatsApp reply to +${phone}`);
  
  await sendWhatsAppMessage(phone, body.message);
  
  return reply.status(200).send({ success: true, to: phone });
});
