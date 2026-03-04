import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { hitpayService } from '../services/hitpay';

interface CreateSubscriptionBody {
  planId: string;
  customerEmail: string;
  customerName: string;
}

interface GetSubscriptionQuery {
  subscriptionId?: string;
}

export default async function subscriptionRoutes(fastify: FastifyInstance) {
  // Create a new subscription
  fastify.post<{ Body: CreateSubscriptionBody }>(
    '/api/v1/subscriptions',
    {
      schema: {
        body: {
          type: 'object',
          required: ['planId', 'customerEmail', 'customerName'],
          properties: {
            planId: { type: 'string' },
            customerEmail: { type: 'string', format: 'email' },
            customerName: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateSubscriptionBody }>, reply: FastifyReply) => {
      try {
        const { planId, customerEmail, customerName } = request.body;

        // Get plan details from database (mock for now)
        const planPrices: Record<string, number> = {
          'basic': 1000,    // $10 SGD
          'pro': 2000,      // $20 SGD
          'unlimited': 5000, // $50 SGD
        };

        const amount = planPrices[planId];
        if (!amount) {
          return reply.status(400).send({ error: 'Invalid plan ID' });
        }

        // Create payment request via HitPay
        const payment = await hitpayService.createPaymentRequest({
          amount,
          currency: 'SGD',
          reference_id: `sub_${Date.now()}_${customerEmail}`,
          description: `PotLuck ${planId} Subscription - ${customerName}`,
          redirect_url: `${process.env.FRONTEND_URL}/subscription/success`,
        });

        return reply.send({
          success: true,
          paymentUrl: payment.url,
          paymentId: payment.id,
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ error: error.message });
      }
    }
  );

  // Get subscription status
  fastify.get<{ Querystring: GetSubscriptionQuery }>(
    '/api/v1/subscriptions/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        
        // In production, fetch from database
        const subscription = {
          id,
          status: 'active',
          plan: 'pro',
          amount: 2000,
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        return reply.send(subscription);
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ error: error.message });
      }
    }
  );

  // Cancel subscription
  fastify.delete<{ Params: { id: string } }>(
    '/api/v1/subscriptions/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        
        // In production, cancel in database and via payment provider
        
        return reply.send({ success: true, message: 'Subscription cancelled' });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ error: error.message });
      }
    }
  );

  // Get subscription invoice/history
  fastify.get(
    '/api/v1/subscriptions/:id/invoices',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        
        // Mock invoices
        const invoices = [
          {
            id: 'inv_001',
            date: '2026-03-01',
            amount: 2000,
            status: 'paid',
            description: 'PotLuck Pro Subscription - March 2026',
          },
          {
            id: 'inv_002',
            date: '2026-02-01',
            amount: 2000,
            status: 'paid',
            description: 'PotLuck Pro Subscription - February 2026',
          },
        ];

        return reply.send({ invoices });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ error: error.message });
      }
    }
  );
}
