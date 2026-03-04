import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { hitpayService } from '../services/hitpay';
import { config } from '../config';

// Plan configuration
const SUBSCRIPTION_PLANS = {
  basic: { name: 'PotLuck Basic', amount: 1000, frequency: 'monthly' as const },
  pro: { name: 'PotLuck Pro', amount: 2000, frequency: 'monthly' as const },
  unlimited: { name: 'PotLuck Unlimited', amount: 5000, frequency: 'monthly' as const },
};

interface CreateSubscriptionBody {
  planId: 'basic' | 'pro' | 'unlimited';
  customerEmail: string;
  customerName: string;
}

interface SubscriptionQuery {
  subscriptionId?: string;
}

export default async function subscriptionRoutes(fastify: FastifyInstance) {
  // Health check for HitPay
  fastify.get('/api/v1/subscriptions/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Try to get business info as health check
      const business = await hitpayService.getBusiness();
      return reply.send({ 
        status: 'connected', 
        business: business.name || 'HitPay Account',
      });
    } catch (error: any) {
      return reply.status(500).send({ 
        status: 'error', 
        message: error.message 
      });
    }
  });

  // Get available subscription plans
  fastify.get('/api/v1/subscriptions/plans', async (request: FastifyRequest, reply: FastifyReply) => {
    const plans = Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => ({
      id,
      name: plan.name,
      amount: plan.amount,
      currency: 'SGD',
      frequency: plan.frequency,
    }));
    return reply.send({ plans });
  });

  // Get all HitPay recurring plans
  fastify.get('/api/v1/subscriptions/hitpay-plans', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const plans = await hitpayService.getRecurringPlans();
      return reply.send({ plans });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create a subscription for a chef
  fastify.post<{ Body: CreateSubscriptionBody }>(
    '/api/v1/subscriptions',
    {
      schema: {
        body: {
          type: 'object',
          required: ['planId', 'customerEmail', 'customerName'],
          properties: {
            planId: { type: 'string', enum: ['basic', 'pro', 'unlimited'] },
            customerEmail: { type: 'string', format: 'email' },
            customerName: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateSubscriptionBody }>, reply: FastifyReply) => {
      try {
        const { planId, customerEmail, customerName } = request.body;
        
        // Get plan details
        const plan = SUBSCRIPTION_PLANS[planId];
        if (!plan) {
          return reply.status(400).send({ error: 'Invalid plan ID' });
        }

        // Generate unique reference
        const referenceId = `chef_${Date.now()}_${customerEmail.replace('@', '_at_')}`;

        // First, create a recurring plan in HitPay (or get existing)
        let hitpayPlanId: string;
        
        try {
          // Try to get existing plans
          const existingPlans = await hitpayService.getRecurringPlans();
          
          // Find plan with matching amount and frequency
          const matchingPlan = existingPlans.find(
            (p: any) => p.amount === plan.amount && p.frequency === plan.frequency
          );

          if (matchingPlan) {
            hitpayPlanId = matchingPlan.id;
          } else {
            // Create new plan
            const newPlan = await hitpayService.createRecurringPlan({
              name: plan.name,
              amount: plan.amount,
              frequency: plan.frequency,
              reference_id: `plan_${planId}`,
            });
            hitpayPlanId = newPlan.id;
          }
        } catch (planError: any) {
          // If can't fetch/create plans, create a one-time payment as fallback
          console.error('HitPay plan error, using one-time payment:', planError.message);
          
          const payment = await hitpayService.createPaymentRequest({
            amount: plan.amount,
            reference_id: referenceId,
            description: `${plan.name} - ${customerName}`,
          });

          return reply.send({
            success: true,
            paymentUrl: payment.url,
            paymentId: payment.id,
            type: 'one_time',
            message: 'Please complete payment to activate subscription',
          });
        }

        // Activate the recurring plan for this customer
        const subscription = await hitpayService.activateRecurringPlan(
          hitpayPlanId,
          customerEmail,
          referenceId
        );

        return reply.send({
          success: true,
          subscriptionId: subscription.id || referenceId,
          plan: planId,
          planName: plan.name,
          amount: plan.amount,
          customerEmail,
          type: 'recurring',
          message: 'Subscription activated successfully',
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ 
          error: error.message,
          details: 'Failed to create subscription. Please try again or use alternative payment.'
        });
      }
    }
  );

  // Get subscription status
  fastify.get<{ Params: { id: string } }>(
    '/api/v1/subscriptions/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        
        // In production, fetch from database
        // For now, return mock data
        const subscription = {
          id,
          status: 'active',
          plan: 'pro',
          amount: 2000,
          currency: 'SGD',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
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
        
        // In production, cancel via payment provider and database
        
        return reply.send({ 
          success: true, 
          message: 'Subscription cancelled successfully' 
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ error: error.message });
      }
    }
  );

  // Get subscription invoices/history
  fastify.get(
    '/api/v1/subscriptions/:id/invoices',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        
        // Mock invoices - in production, fetch from database
        const invoices = [
          {
            id: 'INV-2026-003',
            date: '2026-03-01',
            amount: 2000,
            status: 'paid',
            description: 'PotLuck Pro Subscription - March 2026',
            paidAt: '2026-03-01T10:00:00Z',
          },
          {
            id: 'INV-2026-002',
            date: '2026-02-01',
            amount: 2000,
            status: 'paid',
            description: 'PotLuck Pro Subscription - February 2026',
            paidAt: '2026-02-01T10:00:00Z',
          },
          {
            id: 'INV-2026-001',
            date: '2026-01-01',
            amount: 2000,
            status: 'paid',
            description: 'PotLuck Pro Subscription - January 2026',
            paidAt: '2026-01-01T10:00:00Z',
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
